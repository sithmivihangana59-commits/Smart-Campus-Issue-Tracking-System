// Configuration for your app
// https://v2.quasar.dev/quasar-cli-vite/quasar-config-file

import { defineConfig } from '#q-app'

export default defineConfig((/* ctx */) => {
  return {

    // =====================================================
    // APPLICATION INFORMATION
    // =====================================================

    productName: 'Smart Campus | Issue Management',

    productDescription:
      'Smart Campus Issue Management System',


    // =====================================================
    // BOOT FILES
    // =====================================================

    // https://v2.quasar.dev/quasar-cli-vite/prefetch-feature
    // preFetch: true,

    boot: ['axios'],


    // =====================================================
    // CSS
    // =====================================================

    // https://v2.quasar.dev/quasar-cli-vite/quasar-config-file#css

    css: [
      'app.scss'
    ],


    // =====================================================
    // EXTRAS
    // =====================================================

    // https://github.com/quasarframework/quasar/tree/dev/extras

    extras: [

      // 'ionicons-v4',
      // 'mdi-v7',
      // 'fontawesome-v7',
      // 'eva-icons',
      // 'themify',
      // 'line-awesome',

      'roboto-font',
      'material-icons'
    ],


    // =====================================================
    // BUILD
    // =====================================================

    // https://v2.quasar.dev/quasar-cli-vite/quasar-config-file#build

    build: {

      target: {
        // browser: 'baseline-widely-available',
        // node: 'node22'
      },

      // https://v2.quasar.dev/quasar-cli-vite/page-routing-with-vue-router#filename-based-routing

      // filenameBasedRouting: true,

      vueRouterMode: 'history'

      // vueRouterBase,

      // publicPath: '/',
      // define: {},
      // defineEnv: {}
      // ignorePublicFolder: true,
      // minify: false,
      // distDir

      // extendViteConf (viteConf) {},
      // viteVuePluginOptions: {},

      // vitePlugins: [
      //   [
      //     'package-name',
      //     { ..pluginOptions.. },
      //     { server: true, client: true }
      //   ]
      // ]

    },


    // =====================================================
    // DEVELOPMENT SERVER
    // =====================================================

    // https://v2.quasar.dev/quasar-cli-vite/quasar-config-file#devserver

    devServer: {

      // vueDevtools: true,

      // https: true,

      open: true,

      proxy: {
        '/api': {
          target: 'http://localhost:5000',
          changeOrigin: true
        }
      }

    },


    // =====================================================
    // QUASAR FRAMEWORK
    // =====================================================

    // https://v2.quasar.dev/quasar-cli-vite/quasar-config-file#framework

    framework: {

      config: {},

      // iconSet: 'material-icons',
      // lang: 'en-US',

      // components: [],
      // directives: [],

      plugins: []

    },


    // =====================================================
    // ANIMATIONS
    // =====================================================

    animations: [],


    // =====================================================
    // SOURCE FILES
    // =====================================================

    // sourceFiles: {
    //   rootComponent: 'src/App.vue',
    //   router: 'src/router/index',
    //   store: 'src/store/index',
    //   pwaRegisterServiceWorker: 'src-pwa/register-sw',
    //   pwaServiceWorker: 'src-pwa/sw/custom-sw',
    //   pwaManifestFile: 'src-pwa/manifest.json',
    //   electronMain: 'src-electron/electron-main',
    //   electronPreload: 'src-electron/electron-preload'
    // },


    // =====================================================
    // SSR
    // =====================================================

    // https://v2.quasar.dev/quasar-cli-vite/developing-ssr/configuring-ssr

    ssr: {

      prodPort: 3000,

      middlewares: [
        'render'
      ]

    },


    // =====================================================
    // SSG
    // =====================================================

    // https://v2.quasar.dev/quasar-cli-vite/developing-ssg/configuring-ssg

    ssg: {

      // onSsgRendererError: 'abort',
      // ssgRendererConcurrency: 1,
      // ssgRendererRetryCount: 0,
      // ssgRendererRetryDelay: 1000,
      // ssgRendererDirectoryIndexes: true,
      // error404HtmlFilename: '404.html',
      // clientSideRenderingHtmlFilename: 'csr.html',
      // clientSideRenderingRoutes: [],
      // noPreloadTagRoutes: []
      // extendSSGRendererConf (rolldownConf) {},
      // extendSSGManifestJson (json) {},
      // manualStoreSerialization: true,
      // manualStoreSsrContextInjection: true,
      // manualStoreHydration: true,
      // manualPostHydrationTrigger: true,
      // prodScriptNamedExport: false,

    },


    // =====================================================
    // PWA
    // =====================================================

    // https://v2.quasar.dev/quasar-cli-vite/developing-pwa/configuring-pwa

    pwa: {

      workboxMode: 'GenerateSW'

      // swFilename: 'sw.js',
      // manifestFilename: 'manifest.json',
      // extendPWAManifestJson (json) {},
      // useCredentialsForManifestTag: true,
      // injectPWAMetaTags: false,
      // extendPWACustomSWConf (rolldownConf) {},
      // extendPWAGenerateSWOptions (cfg) {},
      // extendPWAInjectManifestOptions (cfg) {},
      // extendPWASwTsConfig (tsConfig) {}

    },


    // =====================================================
    // CORDOVA
    // =====================================================

    // https://v2.quasar.dev/quasar-cli-vite/developing-cordova-apps/configuring-cordova

    cordova: {},


    // =====================================================
    // CAPACITOR
    // =====================================================

    // https://v2.quasar.dev/quasar-cli-vite/developing-capacitor-apps/configuring-capacitor

    capacitor: {

      hideSplashscreen: true

    },


    // =====================================================
    // ELECTRON
    // =====================================================

    // https://v2.quasar.dev/quasar-cli-vite/developing-electron-apps/configuring-electron

    electron: {

      // Electron preload scripts
      preloadScripts: [
        'electron-preload'
      ],

      // Debugging port
      inspectPort: 5858,

      bundler: 'packager',

      packager: {

        // macOS / App Store
        // appBundleId: '',
        // appCategoryType: '',
        // osxSign: '',
        // protocol: '',

        // Windows
        // win32metadata: { ... }

      },

      builder: {

        appId: 'smart-campus-issue-tracking-system'

      }

    },


    // =====================================================
    // BROWSER EXTENSION
    // =====================================================

    // https://v2.quasar.dev/quasar-cli-vite/developing-browser-extensions/configuring-bex

    bex: {

      // extendBexScriptsConf (rolldownConf) {},
      // extendBexManifestJson (json) {},

      /**
       * Extra scripts inside /src-bex/
       */

      extraScripts: []

    }

  }
})