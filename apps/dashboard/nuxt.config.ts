// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  routeRules: {
    // Auth and home page pre-rendered at build time
    // "/**": { isr: true },
    "/**": { ssr: false },
    // "/auth/**": { ssr: false },
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

  plugins: [
    { src: "~/plugins/socialAuthPlugin.ts", mode: "client" },
    // { src: '~/plugins/customPlugins.ts', mode: 'client' }
  ],

  app: {
    head: {
      // script: [
      //   {
      //     // strategy: "lazyOnload",
      //     src: "https://www.googletagmanager.com/gtag/js?id=UA-93461466-1",
      //   },
      //   {
      //     id: "ga-analytics",
      //     // strategy: "lazyOnload",
      //     children: `
      //               window.dataLayer = window.dataLayer || [];
      //               function gtag(){dataLayer.push(arguments);}
      //               gtag('js', new Date());
      //               gtag('config', 'UA-93461466-1');
      //           `,
      //   },
      // ],
      title: "Felio - App",
      link: [
        {
          id: "theme-css",
          rel: "stylesheet",
          type: "text/css",
          href: "/app/themes/aura-light-green/theme.css",
        },
        {
          rel: "icon",
          type: "image/x-icon",
          href: "/app/layout/images/favicon.png",
        },
      ],
    },
    baseURL: "/app",
  },

  modules: [
    "nuxt-primevue",
    "@pinia/nuxt",
    "nuxt-anchorscroll",
    "nuxt-auth-utils",
  ],

  anchorscroll: {
    hooks: [
      // Or any valid hook if needed
      // Default is `page:finish`
      "page:transition:finish",
    ],
  },

  primevue: {
    options: { ripple: true },
    components: {
      exclude: ["Editor"],
    },
  },

  css: [
    "primeicons/primeicons.css",
    "primeflex/primeflex.scss",
    "primevue/resources/primevue.min.css",
    "@/assets/styles.scss",
  ],

  runtimeConfig: {
    public: {
      baseUrl: process.env.BASE_URL,
      urlAssets: process.env.URL_ASSETS,
      webBuilderUrl: process.env.BUILDER_URL,
      invoiceUrl: process.env.INVOICE_URL,
      api: process.env.API,
      sellerApi: process.env.SELLER_API,
      builderApi: process.env.BUILDER_API,
      marketingApi: process.env.MARKETING_API,
      agentMerchantApi: process.env.AGENT_MERCHANT_API,
      agentMemberApi: process.env.AGENT_MEMBER_API,
      chatApi: process.env.CHAT_API,
      landingPageUrl: process.env.LANDING_PAGE_URL,
      facebookRedirectUrl:
        process.env.NODE_ENV === "production"
          ? process.env.FACEBOOK_REDIRECT_URL
          : process.env.FACEBOOK_REDIRECT_URL_DEV,
      facebookClientId: process.env.FACEBOOK_CLIENT_ID,
      facebookClientSecret: process.env.FACEBOOK_CLIENT_SECRET,
      googleRedirectUrl:
        process.env.NODE_ENV === "production"
          ? process.env.GOOGLE_REDIRECT_URL
          : process.env.GOOGLE_REDIRECT_URL_DEV,
      googleClientId: process.env.GOOGLE_CLIENT_ID,
      googleClientSecret: process.env.GOOGLE_CLIENT_SECRET,
      rootUrl: process.env.ROOT_URL,
    },
  },

  build: {
    transpile: ["maz-ui"],
  },

  // compatibilityDate: "2024-07-22",
});
