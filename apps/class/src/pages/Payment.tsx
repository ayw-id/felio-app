import { useLanguage } from "@/lib/LanguageContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, CreditCard, Loader2, AlertCircle, Copy, X, Tag } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { useCallback, useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import { QRCodeSVG } from "qrcode.react";
import { useSelectedCourses } from "@/hooks/useSelectedCourses";
import { baseUrl } from "@/lib/utils";

const COUNTRY_CODES = [
  { code: "+62", country: "ID", flag: "🇮🇩" },
  { code: "+1", country: "US", flag: "🇺🇸" },
  { code: "+44", country: "UK", flag: "🇬🇧" },
  { code: "+65", country: "SG", flag: "🇸🇬" },
  { code: "+60", country: "MY", flag: "🇲🇾" },
  { code: "+61", country: "AU", flag: "🇦🇺" },
  { code: "+81", country: "JP", flag: "🇯🇵" },
  { code: "+82", country: "KR", flag: "🇰🇷" },
  { code: "+86", country: "CN", flag: "🇨🇳" },
  { code: "+91", country: "IN", flag: "🇮🇳" },
];
const translations = {
  id: {
    title: "Pembayaran",
    subtitle: "Selesaikan pembayaran untuk mengakses kursus",
    courseTitle: "AI Mastery Course",
    discount: "Hemat 50%",
    features: [
      "Akses seumur hidup ke semua materi",
      "Modul pembelajaran komprehensif",
      "Proyek praktik langsung",
      "Diskon khusus untuk bergabung di kelas lanjutan",
      "Komunitas eksklusif"
    ],
    payNow: "Bayar Sekarang",
    securePayment: "Pembayaran aman dan terenkripsi",
    loading: "Memuat...",
    selectPayment: "Pilih Metode Pembayaran",
    total: "Total",
    redirecting: "Mengarahkan ke halaman registrasi...",
    phoneLabel: "Nomor Telepon OVO",
    phonePlaceholder: "8123456789",
    studentNameLabel: "Nama Mahasiswa",
    studentNamePlaceholder: "Masukkan nama mahasiswa",
    paymentDetails: "Detail Pembayaran",
    dueDate: "Batas Waktu",
    virtualAccount: "Nomor Virtual Account",
    ovoPhone: "Nomor Telepon OVO",
    scanQr: "Scan QR Code untuk membayar",
    copied: "Berhasil disalin!",
    cancelPayment: "Batalkan Pembayaran",
    cancelling: "Membatalkan...",
    yourCourses: "Kursus Kamu",
    free: "Gratis",
    promo: "Promo",
    loadingCourses: "Memuat kursus..."
  },
  en: {
    title: "Payment",
    subtitle: "Complete your payment to access the course",
    courseTitle: "AI Mastery Course",
    discount: "Save 50%",
    features: [
      "Lifetime access to all materials",
      "Comprehensive learning modules",
      "Hands-on practice projects",
      "Special discount to join advance classes",
      "Exclusive community access"
    ],
    payNow: "Pay Now",
    securePayment: "Secure and encrypted payment",
    loading: "Loading...",
    selectPayment: "Select Payment Method",
    total: "Total",
    redirecting: "Redirecting to registration page...",
    phoneLabel: "OVO Phone Number",
    phonePlaceholder: "8123456789",
    studentNameLabel: "Student Name",
    studentNamePlaceholder: "Enter student name",
    paymentDetails: "Payment Details",
    dueDate: "Due Date",
    virtualAccount: "Virtual Account Number",
    ovoPhone: "OVO Phone Number",
    scanQr: "Scan QR Code to pay",
    copied: "Copied!",
    cancelPayment: "Cancel Payment",
    cancelling: "Cancelling...",
    yourCourses: "Your Courses",
    free: "Free",
    promo: "Promo",
    loadingCourses: "Loading courses..."
  }
};

interface PaymentMethod {
  code: string;
  name: string;
}

interface PaymentChannel {
  channelCategory: string;
  methods: PaymentMethod[];
}

