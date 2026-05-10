export type Language = "id" | "en";

export const translations = {
  id: {
    // Hero
    limitedSpots: "Kuota Terbatas!!!",
    heroTitle: "Mini Bootcamp AI Tools Untuk Pemula",
    heroSubtitle: "Belajar AI Dari Nol, Tanpa Coding, Tanpa Background IT, dan Langsung Bisa Dipakai",
    enrollNow: "Daftar Sekarang",
    viewCurriculum: "Lihat Kurikulum",
    
    // Features
    whatYouWillLearn: "Yang Akan Kamu Pelajari",
    featuresTitle: "Semua Yang Kamu Butuhkan Untuk Mulai Menggunakan AI",
    featuresSubtitle: "Skill praktis yang bisa langsung diaplikasikan — tidak perlu background teknis.",
    features: [
      {
        title: "Materi Pembelajaran",
        description: "Skill Roadmap lengkap, slide presentasi, dan rekaman video untuk belajar kapan saja.",
      },
      {
        title: "Pendampingan & Komunitas",
        description: "Bimbingan belajar dan akses ke komunitas support untuk saling berbagi dan bertanya.",
      },
      {
        title: "Prompting & AI Tools Dasar",
        description: "Teknik menulis prompt yang efektif dan pengenalan tools AI fundamental.",
      },
      {
        title: "Vibe Coding",
        description: "Belajar membangun aplikasi dengan bantuan AI tanpa perlu background programming.",
      },
      {
        title: "Otomasi (Basic & Advanced)",
        description: "Otomatisasi tugas dari yang sederhana hingga workflow kompleks untuk efisiensi maksimal.",
      },
      {
        title: "Proyek Nyata",
        description: "Praktik langsung dengan proyek real-world yang bisa dipakai untuk portfolio.",
      },
    ],
    
    // Audience
    whoIsThisFor: "Untuk Siapa",
    audienceTitle: "Untuk Pemula yang Tidak Punya Latar Belakang IT",
    audienceSubtitle: "Kamu tidak perlu pengalaman programming. Jika kamu bisa menggunakan email dan browsing web, kamu bisa belajar AI.",
    audiences: [
      {
        title: "Pengusaha & Pemilik Bisnis",
        description: "Hemat waktu dan biaya dengan memanfaatkan AI untuk marketing, konten, dan operasional.",
        benefits: ["Buat konten lebih cepat", "Otomatisasi respons pelanggan", "Generate ide bisnis"],
      },
      {
        title: "Profesional Kreatif",
        description: "Tingkatkan proses kreatifmu dengan brainstorming dan design tools berbasis AI.",
        benefits: ["Percepat ideasi", "Buat mockup visual", "Atasi creative block"],
      },
      {
        title: "Siapa Saja yang Tertarik dengan AI",
        description: "Pahami AI dan pelajari skill praktis apapun backgroundmu.",
        benefits: ["Tanpa coding", "Latihan langsung", "Tempo ramah pemula"],
      },
    ],
    
    // Curriculum
    curriculum: "Kurikulum",
    curriculumTitle: "Program Kelas AI",
    curriculumSubtitle: "Pilih kelas sesuai kebutuhanmu dan mulai perjalanan AI-mu.",
    courses: [
      {
        title: "AI Basic 101",
        date: "30 Jan",
        isComingSoon: false,
        topics: [
          "Memahami apa itu AI dan cara kerjanya",
          "Career dan learning roadmap",
          "Meningkatkan skill prompting",
        ],
      },
      {
        title: "Vibe Coding for Non Coders",
        date: "31 Jan",
        isComingSoon: false,
        topics: [
          "Fundamental web/mobile app",
          "Setup AI toolkit",
          "Hands on: Buat aplikasi web dan mobile pertamamu",
        ],
      },
      {
        title: "AI Automation - Zero To Mastery",
        date: "6 Feb",
        isComingSoon: false,
        topics: [
          "Memahami cara kerja AI automation",
          "Setup akun n8n dan deployment",
          "Hands on: Buat AI workflow pertamamu",
        ],
      },
      {
        title: "Image & Video Creation / Editing / Clipper",
        date: "Segera Hadir",
        isComingSoon: true,
        topics: [],
      },
      {
        title: "Become Professional Marketing With AI Tools",
        date: "Segera Hadir",
        isComingSoon: true,
        topics: [],
      },
      {
        title: "SAAS Founder Class",
        date: "Segera Hadir",
        isComingSoon: true,
        topics: [],
      },
      {
        title: "Freelancer & Agencies Class",
        date: "Segera Hadir",
        isComingSoon: true,
        topics: [],
      },
    ],
    comingSoon: "Segera Hadir",
    
    // Testimonials
    testimonials: "Testimoni",
    testimonialsTitle: "Disukai Pemula di Mana-mana",
    testimonialsSubtitle: "Bergabung dengan ratusan siswa yang mengubah hubungan mereka dengan AI.",
    testimonialsList: [
      {
        name: "Sarah M.",
        role: "Pemilik Usaha Kecil",
        content: "Awalnya saya skeptis tentang AI, tapi bootcamp ini membuat semuanya sangat simpel. Sekarang saya pakai ChatGPT setiap hari untuk email bisnis dan konten marketing. Game changer!",
      },
      {
        name: "David L.",
        role: "Marketing Manager",
        content: "Pendekatan hands-on-nya sempurna. Saya belajar lebih banyak dalam dua hari daripada berbulan-bulan mencoba sendiri. Sangat direkomendasikan!",
      },
      {
        name: "Emily R.",
        role: "Freelance Designer",
        content: "Akhirnya, kursus AI yang tidak mengasumsikan kamu programmer. Instrukturnya menjelaskan semuanya dengan cara yang langsung nyantol. Worth it!",
      },
    ],
    
    // CTA
    limitedTimeOffer: "Penawaran Terbatas",
    ctaTitle: "Mulai Perjalanan AI-mu Hari Ini",
    ctaSubtitle: "Pilih paket yang sesuai dengan kebutuhanmu dan mulai belajar AI sekarang.",
    pricing: [
      {
        id: "ai-basic",
        title: "AI Basic 101",
        originalPrice: "Rp 25.000",
        discountPrice: "Rp 0",
        discountLabel: "GRATIS",
        priceValue: 0,
        isPromo: true,
      },
      {
        id: "vibe-coding",
        title: "Vibe Coding for Non Coders",
        originalPrice: "Rp 215.000",
        discountPrice: "Rp 124.900",
        discountLabel: "Promo",
        priceValue: 124900,
        isPromo: true,
      },
      {
        id: "ai-automation",
        title: "AI Automation - Zero To Mastery",
        originalPrice: "Rp 350.000",
        discountPrice: "Rp 199.900",
        discountLabel: "Promo",
        priceValue: 199900,
        isPromo: true,
      },
    ],
    selectCourse: "Pilih kursus",
    enrollNowTotal: "Daftar Sekarang",
    benefits: [
      "Materi pembelajaran lengkap",
      "Akses rekaman video selamanya",
      "Akses komunitas private",
      "Diskon khusus untuk kelas lanjutan",
    ],
    moneyBackGuarantee: "Garansi kepuasan. Hubungi kami jika ada kendala.",
    
    // Footer
    about: "Tentang",
    faq: "FAQ",
    contact: "Kontak",
    privacy: "Privasi",
    allRightsReserved: "Hak cipta dilindungi.",
  },
  en: {
    // Hero
    limitedSpots: "Limited spots available",
    heroTitle: "AI Tools Mini Bootcamp for Beginners",
    heroSubtitle: "Learn AI from scratch, no coding, no IT background, and immediately applicable",
    enrollNow: "Enroll Now",
    viewCurriculum: "View Curriculum",
    
    // Features
    whatYouWillLearn: "What You Will Learn",
    featuresTitle: "Everything You Need to Start Using AI Today",
    featuresSubtitle: "Practical skills you can apply immediately — no technical background needed.",
    features: [
      {
        title: "Learning Materials",
        description: "Complete Skill Roadmap, presentation slides, and video recordings to learn anytime.",
      },
      {
        title: "Learning Assistance & Community",
        description: "Guided learning support and access to a community for sharing and asking questions.",
      },
      {
        title: "Prompting & Basic AI Tools",
        description: "Effective prompt writing techniques and introduction to fundamental AI tools.",
      },
      {
        title: "Vibe Coding",
        description: "Learn to build applications with AI assistance without any programming background.",
      },
      {
        title: "Automation (Basic & Advanced)",
        description: "Automate tasks from simple to complex workflows for maximum efficiency.",
      },
      {
        title: "Real Projects",
        description: "Hands-on practice with real-world projects you can add to your portfolio.",
      },
    ],
    
    // Audience
    whoIsThisFor: "Who Is This For",
    audienceTitle: "Perfect for Non-Technical Learners",
    audienceSubtitle: "You do not need any programming experience. If you can use email and browse the web, you can learn AI.",
    audiences: [
      {
        title: "Entrepreneurs & Business Owners",
        description: "Save time and money by leveraging AI for marketing, content, and operations.",
        benefits: ["Create content faster", "Automate customer responses", "Generate business ideas"],
      },
      {
        title: "Creative Professionals",
        description: "Enhance your creative process with AI-powered brainstorming and design tools.",
        benefits: ["Speed up ideation", "Create visual mockups", "Overcome creative blocks"],
      },
      {
        title: "Anyone Curious About AI",
        description: "Demystify AI and learn practical skills regardless of your background.",
        benefits: ["No coding required", "Hands-on exercises", "Beginner-friendly pace"],
      },
    ],
    
    // Curriculum
    curriculum: "Curriculum",
    curriculumTitle: "AI Class Programs",
    curriculumSubtitle: "Choose the class that fits your needs and start your AI journey.",
    courses: [
      {
        title: "AI Basic 101",
        date: "30 Jan",
        isComingSoon: false,
        topics: [
          "Understanding what is AI and how it works",
          "Career and learning roadmap",
          "Level up prompting skill",
        ],
      },
      {
        title: "Vibe Coding for Non Coders",
        date: "31 Jan",
        isComingSoon: false,
        topics: [
          "Web/mobile app fundamentals",
          "Setting up AI toolkit",
          "Hands on: Create your first web and mobile application",
        ],
      },
      {
        title: "AI Automation - Zero To Mastery",
        date: "6 Feb",
        isComingSoon: false,
        topics: [
          "Understanding how AI automation works",
          "Setting up n8n account and deployment",
          "Hands on: Create your first AI workflow",
        ],
      },
      {
        title: "Image & Video Creation / Editing / Clipper",
        date: "Coming Soon",
        isComingSoon: true,
        topics: [],
      },
      {
        title: "Become Professional Marketing With AI Tools",
        date: "Coming Soon",
        isComingSoon: true,
        topics: [],
      },
      {
        title: "SAAS Founder Class",
        date: "Coming Soon",
        isComingSoon: true,
        topics: [],
      },
      {
        title: "Freelancer & Agencies Class",
        date: "Coming Soon",
        isComingSoon: true,
        topics: [],
      },
    ],
    comingSoon: "Coming Soon",
    
    // Testimonials
    testimonials: "Testimonials",
    testimonialsTitle: "Loved by Beginners Everywhere",
    testimonialsSubtitle: "Join hundreds of students who transformed their relationship with AI.",
    testimonialsList: [
      {
        name: "Sarah M.",
        role: "Small Business Owner",
        content: "I was skeptical about AI, but this bootcamp made everything so simple. Now I use ChatGPT daily for my business emails and marketing content. Game changer!",
      },
      {
        name: "David L.",
        role: "Marketing Manager",
        content: "The hands-on approach was perfect. I learned more in two days than I did in months of trying to figure it out on my own. Highly recommend!",
      },
      {
        name: "Emily R.",
        role: "Freelance Designer",
        content: "Finally, an AI course that does not assume you are a programmer. The instructor explains everything in a way that just clicks. Worth every penny.",
      },
    ],
    
    // CTA
    limitedTimeOffer: "Limited Time Offer",
    ctaTitle: "Start Your AI Journey Today",
    ctaSubtitle: "Choose the package that fits your needs and start learning AI today.",
    pricing: [
      {
        id: "ai-basic",
        title: "AI Basic 101",
        originalPrice: "Rp 25,000",
        discountPrice: "Rp 0",
        discountLabel: "FREE",
        priceValue: 0,
        isPromo: true,
      },
      {
        id: "vibe-coding",
        title: "Vibe Coding for Non Coders",
        originalPrice: "Rp 215,000",
        discountPrice: "Rp 124,900",
        discountLabel: "Promo",
        priceValue: 124900,
        isPromo: true,
      },
      {
        id: "ai-automation",
        title: "AI Automation - Zero To Mastery",
        originalPrice: "Rp 350,000",
        discountPrice: "Rp 199,900",
        discountLabel: "Promo",
        priceValue: 199900,
        isPromo: true,
      },
    ],
    selectCourse: "Select course",
    enrollNowTotal: "Enroll Now",
    benefits: [
      "Complete learning materials",
      "Lifetime video recording access",
      "Private community access",
      "Special discount to advance classes",
    ],
    moneyBackGuarantee: "Satisfaction guaranteed. Contact us if you have any issues.",
    
    // Footer
    about: "About",
    faq: "FAQ",
    contact: "Contact",
    privacy: "Privacy",
    allRightsReserved: "All rights reserved.",
  },
};
