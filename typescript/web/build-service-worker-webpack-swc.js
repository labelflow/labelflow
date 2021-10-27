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
          test: /\.ts$/i,
          exclude: /(node_modules|bower_components)/,
          // resolve: {
          //   fullySpecified: false
          // },
          use: [
            {
              loader: "swc-loader",
              options: {
                minify: false,
                // module: {
                //   type: 'commonjs',
                // },
                jsc: {
                  // target: "es5",
                  // parser: {
                  //   syntax: 'typescript',
                  //   dynamicImport: true,
                  //   tsx: false,
                  // },
                  // transform: {
                  //   // react: {
                  //   //   runtime: 'automatic',
                  //   //   pragma: 'React.createElement',
                  //   //   pragmaFrag: 'React.Fragment',
                  //   //   throwIfNamespace: true,
                  //   //   // development: development,
                  //   //   useBuiltins: true,
                  //   //   // refresh: hasReactRefresh,
                  //   // },
                  //   optimizer: {
                  //     // simplify: false,
                  //     globals: {
                  //       // typeofs: {
                  //       //   window: 'undefined',
                  //       // },
                  //     },
                  //   },
                  // },
                },
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