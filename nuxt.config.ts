// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  app: {
    head: {
      title: "Sheger Gebeta",
      htmlAttrs: {
        lang: "en",
      },
      link: [
        {
          href: "https://fonts.googleapis.com",
          rel: "preconnect",
        },
        {
          href: "https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap",
          rel: "stylesheet",
        },
      ],
    },
    // global transition
    // pageTransition: { name: "page", mode: "out-in" },
    // layoutTransition: { name: "layout", mode: "out-in" },
  },
  ssr: false,
  spaLoadingTemplate: false,
  devtools: { enabled: true },
  modules: [
    "@nuxtjs/tailwindcss",
    "@nuxtjs/color-mode",
    "@vee-validate/nuxt",
    "@vueuse/nuxt",
    "nuxt-icon",
    "nuxt-headlessui",
    "@nuxt/content",
    "@pinia/nuxt",
    "nuxt-rating",
    "nuxt-lodash",
    "@pinia-plugin-persistedstate/nuxt",
    "nuxt3-leaflet",
    "@nuxt/image",
    "@nuxtjs/apollo",
    "@nuxtjs/device",
  ],

  routeRules: {
    "/login": { ssr: false },
  },
  apollo: {
    autoImports: true,
    authType: "Bearer",
    authHeader: "Authorization",
    tokenStorage: "cookie",
    proxyCookies: true,

    clients: {
      shegerAnonymous: "./apollo/sheger-gebeta/anonymous.js",
      authClient: "./apollo/sheger-gebeta/auth.js",
      Authorizer: "./apollo/authorizer.js",
    },
  },
  veeValidate: {
    // disable or enable auto imports
    autoImports: true,
    // Use different names for components
    componentNames: {
      Form: "VeeForm",
      Field: "VeeField",
      FieldArray: "VeeFieldArray",
      ErrorMessage: "VeeErrorMessage",
    },
  },
  headlessui: {
    prefix: "Headless",
  },
  content: {
    documentDriven: true,
    markdown: {
      mdc: true,
    },
  },
  build: {
    transpile: ["@vuepic/vue-datepicker"],
  },
  colorMode: {
    preference: "light", // default value of $colorMode.preference
    fallback: "light", // fallback value if not system preference found
    hid: "nuxt-color-mode-script",
    globalName: "__NUXT_COLOR_MODE__",
    componentName: "ColorScheme",
    classPrefix: "",
    classSuffix: "",
    storageKey: "nuxt-color-mode",
  },
  device: {
    refreshOnResize: true,
  },
  runtimeConfig: {
    public: {
      REDIRECT_URI: process.env.REDIRECT_URI,
    },
  },
});
