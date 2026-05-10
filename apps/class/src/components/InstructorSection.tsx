import { useLanguage } from "@/lib/LanguageContext";
import { Linkedin, Instagram, Globe } from "lucide-react";

const translations = {
  id: {
    instructor: "Instruktur",
    instructorTitle: "Belajar Dari Praktisi Berpengalaman",
    instructorSubtitle: "Mentor yang akan membimbingmu dalam perjalanan AI.",
    instructorName: "Ainul Yaqin Wahyudin",
    instructorRole: "Programmer, Startup Founder & Tech Educator",
    instructorBio: "Praktisi teknologi dengan pengalaman lebih dari 7 tahun di bidang software development dan AI. Telah membantu ratusan pemula memahami dan menggunakan AI dalam kehidupan sehari-hari dan bisnis mereka.",
    highlights: [
      "7+ tahun pengalaman bekerja di startup Amerika dan singapura",
      "Founder di perusahaan teknologi",
      "Telah melatih 100+ siswa tentang teknologi",
      "Speaker di berbagai tech conference",
    ],
  },
  en: {
    instructor: "Instructor",
    instructorTitle: "Learn From Experienced Practitioners",
    instructorSubtitle: "Your mentor who will guide you in your AI journey.",
    instructorName: "Ainul Yaqin Wahyudin",
    instructorRole: "Programmer, Startup Founder & Tech Educator",
    instructorBio: "Technology practitioner with over 7 years of experience in software development and AI. Has helped hundreds of beginners understand and use AI in their daily lives and businesses.",
    highlights: [
      "7+ years experience in tech industry",
      "Founder at a tech company",
      "Trained 100+ students on technology",
      "Speaker at various tech conferences",
    ],
  },
};

const InstructorSection = () => {
  const { language } = useLanguage();
  const t = translations[language];

  return (
    <section className="py-20 bg-gradient-to-b from-background to-muted/30">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <span className="inline-block px-4 py-1.5 bg-primary/10 text-primary rounded-full text-sm font-medium mb-4">
            {t.instructor}
          </span>
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
            {t.instructorTitle}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t.instructorSubtitle}
          </p>
        </div>

        {/* Instructor Card */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-card rounded-3xl shadow-xl overflow-hidden border border-border">
            <div className="md:flex">
              {/* Photo */}
              <div className="md:w-full bg-gradient-to-br from-primary/20 to-primary/5 p-8 flex items-center justify-center">
                <div className="relative">
                  <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
                  {t.instructorName}
                </h3>
                <p className="text-primary font-medium mb-4">{t.instructorRole}</p>
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  {t.instructorBio}
                </p>

                {/* Highlights */}
                <ul className="space-y-3 mb-6">
                  {t.highlights.map((highlight, index) => (
                    <li key={index} className="flex items-center gap-3">
                      <span className="w-2 h-2 bg-primary rounded-full flex-shrink-0" />
                      <span className="text-foreground text-sm">{highlight}</span>
                    </li>
                  ))}
                </ul>

                {/* Social Links */}
                <div className="flex gap-4">
                  <a
                    href="https://www.linkedin.com/in/ainul-yaqin-wahyudin"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary hover:bg-primary hover:text-primary-foreground transition-colors"
                  >
                    <Linkedin size={18} />
                  </a>
                  {/* <a
                    href="https://instagram.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary hover:bg-primary hover:text-primary-foreground transition-colors"
                  >
                    <Instagram size={18} />
                  </a>
                  <a
                    href="https://felio.id"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary hover:bg-primary hover:text-primary-foreground transition-colors"
                  >
                    <Globe size={18} />
                  </a> */}
                </div>
                  {/* Decorative elements */}
                  <div className="absolute -top-4 -right-4 w-8 h-8 bg-primary/20 rounded-full blur-sm" />
                  <div className="absolute -bottom-2 -left-6 w-12 h-12 bg-primary/15 rounded-full blur-md" />
                </div>
              </div>

              {/* Info */}
              
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default InstructorSection;