export const helmetSettings = {
  contentSecurityPolicy: {
    useDefaults: false,
    directives: {
      defaultSrc: [
        "'self'",
        "'unsafe-inline'",
        "'unsafe-eval'",
        "blob:",
        "data:",
        "bumpp.io",
        "dev.bumpp.io",
        "img.bumpp.io",
        "dev-img.bumpp.io",
        "beta.bumpp.io",
        "staging.bumpp.io",
        "images.bumpp.io",
        "www.google.com",
        "www.gstatic.com",
        "www.googletagmanager.com",
        "www.google-analytics.com",
        "identitytoolkit.googleapis.com",
        "fonts.googleapis.com",
        "fonts.gstatic.com",
        "res.cloudinary.com",
        "cdn.jsdelivr.net",
        "localhost:3000",
        "static.cloudflareinsights.com",
        "registeredapps.hosting.portal.azure.net",
        "cdn.redoc.ly",
      ],
      frameAncestors: ["'none'"],
    },
    blockAllMixedContent: false,
    upgradeInsecureRequests: true,
    reportOnly: false,
    addMeta: true,
  },
  crossOriginEmbedderPolicy: false,
  crossOriginOpenerPolicy: {
    policy: "same-origin-allow-popups",
  },
  crossOriginResourcePolicy: {
    policy: "same-origin",
  },
  expectCt: {
    maxAge: 0,
    enforce: false,
  },
  referrerPolicy: {
    policy: "strict-origin",
  },
  hsts: {
    maxAge: 86400,
    includeSubDomains: true,
    preload: false,
  },
  dnsPrefetchControl: {
    allow: false,
  },
  frameguard: {
    action: "sameorigin",
  },
  permittedCrossDomainPolicies: {
    permittedPolicies: "master-only",
  },
  hidePoweredBy: true,
  xssFilter: true,
  accessControlMaxAge: "2592000",
};

export const rateLimitSettings = {
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 200000, // Limit each IP to 600 requests per 10 minutes
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
};
