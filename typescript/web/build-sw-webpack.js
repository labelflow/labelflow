// DEV Webpack configuration used to build the service worker

const path = require("path");

const NodePolyfillPlugin = require("node-polyfill-webpack-plugin");

module.exports = {
  target: "webworker",
  mode: "development",
  // WARNING: commented out to disable source maps
  devtool: 'inline-source-map',
  entry: {
    index: path.join(__dirname, "src", "worker", "index.ts"),
  },
  resolve: {
    extensions: [".js", ".ts", ".jsx", ".tsx"],
    fallback: {
      crypto: false,
      module: false,
      dgram: false,
      dns: false,
      fs: false,
      http2: false,
      net: false,
      tls: false,
      child_process: false
    }
  },
  output: {
    path: path.join(__dirname, "public"),
    filename: "sw.js",
  },
  module: {
    rules: [
      {
        test: /\.(graphql|gql)$/,
        use: "graphql-tag/loader",
        exclude: /node_modules/
      },
      {
        test: /\.ts$/,
        loader: "ts-loader",
        options: {
          transpileOnly: true,
          onlyCompileBundledFiles: true,
          context: __dirname,
          configFile: path.join(__dirname, 'tsconfig.worker.json')
        },
      },
    ],
  },
  plugins: [
    new NodePolyfillPlugin({
      excludeAliases: ["console"],
    }),
  ],
};