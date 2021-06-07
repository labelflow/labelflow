module.exports = {
  stories: ["../typescript/**/__stories__/*.tsx"],
  core: {
    builder: "webpack5",
  },
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
          path: false,
          fs: false,
          os: false,
          crypto: false,
          stream: "stream-browserify", // Needed for `probe-image-size`
          http2: false,
          http: false,
          https: false,
          net: false,
          tls: false,
          zlib: false,
          child_process: false
        },
      },
    };
  },
};
