import { Sparkles, MessageSquare, Image, Zap, Brain, Lightbulb } from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";

const icons = [MessageSquare, Image, Zap, Brain, Lightbulb, Sparkles];

const FeaturesSection = () => {
  const { t } = useLanguage();
  
  return (
    <section className="bg-muted/50 py-20 lg:py-28">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-2xl text-center">
          <span className="mb-4 inline-block text-sm font-semibold uppercase tracking-wider text-primary">
            {t.whatYouWillLearn}
          </span>
          <h2 className="mb-4 text-3xl font-bold text-foreground sm:text-4xl">
            {t.featuresTitle}
          </h2>
          <p className="text-lg text-muted-foreground">
            {t.featuresSubtitle}
          </p>
        </div>
        
        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {t.features.map((feature, index) => {
            const Icon = icons[index];
            return (
              <div
                key={index}
                className="group rounded-2xl bg-card p-8 shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-glow"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-hero text-primary-foreground">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="mb-2 text-xl font-semibold text-foreground">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;