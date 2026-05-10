import { Globe } from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";

const LanguageSwitcher = () => {
  const { language, setLanguage } = useLanguage();
  
  return (
    <div className="fixed top-4 right-4 z-50 flex items-center gap-2 rounded-full bg-card/80 backdrop-blur-sm px-3 py-2 shadow-card">
      <Globe className="h-4 w-4 text-muted-foreground" />
      <button
        onClick={() => setLanguage("id")}
        className={`px-2 py-1 text-sm rounded transition-colors ${
          language === "id"
            ? "bg-primary text-primary-foreground"
            : "text-muted-foreground hover:text-foreground"
        }`}
      >
        ID
      </button>
      <button
        onClick={() => setLanguage("en")}
        className={`px-2 py-1 text-sm rounded transition-colors ${
          language === "en"
            ? "bg-primary text-primary-foreground"
            : "text-muted-foreground hover:text-foreground"
        }`}
      >
        EN
      </button>
    </div>
  );
};

export default LanguageSwitcher;