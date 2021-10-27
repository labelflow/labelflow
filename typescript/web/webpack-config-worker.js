// DEV Webpack configuration used to build the service worker

const path = require("path");
// const nodeExternals = require('webpack-node-externals');
const NodePolyfillPlugin = require("node-polyfill-webpack-plugin");

module.exports = {
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
  // externalsPresets: { node: true }, // in order to ignore built-in modules like path, fs, etc.
  // externals: [nodeExternals({ modulesDir: path.resolve(__dirname, 'node_modules') })],
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
};