// DEV Webpack configuration used to build the service worker

const path = require("path");
// const nodeExternals = require('webpack-node-externals');
const NodePolyfillPlugin = require("node-polyfill-webpack-plugin");

module.exports = {
  target: "webworker",
  mode: "development",
  // WARNING: commented out to disable source maps
  devtool: 'inline-source-map',
  entry: {
    index: path.join(__dirname, "src", "worker", "index.ts"),
  },
  // externalsPresets: { node: true }, // in order to ignore built-in modules like path, fs, etc.
  // externals: [nodeExternals({ modulesDir: path.resolve(__dirname, 'node_modules') })],
  resolve: {
    extensions: [".js", ".ts", ".jsx", ".tsx"],
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
  output: {
    path: path.join(__dirname, "public"),
    filename: "sw.js",
  },
  module: {
    rules: [
      {
        test: /\.(t|j)s$/i,
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
};