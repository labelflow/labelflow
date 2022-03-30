const NodePolyfillPlugin = require("node-polyfill-webpack-plugin");

module.exports = {
  stories: ["../typescript/**/*.stories.tsx"],
  core: {
    builder: "webpack5",
  },
  addons: [
    "@storybook/addon-essentials",
    "@storybook/addon-interactions",
    "storybook-addon-next-router",
    "@chakra-ui/storybook-addon",
  ],
  typescript: { reactDocgen: "react-docgen" },
  webpackFinal: async (config = {}) => {
    // https://stackoverflow.com/a/61706308
    // Default rule for images /\.(svg|ico|jpg|jpeg|png|gif|eot|otf|webp|ttf|woff|woff2|cur|ani|pdf)(\?.*)?$/
    const fileLoaderRule = config.module.rules.find(
      (rule) => rule.test && rule.test.test(".svg")
    );
    fileLoaderRule.exclude = /\.svg$/;
    return {
      ...config,
      resolve: {
        ...(config.resolve ?? {}),
        alias: {
          ...(config.resolve?.alias ?? {}),
          "@emotion/core": "@emotion/react",
          "emotion-theming": "@emotion/react",
        },
        fallback: {
          ...(config.resolve?.fallback ?? {}),
          child_process: false,
          dgram: false,
          dns: false,
          fs: false,
          http2: false,
          module: false,
          net: false,
          tls: false,
        },
      },
      plugins: [
        ...(config.plugins ?? []),
        new NodePolyfillPlugin({
          excludeAliases: ["console"],
        }),
      ],
      module: {
        ...config.module,
        rules: [
          ...config.module.rules,
          {
            test: /\.svg$/,
            enforce: "pre",
            loader: require.resolve("@svgr/webpack"),
            options: { typescript: true, dimensions: false },
          },
        ],
      },
    };
  },
};
