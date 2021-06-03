const withPWA = require('next-pwa')
const webpack = require("webpack");
const path = require("path");




// A JavaScript class.
class MyExampleWebpackPlugin {
  constructor() {
    console.log("HEEYYYY")
  }
  // Define `apply` as its prototype method which is supplied with compiler as its argument
  apply(compiler) {

    console.log('=>>>>>>>>>>>>>>>>>>>>APPLLY');

    // compiler.hooks.entryOption.tap('MyExampleWebpackPlugin', (context, entry) => {
    //   // Works
    //   console.log('==============Synchronously tapping the entryOption hook.');
    // });

    compiler.hooks.compile.tap('MyExampleWebpackPlugin', (params) => {
      console.log('==============Synchronously tapping the compile hook.');
      console.log(Object.keys(params.normalModuleFactory.hooks));
      params.normalModuleFactory.hooks.beforeResolve.tapPromise("MyExampleWebpackPlugin", async (resolveData) => {
        // console.log('======>>>>>Asynchronously tapping the normalModuleFactory beforeResolve hook.')
        // console.log(resolveData)
        if (resolveData.request == "apollo-server-core") {
          console.log("NOOOOOOOO")
          console.log(resolveData)
          return false;
        }
        return;
      })
      // console.log(Object.keys(params));

    });

    // compiler.hooks.thisCompilation.tap('MyExampleWebpackPlugin', (params) => {
    //   // Works
    //   console.log('==============Synchronously tapping the thisCompilation hook.');
    //   // console.log(Object.keys(params));

    // });

    // compiler.hooks.compilation.tap('MyExampleWebpackPlugin', (params) => {
    //   // Works
    //   console.log('==============Synchronously tapping the compilation hook.');
    //   // console.log(Object.keys(params));

    // });


    // compiler.hooks.afterPlugins.tap('MyExampleWebpackPlugin', (params) => {
    //   console.log('==============Synchronously tapping the afterPlugins hook.');
    //   console.log(Object.keys(params));

    // });





    // compiler.hooks.afterEnvironment.tap('MyExampleWebpackPlugin', (params) => {
    //   console.log('==============Synchronously tapping the afterEnvironment hook.');
    //   console.log(Object.keys(params));

    // });

    // compiler.hooks.watchRun.tap(
    //   'MyExampleWebpackPlugin',
    //   (source, target, routesList) => {
    //     // await new Promise((resolve) => setTimeout(resolve, 1000));
    //     console.log('=============Synchronously tapping the watchRun hook with a delay.');
    //   }
    // );

    // compiler.hooks.run.tapPromise(
    //   'MyExampleWebpackPlugin',
    //   async (source, target, routesList) => {
    //     // await new Promise((resolve) => setTimeout(resolve, 1000));
    //     console.log('=============Asynchronously tapping the run hook with a delay.');
    //   }
    // );

    // compiler.hooks.watchRun.tapPromise(
    //   'MyExampleWebpackPlugin',
    //   async (source, target, routesList) => {
    //     // await new Promise((resolve) => setTimeout(resolve, 1000));
    //     console.log('=============Asynchronously tapping the watchRun hook with a delay.');
    //   }
    // );


    // compiler.hooks.run.tap('MyExampleWebpackPlugin', compilation => {
    //   // throw new Error("STOOPPP");
    //   console.log('========================The webpack build process is starting!!!');
    // });

    // compiler.hooks.done.tap('MyExampleWebpackPlugin', (
    //   stats /* stats is passed as argument when done hook is tapped.  */
    // ) => {
    //   console.log('Hello World====================!');
    // });
    // // Specify the event hook to attach to
    // compiler.hooks.emit.tapAsync(
    //   'MyExampleWebpackPlugin',
    //   (compilation, callback) => {
    //     console.log('This is an example plugin====================================!');
    //     console.log('Here’s the `compilation` object which represents a single build of assets:', compilation);

    //     // Manipulate the build using the plugin API provided by webpack
    //     compilation.addModule(/* ... */);

    //     callback();
    //   }
    // );
  }
}

