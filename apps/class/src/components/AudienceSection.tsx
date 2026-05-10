import { Check } from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";

const AudienceSection = () => {
  const { t } = useLanguage();
  
  return (
    <section className="bg-background py-20 lg:py-28">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-2xl text-center">
          <span className="mb-4 inline-block text-sm font-semibold uppercase tracking-wider text-primary">
            {t.whoIsThisFor}
          </span>
          <h2 className="mb-4 text-3xl font-bold text-foreground sm:text-4xl">
            {t.audienceTitle}
          </h2>
          <p className="text-lg text-muted-foreground">
            {t.audienceSubtitle}
          </p>
        </div>
        
        <div className="mt-16 grid gap-8 lg:grid-cols-3">
          {t.audiences.map((audience, index) => (
            <div
              key={index}
              className="relative overflow-hidden rounded-2xl border border-border bg-gradient-card p-8 transition-all duration-300 hover:border-primary/50"
            >
              <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-primary/5" />
              <h3 className="relative mb-3 text-xl font-semibold text-foreground">
                {audience.title}
              </h3>
              <p className="relative mb-6 text-muted-foreground">
                {audience.description}
              </p>
              <ul className="relative space-y-3">
                {audience.benefits.map((benefit, benefitIndex) => (
                  <li key={benefitIndex} className="flex items-center gap-3">
                    <div className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/10">
                      <Check className="h-3 w-3 text-primary" />
                    </div>
                    <span className="text-sm text-foreground">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AudienceSection;