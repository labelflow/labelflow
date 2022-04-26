const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");

// This file sets a custom webpack configuration to use your Next.js app
// with Sentry.
// https://nextjs.org/docs/api-reference/next.config.js/introduction
// https://docs.sentry.io/platforms/javascript/guides/nextjs/
const { withSentryConfig } = require("@sentry/nextjs");

const SentryWebpackPluginOptions = {
  // Additional config options for the Sentry Webpack plugin. Keep in mind that
  // the following options are set automatically, and overriding them is not
  // recommended:
  //   release, url, org, project, authToken, configFile, stripPrefix,
  //   urlPrefix, include, ignore

  silent: true, // Suppresses all logs
  // For all available options, see:
  // https://github.com/getsentry/sentry-webpack-plugin#options.
};

module.exports = withSentryConfig(
  {
    typescript: { tsconfigPath: "tsconfig.build.json" },
    sentry: {
      disableServerWebpackPlugin:
        process.env.SENTRY_AUTH_TOKEN != null ? false : true,
      disableClientWebpackPlugin:
        process.env.SENTRY_AUTH_TOKEN != null ? false : true,
    },
    // Fix Sentry problem with Next 12
    // See https://github.com/getsentry/sentry-javascript/issues/4090#issuecomment-954484086
    // See https://github.com/vercel/next.js/issues/30561#issuecomment-954032510
    outputFileTracing: false,
    images: {
      deviceSizes: [
        320, 480, 640, 750, 828, 960, 1080, 1200, 1440, 1920, 2048, 2560, 3840,
      ],
    },
    experimental: {
      // Prefer loading of ES Modules over CommonJS
      // @link {https://nextjs.org/blog/next-11-1#es-modules-support|Blog 11.1.0}
      // @link {https://github.com/vercel/next.js/discussions/27876|Discussion}
      esmExternals: true,
      // Experimental monorepo support
      // @link {https://github.com/vercel/next.js/pull/22867|Original PR}
      // @link {https://github.com/vercel/next.js/discussions/26420|Discussion}
      externalDir: true,
    },
    webpack: (
      config,
      { defaultLoaders, dev, isServer, config: nextConfig, ...others }
    ) => {
      config.module.rules.push({
        test: /\.svg$/,
        use: [
          {
            loader: "@svgr/webpack",
            options: {
              typescript: true,
              dimensions: false,
            },
          },
        ],
      });

      // Allow to transpile node modules that depends on node built-ins into browser.
      // E.g.: `apollo-server-core`
      // See https://github.com/webpack-contrib/css-loader/issues/447
      // See https://github.com/vercel/next.js/issues/7755
      if (!isServer) {
        // See https://www.npmjs.com/package/node-polyfill-webpack-plugin
        const NodePolyfillPlugin = require("node-polyfill-webpack-plugin");

        // See https://github.com/webpack-contrib/css-loader/issues/447#issuecomment-761853289
        // See https://github.com/vercel/next.js/issues/7755#issuecomment-812805708
        config.resolve = {
          ...(config.resolve ?? {}),
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
        };
        config.plugins = [
          ...(config?.plugins ?? []),
          new NodePolyfillPlugin({
            excludeAliases: ["console"],
          }),
        ];
      }

      // Add webpack bundle analyzer with custom config to expose the reports publicly
      // See https://github.com/vercel/next.js/blob/canary/packages/next-bundle-analyzer/index.js
      if (!dev) {
        config.plugins.push(
          new BundleAnalyzerPlugin({
            analyzerMode: "static",
            openAnalyzer: false,
            reportFilename: isServer
              ? "../../static/bundle-analyzer/server.html"
              : "./static/bundle-analyzer/client.html",
          })
        );
      }

      // Important: return the modified config
      return config;
    },
    // Make sure entries are not getting disposed.
    // See https://github.com/vercel/next.js/blob/0af3b526408bae26d6b3f8cab75c4229998bf7cb/test/integration/typescript-workspaces-paths/packages/www/next.config.js
    onDemandEntries: {
      maxInactiveAge: 1000 * 60 * 60,
    },
  },
  SentryWebpackPluginOptions
);