module.exports = withPWA({
  // module.exports = {
  images: {
    deviceSizes: [
      320, 480, 640, 750, 828, 960, 1080, 1200, 1440, 1920, 2048, 2560, 3840,
    ],
  },
  future: {
    webpack5: true,
  },
  webpack: (config, { defaultLoaders, isServer, config: nextConfig, ...others }) => {
    // Note: we provide webpack above so you should not `require` it
    // Perform customizations to webpack config

    const isWebpack5 = nextConfig.future.webpack5;

    // Add graphql import
    // See https://www.npmjs.com/package/graphql-tag#webpack-loading-and-preprocessing
    config.module.rules = [
      ...config.module.rules,
      {
        test: /\.(graphql|gql)$/,
        use: "graphql-tag/loader",
        exclude: /node_modules/
      }
    ];

    // Transpile other packages of the monorepo
    // E.g.: `@labelflow/react-openlayers-fiber`
    // See https://github.com/vercel/next.js/blob/0af3b526408bae26d6b3f8cab75c4229998bf7cb/test/integration/typescript-workspaces-paths/packages/www/next.config.js
    // The root folder of the monorepo:
    const resolvedBaseUrl = path.resolve(config.context, '../../')
    // We add a rule to transpile files in this folder, except files in `node_modules`
    config.module.rules = [
      ...config.module.rules,
      {
        test: /\.(tsx|ts|js|mjs|jsx)$/,
        use: defaultLoaders.babel,
        include: [resolvedBaseUrl],
        exclude: (excludePath) => {
          // To allow to resolve files inside `node_modules`, we could add a condition like this:
          //     return /node_modules/.test(excludePath) && ! /\/ol/.test(excludePath)
          // This is not needed for now though:
          return /node_modules/.test(excludePath)
        },
      },
    ];

    // Transpile node-modules packages that provides no nodejs compatible files
    // E.g.: `ol`
    // See https://github.com/vercel/next.js/issues/9890
    // See https://github.com/openlayers/openlayers/issues/10470
    // See https://github.com/vercel/next.js/blob/bd589349d2a90c41e7fc9549ea2438febfc9a510/packages/next/build/webpack-config.ts#L637
    // To do this we modify the `externals` option of webpack:
    config.externals = config.externals.map(external => {
      if (!(typeof external === 'function')) {
        // `externals` options that are hardcoded strings and arrays are used directly
        return external
      } else {
        // `externals` options that are functions are overridden, to force externalize of the packages we want

        if (isWebpack5) {
          // Return a webpack5-like `externals` option function
          return ({ context, request, contextInfo, getResolve }, callback) => {
            if (/^ol/.test(request)) {
              // Make an exception for `ol`, never externalize this import, it must be transpiled and bundled
              return callback?.();
            } else {
              // Use the standard NextJS `externals` function
              return external({ context, request, contextInfo, getResolve }, callback);
            }
          }
        } else {
          // Return a webpack4-like `externals` option function
          return (context, request, callback) => {
            if (/^ol/.test(request)) {
              // Make an exception for `ol`, never externalize this import, it must be transpiled and bundled
              return callback?.();
            } else {
              // Use the standard NextJS `externals` function
              return external(context, request, callback);
            }
          }
        }
      }
    })


    // Allow to transpile node modules that depends on node built-ins into browser.
    // E.g.: `apollo-server-core`
    // See https://github.com/webpack-contrib/css-loader/issues/447
    // See https://github.com/vercel/next.js/issues/7755
    if (!isServer) {
      if (isWebpack5) {
        // See https://github.com/webpack-contrib/css-loader/issues/447#issuecomment-761853289
        // See https://github.com/vercel/next.js/issues/7755#issuecomment-812805708
        config.resolve = {
          ...config.resolve ?? {},
          fallback: {
            ...config.resolve?.fallback ?? {},
            module: false,
            dgram: false,
            dns: false,
            path: false,
            fs: false,
            os: false,
            crypto: false,
            stream: false,
            http2: false,
            net: false,
            tls: false,
            zlib: false,
            child_process: false
          },
        }
      } else {
        // Webpack 4 uses the `node` option
        config.node = {
          ...config.node ?? {},
          module: "empty",
          dgram: "empty",
          dns: "empty",
          path: "empty",
          fs: "empty",
          os: "empty",
          crypto: "empty",
          stream: "empty",
          http2: "empty",
          net: "empty",
          tls: "empty",
          zlib: "empty",
          child_process: "empty"
        }
      }
    }

    // console.log("isServer");
    // console.log(isServer);
    // console.log("config.plugins");
    // console.log(config.plugins);

    config.stats = { errorDetails: true };

    // Important: return the modified config
    return config;
  },
  // Make sure entries are not getting disposed.
  // See https://github.com/vercel/next.js/blob/0af3b526408bae26d6b3f8cab75c4229998bf7cb/test/integration/typescript-workspaces-paths/packages/www/next.config.js
  onDemandEntries: {
    maxInactiveAge: 1000 * 60 * 60,
  },
  // Put the Service Worker code in the `public` folder to avoid having to serve it separately
  // See https://github.com/shadowwalker/next-pwa#usage-without-custom-server-nextjs-9
  pwa: {
    dest: 'public',
    swSrc: "./src/worker/index.ts",
    compileSrc: true,
    // Register false, since we register manually in `_app.tsx`, and ask the user when to upgrade
    register: false,
    // Cache on frontend nav, it pre-fetches stuff more eagerly
    // See https://github.com/shadowwalker/next-pwa#available-options
    cacheOnFrontEndNav: true,
    // Add plugins to the webpack config of the service worker bundler
    // See https://developers.google.com/web/tools/workbox/reference-docs/latest/module-workbox-webpack-plugin.InjectManifest
    webpackCompilationPlugins: [
      // new webpack.NormalModuleReplacementPlugin(
      //   /^fs$/,
      //   'react'
      // ),

      // new MyExampleWebpackPlugin()


      // new webpack.IgnorePlugin({
      //   resourceRegExp: /(module)|(dgram)|(dns)|(fs)|(http2)|(net)|(tls)|(child_process)/,
      //   // contextRegExp: /fs-capacitor\/lib$/,
      // }),

      // new webpack.IgnorePlugin({
      //   resourceRegExp: /^@apollographql\/graphql-upload-8-fork$/,
      //   // contextRegExp: /fs-capacitor\/lib$/,
      // }),

      // new webpack.BannerPlugin({
      //   banner: 'yoyoyoyo=true;',
      //   raw: true
      // }),

      // webpack.node.NodeTargetPlugin,



      // // This works
      // new webpack.IgnorePlugin({
      //   checkResource(resource, context) {
      //     // do something with resource
      //     console.log("=========================")
      //     console.log(resource)
      //     console.log(context)
      //     if (resource == "@apollographql/graphql-upload-8-fork") {
      //       console.log("IGNORE")
      //       return true;
      //     }
      //     if (resource == "apollo-server-core") {
      //       console.log("IGNORE")
      //       return true;
      //     }
      //     return false;
      //   },
      // })


    ]
  }
}
);
