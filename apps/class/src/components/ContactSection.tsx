import { useState } from "react";
import { useLanguage } from "@/lib/LanguageContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Mail, MessageCircle, Send } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";

const translations = {
  id: {
    contact: "Kontak",
    contactTitle: "Ada Pertanyaan?",
    contactSubtitle: "Hubungi kami kapan saja. Tim kami siap membantu menjawab pertanyaanmu.",
    nameLabel: "Nama",
    namePlaceholder: "Nama lengkap",
    emailLabel: "Email",
    emailPlaceholder: "email@contoh.com",
    phoneLabel: "Nomor WhatsApp",
    phonePlaceholder: "Contoh: 0812xxxxxxx",
    messageLabel: "Pesan",
    messagePlaceholder: "Tulis pesanmu di sini...",
    sendMessage: "Kirim Pesan",
    orContactVia: "Atau hubungi langsung via",
    whatsapp: "WhatsApp",
    email: "Email",
    successMessage: "Pesan berhasil dikirim! Kami akan segera menghubungimu.",
    errorSend: "Gagal mengirim pesan. Coba lagi nanti.",
    errorName: "Nama tidak boleh kosong",
    errorEmail: "Email tidak valid",
    errorPhone: "Nomor WhatsApp tidak valid",
    errorMessage: "Pesan tidak boleh kosong",
  },
  en: {
    contact: "Contact",
    contactTitle: "Have Questions?",
    contactSubtitle: "Reach out to us anytime. Our team is ready to help answer your questions.",
    nameLabel: "Name",
    namePlaceholder: "Full name",
    emailLabel: "Email",
    emailPlaceholder: "email@example.com",
    phoneLabel: "WhatsApp Number",
    phonePlaceholder: "Example: +62812xxxxxxx",
    messageLabel: "Message",
    messagePlaceholder: "Write your message here...",
    sendMessage: "Send Message",
    orContactVia: "Or contact us directly via",
    whatsapp: "WhatsApp",
    email: "Email",
    successMessage: "Message sent successfully! We'll get back to you soon.",
    errorSend: "Failed to send message. Please try again later.",
    errorName: "Name cannot be empty",
    errorEmail: "Invalid email address",
    errorPhone: "Invalid WhatsApp number",
    errorMessage: "Message cannot be empty",
  },
};

const ContactSection = () => {
  const { language } = useLanguage();
  const t = translations[language];
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [errors, setErrors] = useState<{ name?: string; email?: string; phone?: string; message?: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const contactSchema = z.object({
    name: z.string().trim().min(1, { message: t.errorName }).max(100),
    email: z.string().trim().email({ message: t.errorEmail }).max(255),
    phone: z
      .string()
      .trim()
      .min(8, { message: t.errorPhone })
      .max(30, { message: t.errorPhone })
      .regex(/^[0-9+()\-\s]+$/, { message: t.errorPhone }),
    message: z.string().trim().min(1, { message: t.errorMessage }).max(1000),
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const result = contactSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors: { name?: string; email?: string; message?: string } = {};
      result.error.errors.forEach((err) => {
        const field = err.path[0] as keyof typeof fieldErrors;
        fieldErrors[field] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setIsSubmitting(true);
    
    try {
      const res = await fetch(
        import.meta.env.VITE_WEBINAR_API + "contact/sendMessage",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: formData.name.trim(),
            email: formData.email.trim(),
            phone: formData.phone.trim(),
            message: formData.message.trim(),
          }),
        }
      );

      const data = (await res.json().catch(() => null)) as
        | { success?: number }
        | null;

      if (!res.ok || !data || data.success !== 1) {
        throw new Error("CONTACT_SEND_FAILED");
      }

      toast.success(t.successMessage);
      setFormData({ name: "", email: "", phone: "", message: "" });
    } catch {
      toast.error(t.errorSend);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  return (
    <section id="contact" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <span className="inline-block px-4 py-1.5 bg-primary/10 text-primary rounded-full text-sm font-medium mb-4">
            {t.contact}
          </span>
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
            {t.contactTitle}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t.contactSubtitle}
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-5 gap-8">
            {/* Contact Form */}
            <div className="md:col-span-3">
              <form onSubmit={handleSubmit} className="bg-card rounded-2xl p-6 md:p-8 shadow-lg border border-border">
                <div className="space-y-5">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">
                      {t.nameLabel}
                    </label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder={t.namePlaceholder}
                      className={errors.name ? "border-destructive" : ""}
                    />
                    {errors.name && <p className="text-destructive text-sm mt-1">{errors.name}</p>}
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                      {t.emailLabel}
                    </label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder={t.emailPlaceholder}
                      className={errors.email ? "border-destructive" : ""}
                    />
                    {errors.email && <p className="text-destructive text-sm mt-1">{errors.email}</p>}
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-foreground mb-2">
                      {t.phoneLabel}
                    </label>
                    <Input
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder={t.phonePlaceholder}
                      className={errors.phone ? "border-destructive" : ""}
                      inputMode="tel"
                      autoComplete="tel"
                    />
                    {errors.phone && <p className="text-destructive text-sm mt-1">{errors.phone}</p>}
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-foreground mb-2">
                      {t.messageLabel}
                    </label>
                    <Textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder={t.messagePlaceholder}
                      rows={4}
                      className={errors.message ? "border-destructive" : ""}
                    />
                    {errors.message && <p className="text-destructive text-sm mt-1">{errors.message}</p>}
                  </div>

                  <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
                    <Send size={18} className="mr-2" />
                    {isSubmitting ? "..." : t.sendMessage}
                  </Button>
                </div>
              </form>
            </div>

            {/* Contact Info */}
            <div className="md:col-span-2 flex flex-col justify-center">
              <p className="text-muted-foreground mb-6 text-center md:text-left">
                {t.orContactVia}
              </p>

              <div className="space-y-4">
                <a
                  href="https://wa.me/6281234567890"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 p-4 bg-card rounded-xl border border-border hover:border-primary/50 hover:shadow-md transition-all group"
                >
                  <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center text-green-600 group-hover:bg-green-500 group-hover:text-white transition-colors">
                    <MessageCircle size={22} />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">{t.whatsapp}</p>
                    <p className="text-sm text-muted-foreground">+62 812-3456-7890</p>
                  </div>
                </a>

                <a
                  href="mailto:hello@felio.id"
                  className="flex items-center gap-4 p-4 bg-card rounded-xl border border-border hover:border-primary/50 hover:shadow-md transition-all group"
                >
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    <Mail size={22} />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">{t.email}</p>
                    <p className="text-sm text-muted-foreground">hello@felio.id</p>
                  </div>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;