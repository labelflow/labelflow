const withPWA = require('next-pwa')

const path = require("path");
module.exports = withPWA({
  images: {
    deviceSizes: [
      320, 480, 640, 750, 828, 960, 1080, 1200, 1440, 1920, 2048, 2560, 3840,
    ],
  },
  future: {
    webpack5: false,
  },
  webpack: (config, { defaultLoaders, isServer, config: nextConfig, ...others }) => {
    // Note: we provide webpack above so you should not `require` it
    // Perform customizations to webpack config

    // Add graphql import
    // See https://www.npmjs.com/package/graphql-tag#webpack-loading-and-preprocessing
    config.module.rules = [
      ...config.module.rules,
      {
        test: /\.(graphql|gql)$/,
        exclude: /node_modules/,
        loader: "graphql-tag/loader",
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
        include: [resolvedBaseUrl],
        use: defaultLoaders.babel,
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
        const isWebpack5 = nextConfig.future.webpack5;
        if (isWebpack5) {
          throw new Error("Webpack 5 not yet supported, check next.config.js")
        } else {
          // Return a webpack4-like `externals` option function
          return (context, request, callback) => {
            if (/^ol/.test(request)) {
              // Make an exception for `ol`, never externalize this import, it must be transpiled and bundled
              callback();
            } else {
              // Use the standard NextJS `externals` function
              external(context, request, callback)
            }
          }
        }
      }
    })

    // Important: return the modified config
    return config;
  },
  // Make sure entries are not getting disposed.
  // See https://github.com/vercel/next.js/blob/0af3b526408bae26d6b3f8cab75c4229998bf7cb/test/integration/typescript-workspaces-paths/packages/www/next.config.js
  onDemandEntries: {
    maxInactiveAge: 1000 * 60 * 60,
  },
});
