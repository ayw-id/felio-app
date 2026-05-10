import { LanguageProvider } from "@/lib/LanguageContext";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import HeroSection from "@/components/HeroSection";
import FeaturesSection from "@/components/FeaturesSection";
import AudienceSection from "@/components/AudienceSection";
import CurriculumSection from "@/components/CurriculumSection";
import InstructorSection from "@/components/InstructorSection";
// import TestimonialsSection from "@/components/TestimonialsSection";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";
import ContactSection from "@/components/ContactSection";
import FAQSection from "@/components/FAQSection";

const Index = () => {
  return (
    <LanguageProvider>
      <main className="min-h-screen">
        <LanguageSwitcher />
        <HeroSection />
        <FeaturesSection />
        <AudienceSection />
        <CurriculumSection />
        <InstructorSection />
        {/* <TestimonialsSection /> */}
        <CTASection />
        <FAQSection />
        <ContactSection />
        <Footer />
      </main>
    </LanguageProvider>
  );
};

export default Index;