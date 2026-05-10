import { useLanguage } from "@/lib/LanguageContext";
import { baseUrl } from "@/lib/utils";
import { Link } from "react-router-dom";

const Footer = () => {
  const { t, language } = useLanguage();
  
  return (
    <footer className="bg-background py-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-hero" >
              <img src="/academy/favicon.png" />
            </div>
            <span className="text-lg font-bold text-foreground">AI Mini Bootcamp</span>
          </div>
          
          <nav className="flex flex-wrap justify-center gap-6 text-sm text-muted-foreground">
            {/* <a href="#" className="transition-colors hover:text-foreground">{t.about}</a> */}
            <a href="#curriculum" className="transition-colors hover:text-foreground">{t.curriculum}</a>
            <a href="#faq" className="transition-colors hover:text-foreground">{t.faq}</a>
            {/* <a href="#" className="transition-colors hover:text-foreground">{t.contact}</a> */}
            <Link to={baseUrl + "/privacy"} className="transition-colors hover:text-foreground">{t.privacy}</Link>
            <Link to={baseUrl + "/refund-policy"} className="transition-colors hover:text-foreground">
              {language === "id" ? "Kebijakan Refund" : "Refund Policy"}
            </Link>
          </nav>
          
          <p className="text-sm text-muted-foreground">
            © 2024 Felio Academy. {t.allRightsReserved}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
