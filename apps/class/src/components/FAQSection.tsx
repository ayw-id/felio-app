import { useLanguage } from "@/lib/LanguageContext";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FAQSection = () => {
  const { language } = useLanguage();

  const faqs = language === "id" ? [
    {
      question: "Apakah saya perlu latar belakang IT atau programming?",
      answer: "Tidak sama sekali! Bootcamp ini dirancang khusus untuk pemula tanpa background teknis. Jika kamu bisa menggunakan email dan browsing internet, kamu sudah siap untuk belajar.",
    },
    {
      question: "Bagaimana format pembelajarannya?",
      answer: "Pembelajaran dilakukan secara online melalui webinar live. Kamu akan mendapat akses ke rekaman video, slide presentasi, dan materi pendukung yang bisa diakses kapan saja selamanya.",
    },
    // {
    //   question: "Apakah ada sertifikat setelah selesai?",
    //   answer: "Ya! Setiap peserta yang menyelesaikan kelas akan mendapatkan sertifikat kelulusan digital yang bisa ditambahkan ke portfolio atau LinkedIn.",
    // },
    {
      question: "Berapa lama akses ke materi pembelajaran?",
      answer: "Kamu mendapat akses selamanya ke semua materi termasuk rekaman video, slide, dan update materi di masa depan.",
    },
    {
      question: "Bagaimana jika saya tidak bisa hadir di sesi live?",
      answer: "Tidak masalah! Semua sesi akan direkam dan kamu bisa menonton rekaman kapan saja. Kamu juga bisa bertanya melalui grup komunitas.",
    },
    {
      question: "Apakah ada garansi uang kembali?",
      answer: "Ya, kami memberikan garansi kepuasan. Bisa dicek di halaman Kebijakan Refund.",
    },
  ] : [
    {
      question: "Do I need an IT or programming background?",
      answer: "Not at all! This bootcamp is specifically designed for beginners without a technical background. If you can use email and browse the internet, you're ready to learn.",
    },
    {
      question: "What is the learning format?",
      answer: "Learning is conducted online through live webinars. You'll get access to video recordings, presentation slides, and supporting materials that you can access anytime, forever.",
    },
    // {
    //   question: "Is there a certificate after completion?",
    //   answer: "Yes! Every participant who completes the class will receive a digital certificate that can be added to their portfolio or LinkedIn.",
    // },
    {
      question: "How long is the access to learning materials?",
      answer: "You get lifetime access to all materials including video recordings, slides, and future material updates.",
    },
    {
      question: "What if I can't attend the live session?",
      answer: "No problem! All sessions will be recorded and you can watch the recordings anytime. You can also ask questions through the community group.",
    },
    {
      question: "Is there a money-back guarantee?",
      answer: "Yes, we offer a satisfaction guarantee. Check out the Refund Policy page.",
    },
  ];

  return (
    <section id="faq" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <span className="inline-block rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary mb-4">
            FAQ
          </span>
          <h2 className="text-3xl font-bold text-foreground md:text-4xl mb-4">
            {language === "id" ? "Pertanyaan yang Sering Ditanyakan" : "Frequently Asked Questions"}
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            {language === "id" 
              ? "Temukan jawaban untuk pertanyaan umum tentang bootcamp kami." 
              : "Find answers to common questions about our bootcamp."}
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="bg-card rounded-xl px-6 border border-border/50 shadow-sm"
              >
                <AccordionTrigger className="text-left font-semibold text-foreground hover:no-underline">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;