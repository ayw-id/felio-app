import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Plus,
  Edit,
  Trash2,
  MapPin,
  CreditCard,
  Wallet,
  QrCode,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface PaymentMethod {
  id: string;
  type: "cash" | "bank_transfer" | "payment_gateway";
  name: string;
  enabled: boolean;
  details?: {
    accountNumber?: string;
    accountName?: string;
    bankName?: string;
    gatewayType?: "virtual_account" | "e_wallet" | "qris";
    provider?: string;
  };
}

const PaymentSettings = () => {
  const { toast } = useToast();
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);
  const [editingPayment, setEditingPayment] = useState<PaymentMethod | null>(
    null
  );

  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([
    {
      id: "1",
      type: "cash",
      name: "Cash",
      enabled: true,
    },
    {
      id: "2",
      type: "bank_transfer",
      name: "Bank Transfer - BCA",
      enabled: true,
      details: {
        accountNumber: "1234567890",
        accountName: "Your Business Name",
        bankName: "Bank Central Asia",
      },
    },
    {
      id: "3",
      type: "payment_gateway",
      name: "GoPay",
      enabled: true,
      details: {
        gatewayType: "e_wallet",
        provider: "GoPay",
      },
    },
  ]);

  const [paymentForm, setPaymentForm] = useState<{
    type: "cash" | "bank_transfer" | "payment_gateway";
    name: string;
    enabled: boolean;
    accountNumber: string;
    accountName: string;
    bankName: string;
    gatewayType: "virtual_account" | "e_wallet" | "qris";
    provider: string;
  }>({
    type: "cash",
    name: "",
    enabled: true,
    accountNumber: "",
    accountName: "",
    bankName: "",
    gatewayType: "virtual_account",
    provider: "",
  });

  const handleSavePayment = () => {
    if (!paymentForm.name) {
      toast({
        title: "Error",
        description: "Please enter a payment method name",
        variant: "destructive",
      });
      return;
    }

    const details: any = {};
    if (paymentForm.type === "bank_transfer") {
      if (
        !paymentForm.accountNumber ||
        !paymentForm.accountName ||
        !paymentForm.bankName
      ) {
        toast({
          title: "Error",
          description: "Please fill in all bank transfer details",
          variant: "destructive",
        });
        return;
      }
      details.accountNumber = paymentForm.accountNumber;
      details.accountName = paymentForm.accountName;
      details.bankName = paymentForm.bankName;
    } else if (paymentForm.type === "payment_gateway") {
      if (!paymentForm.provider) {
        toast({
          title: "Error",
          description: "Please enter the payment gateway provider",
          variant: "destructive",
        });
        return;
      }
      details.gatewayType = paymentForm.gatewayType;
      details.provider = paymentForm.provider;
    }

    if (editingPayment) {
      setPaymentMethods(
        paymentMethods.map((payment) =>
          payment.id === editingPayment.id
            ? {
                ...payment,
                name: paymentForm.name,
                enabled: paymentForm.enabled,
                details: Object.keys(details).length > 0 ? details : undefined,
              }
            : payment
        )
      );
      toast({
        title: "Success",
        description: "Payment method updated successfully",
      });
    } else {
      const newPayment: PaymentMethod = {
        id: Date.now().toString(),
        type: paymentForm.type,
        name: paymentForm.name,
        enabled: paymentForm.enabled,
        details: Object.keys(details).length > 0 ? details : undefined,
      };
      setPaymentMethods([...paymentMethods, newPayment]);
      toast({
        title: "Success",
        description: "Payment method created successfully",
      });
    }

    setPaymentForm({
      type: "cash",
      name: "",
      enabled: true,
      accountNumber: "",
      accountName: "",
      bankName: "",
      gatewayType: "virtual_account",
      provider: "",
    });
    setEditingPayment(null);
    setIsPaymentDialogOpen(false);
  };

  const handleEditPayment = (payment: PaymentMethod) => {
    setEditingPayment(payment);
    setPaymentForm({
      type: payment.type,
      name: payment.name,
      enabled: payment.enabled,
      accountNumber: payment.details?.accountNumber || "",
      accountName: payment.details?.accountName || "",
      bankName: payment.details?.bankName || "",
      gatewayType: payment.details?.gatewayType || "virtual_account",
      provider: payment.details?.provider || "",
    });
    setIsPaymentDialogOpen(true);
  };

  const handleDeletePayment = (paymentId: string) => {
    setPaymentMethods(
      paymentMethods.filter((payment) => payment.id !== paymentId)
    );
    toast({
      title: "Success",
      description: "Payment method deleted successfully",
    });
  };

  const togglePaymentStatus = (paymentId: string) => {
    setPaymentMethods(
      paymentMethods.map((payment) =>
        payment.id === paymentId
          ? { ...payment, enabled: !payment.enabled }
          : payment
      )
    );
  };

  const getPaymentIcon = (type: string, gatewayType?: string) => {
    if (type === "cash") return <CreditCard className="w-4 h-4" />;
    if (type === "bank_transfer") return <MapPin className="w-4 h-4" />;
    if (type === "payment_gateway") {
      if (gatewayType === "e_wallet") return <Wallet className="w-4 h-4" />;
      if (gatewayType === "qris") return <QrCode className="w-4 h-4" />;
      return <CreditCard className="w-4 h-4" />;
    }
    return <CreditCard className="w-4 h-4" />;
  };

  return (
    <>
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Payment Methods</h3>
        <Dialog
          open={isPaymentDialogOpen}
          onOpenChange={setIsPaymentDialogOpen}
        >
          <DialogTrigger asChild>
            <Button
              onClick={() => {
                setEditingPayment(null);
                setPaymentForm({
                  type: "cash",
                  name: "",
                  enabled: true,
                  accountNumber: "",
                  accountName: "",
                  bankName: "",
                  gatewayType: "virtual_account",
                  provider: "",
                });
              }}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Payment Method
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>
                {editingPayment ? "Edit Payment Method" : "Add Payment Method"}
              </DialogTitle>
              <DialogDescription>
                Configure payment methods available to customers
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="paymentType">Payment Type</Label>
                <select
                  id="paymentType"
                  className="w-full p-2 border rounded-md"
                  value={paymentForm.type}
                  onChange={(e) =>
                    setPaymentForm({
                      ...paymentForm,
                      type: e.target.value as
                        | "cash"
                        | "bank_transfer"
                        | "payment_gateway",
                    })
                  }
                >
                  <option value="cash">Cash</option>
                  <option value="bank_transfer">Bank Transfer</option>
                  <option value="payment_gateway">Payment Gateway</option>
                </select>
              </div>

              <div>
                <Label htmlFor="paymentName">Payment Method Name *</Label>
                <Input
                  id="paymentName"
                  value={paymentForm.name}
                  onChange={(e) =>
                    setPaymentForm({ ...paymentForm, name: e.target.value })
                  }
                  placeholder="e.g., Cash, BCA Transfer, GoPay"
                />
              </div>

              {paymentForm.type === "bank_transfer" && (
                <>
                  <div>
                    <Label htmlFor="bankName">Bank Name *</Label>
                    <Input
                      id="bankName"
                      value={paymentForm.bankName}
                      onChange={(e) =>
                        setPaymentForm({
                          ...paymentForm,
                          bankName: e.target.value,
                        })
                      }
                      placeholder="e.g., Bank Central Asia"
                    />
                  </div>
                  <div>
                    <Label htmlFor="accountName">Account Name *</Label>
                    <Input
                      id="accountName"
                      value={paymentForm.accountName}
                      onChange={(e) =>
                        setPaymentForm({
                          ...paymentForm,
                          accountName: e.target.value,
                        })
                      }
                      placeholder="Account holder name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="accountNumber">Account Number *</Label>
                    <Input
                      id="accountNumber"
                      value={paymentForm.accountNumber}
                      onChange={(e) =>
                        setPaymentForm({
                          ...paymentForm,
                          accountNumber: e.target.value,
                        })
                      }
                      placeholder="Bank account number"
                    />
                  </div>
                </>
              )}

              {paymentForm.type === "payment_gateway" && (
                <>
                  <div>
                    <Label htmlFor="gatewayType">Gateway Type</Label>
                    <select
                      id="gatewayType"
                      className="w-full p-2 border rounded-md"
                      value={paymentForm.gatewayType}
                      onChange={(e) =>
                        setPaymentForm({
                          ...paymentForm,
                          gatewayType: e.target.value as
                            | "virtual_account"
                            | "e_wallet"
                            | "qris",
                        })
                      }
                    >
                      <option value="virtual_account">Virtual Account</option>
                      <option value="e_wallet">E-Wallet</option>
                      <option value="qris">QRIS</option>
                    </select>
                  </div>
                  <div>
                    <Label htmlFor="provider">Provider *</Label>
                    <Input
                      id="provider"
                      value={paymentForm.provider}
                      onChange={(e) =>
                        setPaymentForm({
                          ...paymentForm,
                          provider: e.target.value,
                        })
                      }
                      placeholder="e.g., GoPay, OVO, DANA, ShopeePay"
                    />
                  </div>
                </>
              )}

              <div className="flex items-center space-x-2">
                <Switch
                  id="paymentEnabled"
                  checked={paymentForm.enabled}
                  onCheckedChange={(checked) =>
                    setPaymentForm({ ...paymentForm, enabled: checked })
                  }
                />
                <Label htmlFor="paymentEnabled">
                  Enable this payment method
                </Label>
              </div>

              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => setIsPaymentDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button onClick={handleSavePayment}>
                  {editingPayment ? "Update" : "Create"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Payment Method</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Details</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paymentMethods.map((payment) => (
              <TableRow key={payment.id}>
                <TableCell className="flex items-center gap-2">
                  {getPaymentIcon(payment.type, payment.details?.gatewayType)}
                  {payment.name}
                </TableCell>
                <TableCell className="capitalize">
                  {payment.type.replace("_", " ")}
                </TableCell>
                <TableCell>
                  {payment.details?.bankName && (
                    <div className="text-sm text-gray-600">
                      {payment.details.bankName} -{" "}
                      {payment.details.accountNumber}
                    </div>
                  )}
                  {payment.details?.provider && (
                    <div className="text-sm text-gray-600">
                      {payment.details.provider} (
                      {payment.details.gatewayType?.replace("_", " ")})
                    </div>
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={payment.enabled}
                      onCheckedChange={() => togglePaymentStatus(payment.id)}
                    />
                    <Badge variant={payment.enabled ? "default" : "secondary"}>
                      {payment.enabled ? "Enabled" : "Disabled"}
                    </Badge>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditPayment(payment)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="outline" size="sm">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            Delete Payment Method
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete this payment method?
                            This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDeletePayment(payment.id)}
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  );
};

export default PaymentSettings;
