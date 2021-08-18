const NodePolyfillPlugin = require("node-polyfill-webpack-plugin")

module.exports = {
  stories: ["../typescript/**/__stories__/*.tsx"],
  core: {
    builder: "webpack5",
  },
  addons: [
    "storybook-addon-next-router",
  ],
  typescript: { reactDocgen: "react-docgen" },
  webpackFinal: async (config) => {
    return {
      ...config ?? {},

      module: {
        ...config?.module ?? {},
        rules: [
          ...config?.module?.rules ?? [],
          {
            test: /\.(graphql|gql)$/,
            use: "graphql-tag/loader",
            exclude: /node_modules/
          }
        ],
      },
      resolve: {
        ...config?.resolve ?? {},
        alias: {
          ...config?.resolve?.alias ?? {},
          "@emotion/core": "@emotion/react",
          "emotion-theming": "@emotion/react",
        },
        fallback: {
          ...config?.resolve?.fallback ?? {},
          module: false,
          dgram: false,
          dns: false,
          fs: false,
          http2: false,
          net: false,
          tls: false,
          child_process: false
        },
      },
      plugins: [
        ...config?.plugins ?? [],
        new NodePolyfillPlugin({
          excludeAliases: ["console"]
        })
      ]
    };
  },
};