interface Payment {
  status: "PENDING" | "PAID" | "FAILED" | "EXPIRED";
  paymentChannel: string;
  paymentMethod: string;
  dueDate: string;
  accountNumber?: string;
  phone?: string;
  checkoutUrl?: string;
  qrString?: string;
}

interface InvoiceData {
  user: {
    name: string;
    phone: string;
    email: string;
  };
  invoice?: {
    total: number;
    payment?: Payment;
  };
  paymentMethods?: PaymentChannel[];
}

const Payment = () => {
  const { language } = useLanguage();
  const t = translations[language];
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);
  const [invoiceData, setInvoiceData] = useState<InvoiceData | null>(null);
  const [selectedMethod, setSelectedMethod] = useState<string>("");
  const [selectedChannel, setSelectedChannel] = useState<string>("");
  const [ovoPhone, setOvoPhone] = useState<string>("");
  const [callingCode, setCallingCode] = useState<string>("+62");
  const [studentName, setStudentName] = useState<string>("");
  const [selectedCourses, setSelectedCourses] = useState([]);

  const invCode = searchParams.get('inv');

  const { data: courses, isLoading: isLoadingCourses } = useSelectedCourses(!!invCode);

  useEffect(() => {
    setSelectedCourses(courses);
  }, [courses])

  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat("id-ID").format(amount);
  };

  const coursesTotal = courses?.reduce((sum, course) => {
    const discountedPrice = course.price - course.discount_amount;
    return sum + discountedPrice;
  }, 0) || 0;

  const fetchInvoice = async (invoiceCode?: string) => {
    const token = localStorage.getItem("token");
    
    if (!token) {
      toast({
        title: "Error",
        description: language === "id" ? "Token tidak ditemukan. Silakan registrasi ulang." : "Token not found. Please register again.",
        variant: "destructive",
      });
      setTimeout(() => navigate("/registration"), 3000);
      return;
    }

    try {
      const response = await fetch(import.meta.env.VITE_WEBINAR_API + "invoice", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(invoiceCode ? { invCode: invoiceCode } : {}),
      });

      const result = await response.json();

      if (result.success === 1) {
        // If checkoutUrl exists, redirect immediately
        if (result.data.invoice?.payment?.checkoutUrl) {
          window.location.href = result.data.invoice.payment.checkoutUrl;
          return;
        }
        setInvoiceData(result.data);
        if (result.data.courses) {
          setSelectedCourses(result.data.courses)
        }
      } else {
        toast({
          title: "Error",
          description: result.msg || (language === "id" ? "Gagal memuat data invoice" : "Failed to load invoice data"),
          variant: "destructive",
        });
        setTimeout(() => navigate("/registration"), 3000);
      }
    } catch (error) {
      console.error("Invoice fetch error:", error);
      toast({
        title: "Error",
        description: language === "id" ? "Terjadi kesalahan. Silakan coba lagi." : "An error occurred. Please try again.",
        variant: "destructive",
      });
      setTimeout(() => navigate("/registration"), 3000);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoice(invCode);
  }, [navigate, language]);

  const isOvoSelected = selectedChannel === "E-Wallet" && selectedMethod.toLowerCase() === "ovo";
  const isRetailSelected = selectedChannel === "Retail Outlet";

  const handlePayment = async () => {
    const selectedCoursesStr = localStorage.getItem('selectedCourses');
    if (!selectedMethod || !selectedChannel) {
      toast({
        title: language === "id" ? "Pilih metode pembayaran" : "Select payment method",
        description: language === "id" ? "Silakan pilih metode pembayaran terlebih dahulu" : "Please select a payment method first",
        variant: "destructive",
      });
      return;
    }

    if (isOvoSelected && !ovoPhone.trim()) {
      toast({
        title: language === "id" ? "Nomor telepon diperlukan" : "Phone number required",
        description: language === "id" ? "Silakan masukkan nomor telepon OVO" : "Please enter your OVO phone number",
        variant: "destructive",
      });
      return;
    }

    if (isRetailSelected && !studentName.trim()) {
      toast({
        title: language === "id" ? "Nama mahasiswa diperlukan" : "Student name required",
        description: language === "id" ? "Silakan masukkan nama mahasiswa" : "Please enter student name",
        variant: "destructive",
      });
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      toast({
        title: "Error",
        description: language === "id" ? "Token tidak ditemukan. Silakan registrasi ulang." : "Token not found. Please register again.",
        variant: "destructive",
      });
      setTimeout(() => navigate("/registration"), 3000);
      return;
    }

    setIsSaving(true);

    try {
      const paymentMethodBody = JSON.stringify({
        type: selectedChannel,
        paymentMethod: selectedMethod,
      });

      const requestBody: Record<string, string> = {
        paymentMethod: paymentMethodBody,
      };

      if (isOvoSelected) {
        requestBody.phone = ovoPhone;
        requestBody.callingCode = callingCode;
      }

      if (isRetailSelected) {
        requestBody.studentName = studentName;
      }

      if (selectedCoursesStr) {
        requestBody.courseIds = selectedCoursesStr;
      }

      const response = await fetch(import.meta.env.VITE_WEBINAR_API + "invoice/saveInvoice", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      const result = await response.json();

      if (result.success === 1) {
        const newInvCode = result.data.invoice;
        location.href = baseUrl + 'payment/?inv=' + newInvCode;
      } else {
        toast({
          title: "Error",
          description: result.msg || (language === "id" ? "Gagal menyimpan invoice" : "Failed to save invoice"),
          variant: "destructive",
        });
        setTimeout(() => navigate("/registration"), 3000);
      }
    } catch (error) {
      console.error("Save invoice error:", error);
      toast({
        title: "Error",
        description: language === "id" ? "Terjadi kesalahan. Silakan coba lagi." : "An error occurred. Please try again.",
        variant: "destructive",
      });
      setTimeout(() => navigate("/registration"), 3000);
    } finally {
      setIsSaving(false);
    }
  };

  const handleSelectMethod = (channelCategory: string, methodCode: string) => {
    setSelectedChannel(channelCategory);
    setSelectedMethod(methodCode);
    // Reset conditional fields when changing payment method
    if (!(channelCategory === "E-Wallet" && methodCode.toLowerCase() === "ovo")) {
      setOvoPhone("");
    }
    if (channelCategory !== "Retail Outlet") {
      setStudentName("");
    }
  };

  const handleCancelPayment = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast({
        title: "Error",
        description: language === "id" ? "Token tidak ditemukan. Silakan registrasi ulang." : "Token not found. Please register again.",
        variant: "destructive",
      });
      setTimeout(() => navigate("/registration"), 3000);
      return;
    }

    setIsCancelling(true);

    try {
      const response = await fetch(import.meta.env.VITE_WEBINAR_API + "invoice/cancelPayment", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ invCode }),
      });

      const result = await response.json();

      if (result.success === 1) {
        // Refetch invoice data
        setIsLoading(true);
        await fetchInvoice();
      } else {
        toast({
          title: "Error",
          description: result.msg || (language === "id" ? "Gagal membatalkan pembayaran" : "Failed to cancel payment"),
          variant: "destructive",
        });
        setTimeout(() => navigate("/registration"), 3000);
      }
    } catch (error) {
      console.error("Cancel payment error:", error);
      toast({
        title: "Error",
        description: language === "id" ? "Terjadi kesalahan. Silakan coba lagi." : "An error occurred. Please try again.",
        variant: "destructive",
      });
      setTimeout(() => navigate("/registration"), 3000);
    } finally {
      setIsCancelling(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat(language === "id" ? "id-ID" : "en-US", {
      style: "currency",
      currency: language === "id" ? "IDR" : "USD",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">{t.loading}</p>
        </div>
      </div>
    );
  }

  if (!invoiceData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="flex flex-col items-center gap-4">
          <AlertCircle className="h-8 w-8 text-destructive" />
          <p className="text-muted-foreground">{t.redirecting}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <LanguageSwitcher />
      
      <Card className="w-full max-w-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">{t.title}</CardTitle>
          <CardDescription>{t.subtitle}</CardDescription>
          <p className="text-sm text-muted-foreground mt-2">
            {invoiceData.user.name} • {invoiceData.user.email}
          </p>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Selected Courses */}
          <div className="space-y-3">
            <h4 className="font-medium flex items-center gap-2">
              <Tag className="h-4 w-4 text-primary" />
              {t.yourCourses}
            </h4>
            {isLoadingCourses ? (
              <div className="flex items-center justify-center py-4">
                <Loader2 className="h-5 w-5 animate-spin text-primary mr-2" />
                <span className="text-sm text-muted-foreground">{t.loadingCourses}</span>
              </div>
            ) : selectedCourses && selectedCourses.length > 0 ? (
              <div className="space-y-2">
                {selectedCourses.map((course) => {
                  const discountedPrice = course.price - course.discount_amount;
                  const hasDiscount = course.discount_amount > 0;
                  const isFree = discountedPrice === 0;
                  
                  return (
                    <div
                      key={course.id}
                      className="bg-muted/50 rounded-lg p-4 flex items-center justify-between gap-4"
                    >
                      <div className="flex-1 min-w-0">
                        <h5 className="font-medium text-sm truncate">{course.title}</h5>
                        {hasDiscount && !isFree && (
                          <p className="text-xs text-muted-foreground line-through">
                            Rp {formatPrice(course.price)}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        {hasDiscount && !isFree && (
                          <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium">
                            {t.promo}
                          </span>
                        )}
                        <span className={`font-bold ${isFree ? 'text-green-600' : 'text-primary'}`}>
                          {isFree ? t.free : `Rp ${formatPrice(discountedPrice)}`}
                        </span>
                      </div>
                    </div>
                  );
                })}
                
                {/* Total */}
                <div className="bg-primary/10 rounded-lg p-4 flex items-center justify-between">
                  <span className="font-semibold">{t.total}</span>
                  <span className="text-2xl font-bold text-primary">
                    {coursesTotal === 0 ? t.free : `Rp ${formatPrice(coursesTotal)}`}
                  </span>
                </div>
              </div>
            ) : null}
          </div>

          {/* Payment Details (if exists) */}
          {invoiceData.invoice?.payment && (
            <div className="bg-muted/30 rounded-lg p-4 space-y-4">
              {/* Cancel Payment Button */}
              {invoiceData.invoice.payment.status !== 'PAID' && (
                <Button
                  variant="destructive"
                  onClick={handleCancelPayment}
                  disabled={isCancelling}
                  className="w-full"
                >
                  {isCancelling ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <X className="mr-2 h-4 w-4" />
                  )}
                  {isCancelling ? t.cancelling : t.cancelPayment}
                </Button>
              )}

              <h4 className="font-medium text-center">{t.paymentDetails}</h4>
              
              {/* Status */}
              <div className="flex justify-between">
                <span className="text-muted-foreground">Status:</span>
                <span className={`font-medium ${
                  invoiceData.invoice.payment.status === "PAID" ? "text-green-500" :
                  invoiceData.invoice.payment.status === "PENDING" ? "text-yellow-500" :
                  "text-destructive"
                }`}>
                  {invoiceData.invoice.payment.status}
                </span>
              </div>

              {/* Payment Channel & Method */}
              <div className="flex justify-between">
                <span className="text-muted-foreground">Channel:</span>
                <span>{invoiceData.invoice.payment.paymentChannel}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Method:</span>
                <span className="uppercase">{invoiceData.invoice.payment.paymentMethod}</span>
              </div>

              {/* Virtual Account Number */}
              {invoiceData.invoice.payment.accountNumber && (
                <div className="space-y-1">
                  <span className="text-muted-foreground text-sm">{t.virtualAccount}:</span>
                  <div className="flex items-center gap-2 bg-background p-3 rounded-lg">
                    <span className="font-mono text-lg font-semibold flex-1">
                      {invoiceData.invoice.payment.accountNumber}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        navigator.clipboard.writeText(invoiceData.invoice!.payment!.accountNumber!);
                        toast({ title: t.copied });
                      }}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}

              {/* OVO Phone */}
              {invoiceData.invoice.payment.phone && (
                <div className="space-y-1">
                  <span className="text-muted-foreground text-sm">{t.ovoPhone}:</span>
                  <div className="flex items-center gap-2 bg-background p-3 rounded-lg">
                    <span className="font-mono text-lg font-semibold flex-1">
                      {invoiceData.invoice.payment.phone}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        navigator.clipboard.writeText(invoiceData.invoice!.payment!.phone!);
                        toast({ title: t.copied });
                      }}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}

              {/* QRIS QR Code */}
              {invoiceData.invoice.payment.qrString && (
                <div className="flex flex-col items-center gap-3">
                  <span className="text-muted-foreground text-sm">{t.scanQr}</span>
                  <div className="bg-white p-4 rounded-lg">
                    <QRCodeSVG 
                      value={invoiceData.invoice.payment.qrString} 
                      size={200}
                      level="M"
                    />
                  </div>
                </div>
              )}

              {/* Due Date */}
              <div className="flex justify-between pt-2 border-t border-border">
                <span className="text-muted-foreground">{t.dueDate}:</span>
                <span className="font-medium">{invoiceData.invoice.payment.dueDate}</span>
              </div>
            </div>
          )}

          {/* Payment Methods */}
          {invoiceData.paymentMethods && invoiceData.paymentMethods.length > 0 && !invoiceData.invoice?.payment && (
            <div className="space-y-4">
              <h4 className="font-medium">{t.selectPayment}</h4>
              {invoiceData.paymentMethods.map((channel) => (
                <div key={channel.channelCategory} className="space-y-2">
                  <p className="text-sm text-muted-foreground">{channel.channelCategory}</p>
                  <div className="grid grid-cols-2 gap-2">
                    {channel.methods.map((method) => (
                      <button
                        key={method.code}
                        onClick={() => handleSelectMethod(channel.channelCategory, method.code)}
                        className={`p-3 rounded-lg border text-sm transition-colors ${
                          selectedMethod === method.code && selectedChannel === channel.channelCategory
                            ? "border-primary bg-primary/10 text-primary"
                            : "border-border hover:border-primary/50"
                        }`}
                      >
                        {method.name}
                      </button>
                    ))}
                  </div>
                </div>
              ))}

              {/* OVO Phone Input */}
              {isOvoSelected && (
                <div className="space-y-2">
                  <label className="text-sm font-medium">{t.phoneLabel}</label>
                  <div className="flex gap-2">
                    <Select value={callingCode} onValueChange={setCallingCode}>
                      <SelectTrigger className="w-[100px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {COUNTRY_CODES.map((country) => (
                          <SelectItem key={country.code} value={country.code}>
                            {country.flag} {country.code}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Input
                      type="tel"
                      value={ovoPhone}
                      onChange={(e) => setOvoPhone(e.target.value.replace(/\D/g, ""))}
                      placeholder={t.phonePlaceholder}
                      className="flex-1"
                    />
                  </div>
                </div>
              )}

              {/* Retail Student Name Input */}
              {isRetailSelected && (
                <div className="space-y-2">
                  <label className="text-sm font-medium">{t.studentNameLabel}</label>
                  <Input
                    type="text"
                    value={studentName}
                    onChange={(e) => setStudentName(e.target.value)}
                    placeholder={t.studentNamePlaceholder}
                  />
                </div>
              )}
            </div>
          )}

          {/* Features */}
          <ul className="space-y-3">
            {t.features.map((feature, index) => (
              <li key={index} className="flex items-start gap-3">
                <Check className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                <span className="text-foreground">{feature}</span>
              </li>
            ))}
          </ul>

          {/* Pay Button */}
          {!invoiceData.invoice?.payment && (
            <Button 
              onClick={handlePayment} 
              className="w-full h-12 text-lg"
              size="lg"
              disabled={isSaving}
            >
              {isSaving ? (
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              ) : (
                <CreditCard className="mr-2 h-5 w-5" />
              )}
              {isSaving ? t.loading : t.payNow}
            </Button>
          )}

          <p className="text-center text-sm text-muted-foreground">
            🔒 {t.securePayment}
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Payment;