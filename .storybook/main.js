const NodePolyfillPlugin = require("node-polyfill-webpack-plugin");

// FIXME SW Delete this constant once every story has been fixed following the service worker removal
const STORIES = [
  "../typescript/react-openlayers-fiber/src/**/__stories__/*.tsx",
  "../typescript/web/src/components/invitation-manager/__stories__/*.tsx",
  "../typescript/web/src/components/optional-text/__stories__/*.tsx",
  "../typescript/web/src/components/export-button/export-modal/__stories__/*.tsx",
  "../typescript/web/src/components/export-button/__stories__/*.tsx",
  "../typescript/web/src/components/datasets/__stories__/*.tsx",
  "../typescript/web/src/components/class-selection-popover/class-list-item/__stories__/*.tsx",
  "../typescript/web/src/components/class-selection-popover/__stories__/*.tsx",
  "../typescript/web/src/components/layout/top-bar/keymap-button/keymap-modal/__stories__/*.tsx",
  "../typescript/web/src/components/layout/top-bar/breadcrumbs/__stories__/*.tsx",
  "../typescript/web/src/components/layout/tab-bar/__stories__/*.tsx",
  // "../typescript/web/src/components/gallery/__stories__/*.tsx",
  "../typescript/web/src/components/welcome-manager/__stories__/*.tsx",
  "../typescript/web/src/components/cookie-banner/__stories__/*.tsx",
  "../typescript/web/src/components/auth-manager/signin-modal/__stories__/*.tsx",
  "../typescript/web/src/components/empty-state/__stories__/*.tsx",
  "../typescript/web/src/components/members/__stories__/*.tsx",
  "../typescript/web/src/components/reorderable-table/__stories__/*.tsx",
  "../typescript/web/src/components/workspace-name-input/__stories__/*.tsx",
  // "../typescript/web/src/components/labeling-tool/image-navigation/__stories__/*.tsx",
  "../typescript/web/src/components/labeling-tool/options-tool-bar/class-addition-menu/__stories__/*.tsx",
  "../typescript/web/src/components/labeling-tool/options-tool-bar/class-selection-menu/__stories__/*.tsx",
  // "../typescript/web/src/components/labeling-tool/__stories__/*.tsx",
  "../typescript/web/src/components/labeling-tool/drawing-tool-bar/__stories__/*.tsx",
  "../typescript/web/src/components/import-button/import-images-modal/__stories__/*.tsx",
  "../typescript/web/src/components/spinner/__stories__/*.tsx",
  "../typescript/web/src/components/dataset-classes/__stories__/*.tsx",
  "../typescript/web/src/components/pagination/__stories__/*.tsx",
  "../typescript/web/src/components/workspace-switcher/create-workspace-modal/__stories__/*.tsx",
  "../typescript/web/src/components/workspace-switcher/workspace-menu/workspace-selection-popover/__stories__/*.tsx",
  "../typescript/web/src/components/workspace-switcher/workspace-menu/workspace-selection-popover/workspace-list-item/__stories__/*.tsx",
  "../typescript/web/src/components/workspace-switcher/workspace-menu/__stories__/*.tsx",
  "../typescript/web/src/components/toggle-button-group/__stories__/*.tsx",
];

module.exports = {
  stories: STORIES,
  // FIXME SW Uncomment the lines below once every story has been fixed following the service worker removal
  // stories: [
  //   "../typescript/**/__stories__/*.tsx",
  //   "../typescript/**/*.stories.tsx",
  // ],
  core: {
    builder: "webpack5",
  },
  addons: ["storybook-addon-next-router"],
  typescript: { reactDocgen: "react-docgen" },
  webpackFinal: async (config) => {
    return {
      ...(config ?? {}),
      resolve: {
        ...(config?.resolve ?? {}),
        alias: {
          ...(config?.resolve?.alias ?? {}),
          "@emotion/core": "@emotion/react",
          "emotion-theming": "@emotion/react",
        },
        fallback: {
          ...(config?.resolve?.fallback ?? {}),
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
        ...(config?.plugins ?? []),
        new NodePolyfillPlugin({
          excludeAliases: ["console"],
        }),
      ],
    };
  },
};
