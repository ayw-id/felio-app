import { useLanguage } from "@/lib/LanguageContext";
import { Calendar, Clock, CheckCircle } from "lucide-react";

const CurriculumSection = () => {
  const { t } = useLanguage();
  
  return (
    <section id="curriculum" className="bg-muted/50 py-20 lg:py-28">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-2xl text-center">
          <span className="mb-4 inline-block text-sm font-semibold uppercase tracking-wider text-primary">
            {t.curriculum}
          </span>
          <h2 className="mb-4 text-3xl font-bold text-foreground sm:text-4xl">
            {t.curriculumTitle}
          </h2>
          <p className="text-lg text-muted-foreground">
            {t.curriculumSubtitle}
          </p>
        </div>
        
        <div className="mx-auto mt-16 max-w-4xl">
          <div className="space-y-4">
            {t.courses.map((course, index) => (
              <div
                key={index}
                className={`relative overflow-hidden rounded-2xl bg-card p-6 shadow-card transition-all hover:shadow-lg ${
                  course.isComingSoon ? "opacity-70" : ""
                }`}
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-4">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-hero text-lg font-bold text-primary-foreground">
                        {index + 1}
                      </div>
                      <h3 className="text-lg font-semibold text-foreground">
                        {course.title}
                      </h3>
                    </div>
                    {course.topics && course.topics.length > 0 && (
                      <ul className="ml-14 mt-3 space-y-2">
                        {course.topics.map((topic, topicIndex) => (
                          <li key={topicIndex} className="flex items-start gap-2 text-sm text-muted-foreground">
                            <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                            <span>{topic}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                  <div className="flex shrink-0 items-center gap-2 sm:ml-4">
                    {course.isComingSoon ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-muted px-3 py-1 text-sm font-medium text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        {t.comingSoon}
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
                        <Calendar className="h-4 w-4" />
                        {course.date}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CurriculumSection;