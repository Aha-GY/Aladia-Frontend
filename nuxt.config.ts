// https://v3.nuxtjs.org/api/configuration/nuxt.config
import i18nConfig from './i18n.config';

const IS_DEV = process.env.NODE_ENV === 'development';

interface ChatScriptAttributes {
  src: string;
  chat: string;
  widgetId: string;
  async?: boolean;
  defer?: boolean;
  [key: string]: string | boolean | undefined;
}

export default defineNuxtConfig({
  compatibilityDate: '2024-07-03',
  runtimeConfig: {
    public: {
      BRANCH_NAME: '',
    },
  },
  app: {
    head: {
      charset: 'utf-16',
      viewport:
        'width=device-width,minimum-scale=1.0,maximum-scale=1.0,user-scalable=no',
      title: 'Aladia - E-learing Revolution',
      meta: [
        {
          name: 'description',
          content:
            'We have worked to digitize our school, ang give the whole world the opportunity to do it with a new study platform designed for teachers',
        },
      ],
      link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
      script: [
        {
          src: '//eu.fw-cdn.com/12937448/895642.js',
          chat: 'true',
          widgetId: 'ee292c52-6bac-4909-8923-eba67551e937',
          async: true,
          defer: true,
        } as ChatScriptAttributes,
        {
          src: 'https://accounts.google.com/gsi/client?v=1',
          async: true,
          defer: true,
        },
        {
          src: 'https://appleid.cdn-apple.com/appleauth/static/jsapi/appleid/1/en_US/appleid.auth.js',
          async: true,
          defer: true,
        },
        {
          src: 'https://www.youtube.com/iframe_api',
          async: true,
          defer: true,
        },
      ],
    },
  },
  modules: [
    '@vueuse/nuxt',
    '@nuxtjs/color-mode',
    '@nuxtjs/device',
    '@nuxtjs/tailwindcss',
    '@element-plus/nuxt',
    '@pinia/nuxt',
    'pinia-plugin-persistedstate/nuxt',
    '@nuxt/eslint',
    '@nuxtjs/i18n',
    '@nuxtjs/storybook',
  ],
  plugins: ['./plugins/element-plus'],
  css: [
    'swiper/css',
    'animate.css',
    'highlight.js/styles/github-dark.css',
    '@vueup/vue-quill/dist/vue-quill.snow.css',
    '@vueup/vue-quill/dist/vue-quill.bubble.css',
    'element-plus/theme-chalk/dark/css-vars.css',
    'highlightjs-copy/dist/highlightjs-copy.min.css',
    '~/assets/fontawesome/css/index.scss',
    '~/assets/style/index.scss',
  ],
  colorMode: {
    preference: 'dark',
    fallback: 'dark',
    classSuffix: '',
  },
  imports: {
    dirs: ['stores'],
  },
  i18n: i18nConfig,
  build: {
    transpile: IS_DEV
      ? [
          /echarts/,
          'vue-echarts',
          '@popperjs/core',
          'resize-detector',
          'vue-toastification',
          '@pqina/pintura',
          '@pqina/vue-pintura',
          'msw',
        ]
      : [
          /echarts/,
          'vue-echarts',
          '@popperjs/core',
          'resize-detector',
          'vue-toastification',
          'eventemitter2',
          '@pqina/pintura',
          '@pqina/vue-pintura',
          /visactor/,
          /googlemaps/,
        ],
  },
  nitro: {
    sourceMap: false,
  },
  tailwindcss: {
    exposeConfig: true,
  },
  hooks: {
    'pages:extend'(pages) {
      const org = pages.find(
        (page) => page.name === 'organization-hub-name',
      ) as {
        name: string;
        path: string;
        children: {
          name: string;
          path: string;
        }[];
      };

      pages.push({
        ...org,
        name: org.name.replace('organization', 'user'),
        path: org.path.replace('organization', 'user'),
        children: org.children.map((item) => ({
          ...item,
          name: item.name.replace('organization', 'user'),
          path: item.path.replace('organization', 'user'),
        })),
      });
    },
  },
  vite: {
    esbuild: {
      drop: ['debugger'],
      pure: IS_DEV ? [] : ['console.log'],
    },
    build: {
      sourcemap: false,
    },
    css: {
      preprocessorOptions: {
        scss: {
          silenceDeprecations: ['legacy-js-api'],
        },
      },
    },
    optimizeDeps: {
      include: ['msw'],
    },
  },
  sourcemap: false,
  alias: {
    dayjs: 'dayjs',
    quill: 'quill',
  },
});
