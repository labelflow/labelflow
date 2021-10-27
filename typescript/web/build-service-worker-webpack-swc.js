const path = require("path");
const webpack = require('webpack')
const NodePolyfillPlugin = require("node-polyfill-webpack-plugin");
const TerserPlugin = require('terser-webpack-plugin')

const buildServiceWorker = ({ minify }) => {
  webpack({
    target: "webworker",
    mode: "none",
    // WARNING: commented out to disable source maps
    // devtool: 'inline-source-map',
    entry: {
      main: path.join(__dirname, "src", "worker", "index.ts"),
    },
    output: {
      path: path.join(__dirname, "public"),
      filename: "sw.js",
    },
    resolve: {
      extensions: [".mjs", ".js", ".ts", ".jsx", ".tsx"],
      fallback: {
        child_process: false,
        dgram: false,
        dns: false,
        fs: false,
        http2: false,
        module: false,
        net: false,
        tls: false
      }
    },
    module: {
      rules: [

        {
          test: /\.(t|j)sx?$/i,
          exclude: /(node_modules|bower_components)/,
          resolve: {
            fullySpecified: false
          },
          use: [
            {
              loader: "swc-loader",
              options: {


                // "env": {
                //   "coreJs": 3
                // },
                // "minify": minify,
                minify: false,
                // // "exclude": ["stream", "jszip"],
                // "module": {
                //   // You can specify "commonjs", "es6", "amd", "umd"
                //   "type": "es6",
                //   "strict": true,
                //   "strictMode": true,
                //   "lazy": false,
                //   "noInterop": false,
                //   // ignoreDynamic: true
                // },
                jsc: {
                  //  es3 / es5 / es2015 / es2016
                  "target": "es2015",
                  "loose": false,
                  "externalHelpers": true,
                  "keepClassNames": true,
                  "parser": {
                    "syntax": "typescript",
                    "tsx": true,
                    "decorators": false,
                    "dynamicImport": true
                  },
                  // "transform": {
                  //   "optimizer": {
                  //     "globals": {
                  //       "vars": {
                  //         // "process.env.NODE_ENV": "production",
                  //         // "process.env.SENTRY_DSN": process.env.SENTRY_DSN || process.env.NEXT_PUBLIC_SENTRY_DSN,
                  //         // "process.env.NEXT_PUBLIC_SENTRY_DSN": process.env.SENTRY_DSN || process.env.NEXT_PUBLIC_SENTRY_DSN
                  //       }
                  //     }
                  //   }
                  // }
                },
                //   "transform": null,
                // "target": "es2016",
                //   "loose": false,
                //   "externalHelpers": false,
                //   "keepClassNames": false,
                //   "transform": {
                //     "constModules": {

                //       "globals": {
                //         "stream": {
                //           "DEBUG": "true"
                //         },
                //       }
                //     }
                //   }
                // }

              }
            }
          ]
        },
        {
          test: /\.m?js/,
          resolve: {
            fullySpecified: false
          }
        },
      ],
    },
    plugins: [
      new NodePolyfillPlugin({
        excludeAliases: ["console"],
      }),
    ],
    optimization: minify
      ? {
        minimize: true,
        minimizer: [new TerserPlugin()]
      }
      : undefined
  }).run((error, status) => {
    if (error || status.hasErrors()) {
      console.error(`Failed to build service worker`);
      console.error(status.toString({ colors: true }));
      process.exit(-1);
    } else {
      console.log(`Successfully built service worker`);
    }
  });
};

module.exports = buildServiceWorker;