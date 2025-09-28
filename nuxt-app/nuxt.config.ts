// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ['@nuxt/eslint', '@nuxt/ui', '@nuxt/image'],

  devtools: {
    enabled: true
  },

  css: ['~/assets/css/main.css'],

  routeRules: {
    '/': { ssr: true }
  },

  image: {
    providers: {
      notion: {
        name: 'notion',
        provider: '~/providers/notion.ts',
        options: {
          baseURL: 'https://www.notion.so',
        }
      }
    },
    domains: ['www.notion.so', 'notion.so']
  },

  runtimeConfig: {
    public: {
      NOTION_SECRET_KEY: process.env.NOTION_SECRET_KEY,
      NOTION_IMAGE_DB: process.env.NOTION_IMAGE_DB,
    }
  },

  compatibilityDate: '2025-01-15',

  eslint: {
    config: {
      stylistic: {
        commaDangle: 'never',
        braceStyle: '1tbs'
      }
    }
  }
})
