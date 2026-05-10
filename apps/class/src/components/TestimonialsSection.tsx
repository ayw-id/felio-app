import { useLanguage } from "@/lib/LanguageContext";

const TestimonialsSection = () => {
  const { t } = useLanguage();
  
  return (
    <section className="bg-background py-20 lg:py-28">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-2xl text-center">
          <span className="mb-4 inline-block text-sm font-semibold uppercase tracking-wider text-primary">
            {t.testimonials}
          </span>
          <h2 className="mb-4 text-3xl font-bold text-foreground sm:text-4xl">
            {t.testimonialsTitle}
          </h2>
          <p className="text-lg text-muted-foreground">
            {t.testimonialsSubtitle}
          </p>
        </div>
        
        <div className="mt-16 grid gap-8 md:grid-cols-3">
          {t.testimonialsList.map((testimonial, index) => (
            <div
              key={index}
              className="rounded-2xl bg-card p-8 shadow-card"
            >
              {/* Stars */}
              <div className="mb-4 flex gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <svg key={i} className="h-5 w-5 fill-accent" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              
              {/* Quote */}
              <p className="mb-6 text-foreground">"{testimonial.content}"</p>
              
              {/* Author */}
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-gradient-hero" />
                <div>
                  <p className="font-semibold text-foreground">{testimonial.name}</p>
                  <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;