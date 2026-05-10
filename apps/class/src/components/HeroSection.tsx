import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useLanguage } from "@/lib/LanguageContext";
import { baseUrl } from "@/lib/utils";

const HeroSection = () => {
  const { t } = useLanguage();
  
  return (
    <section className="relative overflow-hidden bg-background pt-20 pb-16 lg:pt-28 lg:pb-24">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-accent/20 blur-3xl" />
      </div>
      
      <div className="container relative mx-auto px-4">
        <div className="flex flex-col items-center text-center">
          {/* Badge */}
          <div className="animate-fade-up mb-6 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
            {t.limitedSpots}
            <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
          </div>
          
          {/* Main headline */}
          <h1
            className="animate-fade-up mb-6 max-w-4xl text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl lg:text-6xl"
            style={{ animationDelay: "0.1s" }}
          >
            {t.heroTitle}
          </h1>
          
          {/* Subheadline */}
          <p
            className="animate-fade-up mb-8 max-w-2xl text-lg text-muted-foreground sm:text-xl"
            style={{ animationDelay: "0.2s" }}
          >
            {t.heroSubtitle}
          </p>
          
          {/* CTA buttons */}
          <div
            className="animate-fade-up flex flex-col gap-4 sm:flex-row"
            style={{ animationDelay: "0.3s" }}
          >
            <Button variant="hero" size="lg" asChild>
              <a href="#cta">{t.enrollNow}</a>
            </Button>
            <Button variant="heroOutline" size="lg" asChild>
              <a href="#curriculum">{t.viewCurriculum}</a>
            </Button>
          </div>
          
          {/* Social proof */}
          <div
            className="animate-fade-up mt-10 flex flex-wrap items-center justify-center gap-8 text-sm text-muted-foreground"
            style={{ animationDelay: "0.4s" }}
          >
            <div className="flex items-center gap-2">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="h-8 w-8 rounded-full bg-primary/20 border-2 border-background"
                  />
                ))}
              </div>
            </div>
          </div>
          
          {/* Hero image */}
          <div
            className="animate-scale-in mt-12 w-full max-w-4xl"
            style={{ animationDelay: "0.5s" }}
          >
            <div className="relative rounded-2xl overflow-hidden shadow-card">
              <img
                alt="Diverse group of people learning AI together with laptops"
                className="w-full h-auto"
                src={baseUrl + "lovable-uploads/2737a3fe-f4d8-4ec6-ba14-21532ef5f3b0.png"}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
