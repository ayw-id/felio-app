import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Check, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/lib/LanguageContext";
import { Checkbox } from "@/components/ui/checkbox";
import { useCourses } from "@/hooks/useCourses";
import { baseUrl } from "@/lib/utils";

const CTASection = () => {
  const { t, language } = useLanguage();
  const [selectedCourses, setSelectedCourses] = useState<string[]>([]);
  const { data: courses, isLoading, isError } = useCourses();
  const navigate = useNavigate();

  const handleEnroll = () => {
    if (selectedCourses.length === 0) return;
    localStorage.setItem('selectedCourses', JSON.stringify(selectedCourses));
    navigate(baseUrl + '/register');
  };

  const toggleCourse = (courseId: string) => {
    setSelectedCourses((prev) =>
      prev.includes(courseId)
        ? prev.filter((id) => id !== courseId)
        : [...prev, courseId]
    );
  };

  const calculateTotal = () => {
    if (!courses) return 0;
    return courses
      .filter((course) => selectedCourses.includes(course.id))
      .reduce((sum, course) => sum + (course.price - course.discount_amount), 0);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID").format(price);
  };

  const total = calculateTotal();

  return (
    <section id="cta" className="relative overflow-hidden bg-foreground py-20 lg:py-28">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-primary/20 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-accent/10 blur-3xl" />
      </div>

      <div className="container relative mx-auto px-4">
        <div className="mx-auto max-w-4xl text-center">
          <span className="mb-4 inline-block rounded-full bg-primary/20 px-4 py-1 text-sm font-semibold text-primary">
            {t.limitedTimeOffer}
          </span>
          <h2 className="mb-4 text-3xl font-bold text-background sm:text-4xl lg:text-5xl">
            {t.ctaTitle}
          </h2>
          <p className="mb-12 text-lg text-background/70">{t.ctaSubtitle}</p>

          {/* Pricing cards */}
          <div className="mb-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {isLoading && (
              <div className="col-span-full flex justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            )}
            {isError && (
              <div className="col-span-full text-center text-background/70">
                {language === "id" ? "Gagal memuat data kursus" : "Failed to load courses"}
              </div>
            )}
            {courses?.filter(course => course.status === "open").map((course) => {
              const isSelected = selectedCourses.includes(course.id);
              const originalPrice = course.price;
              const discountedPrice = course.price - course.discount_amount;
              const hasDiscount = course.discount_amount > 0;

              return (
                <div
                  key={course.id}
                  onClick={() => toggleCourse(course.id)}
                  className={`relative cursor-pointer overflow-hidden rounded-2xl bg-card p-6 shadow-glow transition-all hover:scale-105 ${
                    isSelected ? "ring-2 ring-primary ring-offset-2 ring-offset-foreground" : ""
                  }`}
                >
                  {/* Checkbox */}
                  <div className="absolute left-4 top-4">
                    <Checkbox
                      checked={isSelected}
                      onCheckedChange={() => toggleCourse(course.id)}
                      className="h-5 w-5"
                    />
                  </div>
                  {hasDiscount && (
                    <span className="absolute right-4 top-4 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground">
                      {language === "id" ? "Promo" : "Promo"}
                    </span>
                  )}
                  <h3 className="mb-4 pl-8 pr-16 text-left text-lg font-semibold text-foreground">
                    {course.title}
                  </h3>
                  <div className="mb-4 text-left">
                    {hasDiscount && (
                      <span className="text-sm text-muted-foreground line-through">
                        Rp {formatPrice(originalPrice)}
                      </span>
                    )}
                    <div className="text-2xl font-bold text-primary">
                      {discountedPrice === 0 ? (language === "id" ? "Gratis" : "Free") : `Rp ${formatPrice(discountedPrice)}`}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Benefits */}
          <div className="mx-auto mb-8 max-w-md rounded-2xl bg-card/10 p-6">
            <ul className="space-y-3">
              {t.benefits.map((benefit, index) => (
                <li key={index} className="flex items-center gap-3">
                  <div className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/20">
                    <Check className="h-3 w-3 text-primary" />
                  </div>
                  <span className="text-sm text-background">{benefit}</span>
                </li>
              ))}
            </ul>
          </div>

          <Button
            variant="hero"
            size="lg"
            disabled={selectedCourses.length === 0}
            className={selectedCourses.length === 0 ? "opacity-50 cursor-not-allowed" : ""}
            onClick={handleEnroll}
          >
            {selectedCourses.length === 0
              ? t.selectCourse
              : `${t.enrollNowTotal} - Rp ${formatPrice(total)}`}
          </Button>

          <p className="mt-4 text-xs text-background/60">
            {t.moneyBackGuarantee}
          </p>
        </div>
      </div>
    </section>
  );
};

export default CTASection;