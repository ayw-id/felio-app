import axios, { type AxiosInstance } from "axios";
import UniversalSocialauth from "universal-social-auth";

declare module "#app" {
  interface NuxtApp {
    $axios: AxiosInstance;
    $Oauth: UniversalSocialauth;
  }
}

declare module "vue" {
  interface ComponentCustomProperties {
    $axios: AxiosInstance;
    $Oauth: UniversalSocialauth;
  }
}

declare module "@vue/runtime-core" {
  interface ComponentCustomProperties {
    $axios: AxiosInstance;
    $Oauth: UniversalSocialauth;
  }
}

export default defineNuxtPlugin({
  name: "Oauth",
  setup() {
    return {
      provide: {
        Oauth: new UniversalSocialauth(axios, {
          providers: {
            // apple: {
            //   nonce: '**************',
            //   state: '**************',
            //   clientId: '**************',
            //   redirectUri: 'https://myapp.com/auth/github/callback'
            // },
            // github: {
            //   clientId: '7db089adf03467bec815',
            //   redirectUri: 'http://localhost:3000/auth/github/callback' // change to your app frontpage url to match your route  path: '/auth/:provider/callback',
            // }
            // twitch: {
            //   clientId: 'qi4vbk30uuvuqigcd5ioq3egxf67m8',
            //   redirectUri: 'https://diadal.com.ng/auth/twitch/callback'
            // }
            google: {
              clientId: useRuntimeConfig().public.googleClientId,
              redirectUri: useRuntimeConfig().public.googleRedirectUrl,
            },
            facebook: {
              clientId: useRuntimeConfig().public.facebookClientId,
              redirectUri: useRuntimeConfig().public.facebookRedirectUrl,
            },
            // twitter: {
            //   url: 'https://myapp.com/auth/twitter',
            //   clientId: '********',
            //   redirectUri: 'https://myapp.com/auth/twitter/callback'
            // }
          },
        }),
      },
    };
  },
});
