import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { ArrowLeft, ArrowRight, Check, Globe, Loader2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { baseUrl } from "@/lib/utils";

const TOTAL_STEPS = 8;

type Language = "id" | "en";

const translations = {
  id: {
    registration: "Pendaftaran",
    stepOf: "Langkah {current} dari {total}",
    back: "Kembali",
    next: "Lanjut",
    submit: "Kirim",
    pleaseSelectAtLeastOne: "Silakan pilih minimal satu opsi",
    pleaseSelectOption: "Silakan pilih satu opsi",
    pleaseFillAllFields: "Silakan isi semua kolom",
    registrationSuccess: "Pendaftaran berhasil!",
    registrationSuccessDesc: "Kami akan segera menghubungi Anda.",
    
    // Step 1
    personalInfo: "Informasi Pribadi",
    name: "Nama Lengkap",
    namePlaceholder: "Nama lengkap Anda",
    email: "Email",
    emailPlaceholder: "email@anda.com",
    phone: "Nomor Telepon",
    phonePlaceholder: "+62 812 3456 7890",
    birthday: "Tanggal Lahir",
    
    // Step 2
    jobActivities: "Pekerjaan / Aktivitas",
    selectAllApply: "Pilih semua yang sesuai",
    jobOptions: ["Karyawan", "Pengusaha", "Freelancer", "Guru/Dosen", "Pelajar/Mahasiswa", "Ibu Rumah Tangga", "Lainnya"],
    pleaseSpecify: "Mohon sebutkan...",
    
    // Step 3
    fieldOfWork: "Bidang Kerja / Minat",
    fieldOptions: ["Pendidikan", "Marketing / Sales", "Keuangan", "Kreatif (Desain, Video, Konten)", "Bisnis", "Administrasi", "Lainnya"],
    
    // Step 4
    itBackground: "Apakah Anda memiliki latar belakang IT?",
    itOptions: [
      { value: "not-at-all", label: "Tidak sama sekali" },
      { value: "a-little", label: "Sedikit (pernah belajar)" },
      { value: "enough", label: "Cukup (pernah menggunakan tools teknis)" },
      { value: "yes", label: "Ya (memiliki latar belakang IT)" },
    ],
    
    // Step 5
    toolsUsed: "Tools apa saja yang pernah Anda gunakan?",
    toolsUsedDesc: "Sebutkan software, aplikasi, atau tools yang pernah Anda gunakan",
    toolsPlaceholder: "contoh: Microsoft Office, Canva, ChatGPT, Google Sheets...",
    
    // Step 6
    aiFrequency: "Seberapa sering Anda menggunakan tools AI saat ini?",
    aiFrequencyOptions: [
      { value: "never", label: "Tidak pernah" },
      { value: "sometimes", label: "Kadang-kadang" },
      { value: "almost-everyday", label: "Hampir setiap hari" },
    ],
    
    // Step 7
    goals: "Apa tujuan utama Anda belajar AI?",
    goalOptions: ["Mempermudah pekerjaan", "Meningkatkan produktivitas", "Membantu bisnis / penjualan", "Membuat konten", "Upgrade skill", "Hanya penasaran", "Lainnya"],
    
    // Step 8
    learningFormat: "Format pembelajaran yang paling Anda sukai",
    learningFormatOptions: [
      { value: "webinar", label: "Webinar (teori + demo)" },
      { value: "workshop", label: "Workshop (praktik langsung)" },
      { value: "consultation", label: "Konsultasi di group WA / Telegram" },
      { value: "video", label: "Video rekaman tutorial" },
    ],
  },
  en: {
    registration: "Registration",
    stepOf: "Step {current} of {total}",
    back: "Back",
    next: "Next",
    submit: "Submit",
    pleaseSelectAtLeastOne: "Please select at least one option",
    pleaseSelectOption: "Please select an option",
    pleaseFillAllFields: "Please fill in all fields",
    registrationSuccess: "Registration successful!",
    registrationSuccessDesc: "We'll be in touch soon.",
    
    // Step 1
    personalInfo: "Personal Information",
    name: "Full Name",
    namePlaceholder: "Your full name",
    email: "Email",
    emailPlaceholder: "your@email.com",
    phone: "Phone Number",
    phonePlaceholder: "+62 812 3456 7890",
    birthday: "Birthday",
    
    // Step 2
    jobActivities: "Job / Work Activities",
    selectAllApply: "Select all that apply",
    jobOptions: ["Employee", "Entrepreneur", "Freelancer", "Teacher", "Student", "Housewife", "Other"],
    pleaseSpecify: "Please specify...",
    
    // Step 3
    fieldOfWork: "Field of Work / Interest",
    fieldOptions: ["Education", "Marketing / Sales", "Finance", "Creative (Design, Video, Content)", "Business", "Administration", "Other"],
    
    // Step 4
    itBackground: "Do you have an IT background?",
    itOptions: [
      { value: "not-at-all", label: "Not at all" },
      { value: "a-little", label: "A little (have studied)" },
      { value: "enough", label: "Enough (have used technical tools)" },
      { value: "yes", label: "Yes (IT background)" },
    ],
    
    // Step 5
    toolsUsed: "What tools have you used?",
    toolsUsedDesc: "List any software, apps, or tools you've worked with",
    toolsPlaceholder: "e.g., Microsoft Office, Canva, ChatGPT, Google Sheets...",
    
    // Step 6
    aiFrequency: "How often do you use AI tools nowadays?",
    aiFrequencyOptions: [
      { value: "never", label: "Never" },
      { value: "sometimes", label: "Sometimes" },
      { value: "almost-everyday", label: "Almost Everyday" },
    ],
    
    // Step 7
    goals: "What is your main goal in learning AI?",
    goalOptions: ["Makes work easier", "Increase productivity", "Helping business / sales", "Create content", "Upgrade skills", "Just curious", "Other"],
    
    // Step 8
    learningFormat: "The learning format you prefer most",
    learningFormatOptions: [
      { value: "webinar", label: "Webinar (theory + demo)" },
      { value: "workshop", label: "Workshop (hands-on practice)" },
      { value: "consultation", label: "Consultation in WA / Telegram group" },
      { value: "video", label: "Video tutorials" },
    ],
  },
};

const Registration = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [language, setLanguage] = useState<Language>("id");
  
  const t = translations[language];
  
  // Step 1
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [birthday, setBirthday] = useState("");
  
  // Loading state
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Step 2 - Job/Work Activities
  const [jobActivities, setJobActivities] = useState<string[]>([]);
  const [jobOther, setJobOther] = useState("");
  
  // Step 3 - Field of work/Interest
  const [fieldOfWork, setFieldOfWork] = useState<string[]>([]);
  const [fieldOther, setFieldOther] = useState("");
  
  // Step 4 - IT Background
  const [itBackground, setItBackground] = useState("");
  
  // Step 5 - Tools used
  const [toolsUsed, setToolsUsed] = useState("");
  
  // Step 6 - AI usage frequency
  const [aiFrequency, setAiFrequency] = useState("");
  
  // Step 7 - Goals
  const [goals, setGoals] = useState<string[]>([]);
  const [goalOther, setGoalOther] = useState("");
  
  // Step 8 - Learning format
  const [learningFormat, setLearningFormat] = useState("");

  const handleMultiSelect = (
    value: string,
    selected: string[],
    setSelected: (val: string[]) => void
  ) => {
    if (selected.includes(value)) {
      setSelected(selected.filter((v) => v !== value));
    } else {
      setSelected([...selected, value]);
    }
  };

  const handleNext = async () => {
    // Validation
    if (currentStep === 1) {
      if (!name || !email || !phone || !birthday) {
        toast({ title: t.pleaseFillAllFields, variant: "destructive" });
        return;
      }
    }
    if (currentStep === 2 && jobActivities.length === 0) {
      toast({ title: t.pleaseSelectAtLeastOne, variant: "destructive" });
      return;
    }
    if (currentStep === 3 && fieldOfWork.length === 0) {
      toast({ title: t.pleaseSelectAtLeastOne, variant: "destructive" });
      return;
    }
    if (currentStep === 4 && !itBackground) {
      toast({ title: t.pleaseSelectOption, variant: "destructive" });
      return;
    }
    if (currentStep === 6 && !aiFrequency) {
      toast({ title: t.pleaseSelectOption, variant: "destructive" });
      return;
    }
    if (currentStep === 7 && goals.length === 0) {
      toast({ title: t.pleaseSelectAtLeastOne, variant: "destructive" });
      return;
    }
    if (currentStep === 8 && !learningFormat) {
      toast({ title: t.pleaseSelectOption, variant: "destructive" });
      return;
    }
    
    if (currentStep < TOTAL_STEPS) {
      setCurrentStep(currentStep + 1);
    } else {
      // Submit to API
      setIsSubmitting(true);
      
      try {
        const formData = new FormData();
        formData.append("name", name);
        formData.append("phone", phone);
        formData.append("email", email);
        formData.append("birthday", birthday);
        
        // For job, include "other" value if selected
        const jobValue = jobActivities.includes(otherLabel) && jobOther 
          ? [...jobActivities.filter(j => j !== otherLabel), jobOther]
          : jobActivities;
        formData.append("job", JSON.stringify(jobValue));
        
        // For interest, include "other" value if selected
        const interestValue = fieldOfWork.includes(otherLabel) && fieldOther
          ? [...fieldOfWork.filter(f => f !== otherLabel), fieldOther]
          : fieldOfWork;
        formData.append("interest", JSON.stringify(interestValue));
        
        formData.append("background", itBackground);
        formData.append("ai_tools", toolsUsed);
        formData.append("ai_tools_usage", aiFrequency);
        
        // For goals, include "other" value if selected
        const goalValue = goals.includes(otherLabel) && goalOther
          ? [...goals.filter(g => g !== otherLabel), goalOther]
          : goals;
        formData.append("goal", JSON.stringify(goalValue));
        
        formData.append("learning_format", learningFormat);

        const response = await fetch(import.meta.env.VITE_WEBINAR_API + "auth/register", {
          method: "POST",
          body: formData,
        });

        const result = await response.json();

        if (result.success === 1) {
          localStorage.setItem("token", result.data.token);
          toast({ title: t.registrationSuccess, description: t.registrationSuccessDesc });
          navigate(baseUrl + "/payment");
        } else {
          toast({ title: result.msg || "Registration failed", variant: "destructive" });
        }
      } catch (error) {
        toast({ title: "Network error. Please try again.", variant: "destructive" });
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const otherLabel = language === "id" ? "Lainnya" : "Other";

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="container mx-auto px-4">
        {/* Language Switcher */}
        <div className="absolute top-4 right-4 flex items-center gap-2">
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

        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-foreground mb-2">{t.registration}</h1>
          <p className="text-muted-foreground">
            {t.stepOf.replace("{current}", String(currentStep)).replace("{total}", String(TOTAL_STEPS))}
          </p>
        </div>

        {/* Progress bar */}
        <div className="mx-auto mb-8 max-w-md">
          <div className="flex gap-2">
            {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
              <div
                key={i}
                className={`h-2 flex-1 rounded-full transition-colors ${
                  i + 1 <= currentStep ? "bg-primary" : "bg-muted"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Form container */}
        <div className="mx-auto max-w-lg rounded-2xl bg-card p-8 shadow-card">
          {/* Step 1 - Personal Info */}
          {currentStep === 1 && (
            <div className="space-y-6 animate-fade-in">
              <h2 className="text-xl font-semibold text-foreground mb-4">{t.personalInfo}</h2>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">{t.name}</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder={t.namePlaceholder}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="email">{t.email}</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder={t.emailPlaceholder}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="phone">{t.phone}</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder={t.phonePlaceholder}
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="birthday">{t.birthday}</Label>
                  <Input
                    id="birthday"
                    type="date"
                    value={birthday}
                    onChange={(e) => setBirthday(e.target.value)}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 2 - Job/Work Activities */}
          {currentStep === 2 && (
            <div className="space-y-6 animate-fade-in">
              <h2 className="text-xl font-semibold text-foreground mb-4">{t.jobActivities}</h2>
              <p className="text-sm text-muted-foreground mb-4">{t.selectAllApply}</p>
              <div className="space-y-3">
                {t.jobOptions.map((option, index) => (
                  <div key={option} className="flex items-center space-x-3">
                    <Checkbox
                      id={`job-${index}`}
                      checked={jobActivities.includes(option)}
                      onCheckedChange={() => handleMultiSelect(option, jobActivities, setJobActivities)}
                    />
                    <Label htmlFor={`job-${index}`} className="cursor-pointer">{option}</Label>
                  </div>
                ))}
                {jobActivities.includes(otherLabel) && (
                  <Input
                    placeholder={t.pleaseSpecify}
                    value={jobOther}
                    onChange={(e) => setJobOther(e.target.value)}
                    className="mt-2 ml-6"
                  />
                )}
              </div>
            </div>
          )}

          {/* Step 3 - Field of Work/Interest */}
          {currentStep === 3 && (
            <div className="space-y-6 animate-fade-in">
              <h2 className="text-xl font-semibold text-foreground mb-4">{t.fieldOfWork}</h2>
              <p className="text-sm text-muted-foreground mb-4">{t.selectAllApply}</p>
              <div className="space-y-3">
                {t.fieldOptions.map((option, index) => (
                  <div key={option} className="flex items-center space-x-3">
                    <Checkbox
                      id={`field-${index}`}
                      checked={fieldOfWork.includes(option)}
                      onCheckedChange={() => handleMultiSelect(option, fieldOfWork, setFieldOfWork)}
                    />
                    <Label htmlFor={`field-${index}`} className="cursor-pointer">{option}</Label>
                  </div>
                ))}
                {fieldOfWork.includes(otherLabel) && (
                  <Input
                    placeholder={t.pleaseSpecify}
                    value={fieldOther}
                    onChange={(e) => setFieldOther(e.target.value)}
                    className="mt-2 ml-6"
                  />
                )}
              </div>
            </div>
          )}

          {/* Step 4 - IT Background */}
          {currentStep === 4 && (
            <div className="space-y-6 animate-fade-in">
              <h2 className="text-xl font-semibold text-foreground mb-4">{t.itBackground}</h2>
              <RadioGroup value={itBackground} onValueChange={setItBackground}>
                <div className="space-y-3">
                  {t.itOptions.map((option) => (
                    <div key={option.value} className="flex items-center space-x-3">
                      <RadioGroupItem value={option.value} id={option.value} />
                      <Label htmlFor={option.value} className="cursor-pointer">{option.label}</Label>
                    </div>
                  ))}
                </div>
              </RadioGroup>
            </div>
          )}

          {/* Step 5 - Tools Used */}
          {currentStep === 5 && (
            <div className="space-y-6 animate-fade-in">
              <h2 className="text-xl font-semibold text-foreground mb-4">{t.toolsUsed}</h2>
              <p className="text-sm text-muted-foreground mb-4">{t.toolsUsedDesc}</p>
              <Textarea
                placeholder={t.toolsPlaceholder}
                value={toolsUsed}
                onChange={(e) => setToolsUsed(e.target.value)}
                rows={5}
              />
            </div>
          )}

          {/* Step 6 - AI Usage Frequency */}
          {currentStep === 6 && (
            <div className="space-y-6 animate-fade-in">
              <h2 className="text-xl font-semibold text-foreground mb-4">{t.aiFrequency}</h2>
              <RadioGroup value={aiFrequency} onValueChange={setAiFrequency}>
                <div className="space-y-3">
                  {t.aiFrequencyOptions.map((option) => (
                    <div key={option.value} className="flex items-center space-x-3">
                      <RadioGroupItem value={option.value} id={option.value} />
                      <Label htmlFor={option.value} className="cursor-pointer">{option.label}</Label>
                    </div>
                  ))}
                </div>
              </RadioGroup>
            </div>
          )}

          {/* Step 7 - Goals */}
          {currentStep === 7 && (
            <div className="space-y-6 animate-fade-in">
              <h2 className="text-xl font-semibold text-foreground mb-4">{t.goals}</h2>
              <p className="text-sm text-muted-foreground mb-4">{t.selectAllApply}</p>
              <div className="space-y-3">
                {t.goalOptions.map((option, index) => (
                  <div key={option} className="flex items-center space-x-3">
                    <Checkbox
                      id={`goal-${index}`}
                      checked={goals.includes(option)}
                      onCheckedChange={() => handleMultiSelect(option, goals, setGoals)}
                    />
                    <Label htmlFor={`goal-${index}`} className="cursor-pointer">{option}</Label>
                  </div>
                ))}
                {goals.includes(otherLabel) && (
                  <Input
                    placeholder={t.pleaseSpecify}
                    value={goalOther}
                    onChange={(e) => setGoalOther(e.target.value)}
                    className="mt-2 ml-6"
                  />
                )}
              </div>
            </div>
          )}

          {/* Step 8 - Learning Format */}
          {currentStep === 8 && (
            <div className="space-y-6 animate-fade-in">
              <h2 className="text-xl font-semibold text-foreground mb-4">{t.learningFormat}</h2>
              <RadioGroup value={learningFormat} onValueChange={setLearningFormat}>
                <div className="space-y-3">
                  {t.learningFormatOptions.map((option) => (
                    <div key={option.value} className="flex items-center space-x-3">
                      <RadioGroupItem value={option.value} id={`format-${option.value}`} />
                      <Label htmlFor={`format-${option.value}`} className="cursor-pointer">{option.label}</Label>
                    </div>
                  ))}
                </div>
              </RadioGroup>
            </div>
          )}

          {/* Navigation buttons */}
          <div className="mt-8 flex justify-between">
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={currentStep === 1}
              className="gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              {t.back}
            </Button>
            <Button variant="hero" onClick={handleNext} className="gap-2" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                </>
              ) : currentStep === TOTAL_STEPS ? (
                <>
                  {t.submit} <Check className="h-4 w-4" />
                </>
              ) : (
                <>
                  {t.next} <ArrowRight className="h-4 w-4" />
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Registration;