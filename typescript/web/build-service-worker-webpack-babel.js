const path = require("path");
const webpack = require('webpack')
const NodePolyfillPlugin = require("node-polyfill-webpack-plugin");

const buildServiceWorker = () => {
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
          test: /\.m?(t|j)sx?$/i,
          resolve: {
            fullySpecified: false
          },
          use: [
            {
              loader: 'babel-loader',
              options: {
                presets: [
                  [
                    'next/babel',
                    {
                      'transform-runtime': {
                        corejs: false,
                        helpers: true,
                        regenerator: false,
                        useESModules: true
                      },
                      'preset-env': {
                        modules: false,
                        targets: 'chrome >= 56'
                      }
                    }
                  ]
                ]
              }
            }
          ]
        }
        // {
        //   test: /\.ts$/,
        //   loader: "ts-loader",
        //   options: {
        //     transpileOnly: true,
        //     onlyCompileBundledFiles: true,
        //     context: __dirname,
        //     configFile: path.join(__dirname, 'tsconfig.worker.json')
        //   },
        // },
      ],
    },
    plugins: [
      new NodePolyfillPlugin({
        excludeAliases: ["console"],
      }),
    ],
    optimization: undefined
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