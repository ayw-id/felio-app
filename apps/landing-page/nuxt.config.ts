// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  app: {
    head: {
      title: "Platform Inovatif Tingkatkan Profit Bisinis Kamu",
      htmlAttrs: {
        lang: "id",
      },
      meta: [
        { charset: "utf-8" },
        { name: "viewport", content: "width=device-width, initial-scale=1" },
        {
          name: "description",
          content:
            "Kelola bisnis lebih efisien, jangkau lebih banyak pembeli, tingkatkan performa agen dan reseller, semua dalam satu platform",
        },
        { name: "format-detection", content: "telephone=no" },
        { property: "og-type", content: "website" },
        { property: "og:url", content: "https://felio.id" },
        { property: "og:site_name", content: "Felio" },
        { property: "og:locale", content: "id_ID" },
        {
          property: "og:title",
          content: "Platform Inovatif Tingkatkan Profit Bisinis Kamu",
        },
        {
          property: "og:description",
          content:
            "Kelola bisnis lebih efisien, jangkau lebih banyak pembeli, tingkatkan performa agen dan reseller, semua dalam satu platform",
        },
        { property: "og:image", content: "https://felio.id/favicon.png" },
        { property: "og:image:height", content: "600" },
        { property: "og:image:width", content: "600" },
        { property: "twitter:card", content: "summary_large_image" },
        { property: "twitter:url", content: "https://felio.id" },
        {
          property: "twitter:title",
          content: "Platform Inovatif Tingkatkan Profit Bisinis Kamu",
        },
        {
          property: "twitter:description",
          content:
            "Kelola bisnis lebih efisien, jangkau lebih banyak pembeli, tingkatkan performa agen dan reseller, semua dalam satu platform",
        },
        { property: "twitter:image", content: "https://felio.id/favicon.png" },
      ],
      link: [
        {
          rel: "icon",
          type: "image/png",
          href: "https://felio.id/favicon.png",
        },
        {
          rel: "stylesheet",
          href: "https://fonts.googleapis.com/css2?family=Poppins:wght@100;200;300;400;500;600;700;800;900&display=swap",
        },
      ],
    },
  },
  routeRules: {
    // Auth and home page pre-rendered at build time
    "/**": { isr: true },
    // '/': { prerender: true },
    // // Products page generated on demand, revalidates in background, cached until API response changes
    // '/products': { swr: true },
    // // Product page generated on demand, revalidates in background, cached for 1 hour (3600 seconds)
    // '/products/**': { swr: 3600 },
    // // Blog posts page generated on demand, revalidates in background, cached on CDN for 1 hour (3600 seconds)
    // '/blog': { isr: 3600 },
    // // Blog post page generated on demand once until next deployment, cached on CDN
    // '/blog/**': { isr: true },
    // // Admin dashboard renders only on client-side
    // '/admin/**': { ssr: false },
    // // Add cors headers on API routes
    // '/api/**': { cors: true },
    // // Redirects legacy urls
    // '/old-page': { redirect: '/new-page' }
  },
  css: ["~/assets/css/main.css", "aos/dist/aos.css"],
  // ssr: false, // set to false to support offline, set to true to improve SEO and performance
  devtools: { enabled: true },
  typescript: {
    shim: false,
  },
  // plugins: ["~/plugins/vuex-orm.js"],
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
  modules: [
    "@nuxtjs/eslint-module",
    "nuxt-aos",
    "@nuxtjs/i18n",
    [
      "nuxt-mdi",
      {
        cache: false,
        componentName: "MdiIcon",
        defaultSize: "1em",
      },
    ],
    [
      "nuxt-anchorscroll",
      {
        hooks: [
          // Or any valid hook if needed
          // Default is `page:finish`
          "page:transition:finish",
        ],
      },
    ],
    // [
    //   "@storybook-vue/nuxt-storybook",
    //   {
    //     url: "http://localhost:6006",
    //     storybookRoute: "/__storybook__",
    //     port: 6006,
    //   },
    // ],
  ],
  i18n: {
    locales: [
      {
        code: "en",
        file: "en.json",
      },
      {
        code: "id",
        file: "id.json",
      },
    ],
    lazy: true,
    langDir: "lang",
    defaultLocale: "id",
  },
  runtimeConfig: {
    public: {
      baseUrl: process.env.BASE_URL,
      marketingAPI: process.env.MARKETING_API,
    },
  },
});
