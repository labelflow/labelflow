const NodePolyfillPlugin = require("node-polyfill-webpack-plugin");

// FIXME SW Delete this constant once every story has been fixed following the service worker removal
const STORIES = [
  "../typescript/react-openlayers-fiber/src/**/*.stories.tsx",
  "../typescript/web/src/components/invitation-manager/**/*.stories.tsx",
  "../typescript/web/src/components/optional-text/**/*.stories.tsx",
  "../typescript/web/src/components/export-button/export-modal/**/*.stories.tsx",
  "../typescript/web/src/components/export-button/**/*.stories.tsx",
  "../typescript/web/src/components/datasets/**/*.stories.tsx",
  "../typescript/web/src/components/class-selection-popover/class-list-item/**/*.stories.tsx",
  "../typescript/web/src/components/class-selection-popover/**/*.stories.tsx",
  "../typescript/web/src/components/layout/top-bar/keymap-button/keymap-modal/**/*.stories.tsx",
  "../typescript/web/src/components/layout/top-bar/breadcrumbs/**/*.stories.tsx",
  "../typescript/web/src/components/layout/tab-bar/**/*.stories.tsx",
  // "../typescript/web/src/components/gallery/**/*.stories.tsx",
  "../typescript/web/src/components/welcome-manager/**/*.stories.tsx",
  "../typescript/web/src/components/cookie-banner/**/*.stories.tsx",
  "../typescript/web/src/components/auth-manager/signin-modal/**/*.stories.tsx",
  "../typescript/web/src/components/empty-state/**/*.stories.tsx",
  "../typescript/web/src/components/members/**/*.stories.tsx",
  "../typescript/web/src/components/reorderable-table/**/*.stories.tsx",
  "../typescript/web/src/components/workspace-name-input/**/*.stories.tsx",
  // "../typescript/web/src/components/labeling-tool/image-navigation/**/*.stories.tsx",
  "../typescript/web/src/components/labeling-tool/options-tool-bar/class-addition-menu/**/*.stories.tsx",
  "../typescript/web/src/components/labeling-tool/options-tool-bar/class-selection-menu/**/*.stories.tsx",
  // "../typescript/web/src/components/labeling-tool/**/*.stories.tsx",
  "../typescript/web/src/components/labeling-tool/drawing-tool-bar/**/*.stories.tsx",
  "../typescript/web/src/components/import-button/import-images-modal/**/*.stories.tsx",
  "../typescript/web/src/components/spinner/**/*.stories.tsx",
  "../typescript/web/src/components/dataset-classes/**/*.stories.tsx",
  "../typescript/web/src/components/pagination/**/*.stories.tsx",
  "../typescript/web/src/components/workspace-switcher/create-workspace-modal/**/*.stories.tsx",
  "../typescript/web/src/components/workspace-switcher/workspace-menu/workspace-selection-popover/**/*.stories.tsx",
  "../typescript/web/src/components/workspace-switcher/workspace-menu/workspace-selection-popover/workspace-list-item/**/*.stories.tsx",
  "../typescript/web/src/components/workspace-switcher/workspace-menu/**/*.stories.tsx",
  "../typescript/web/src/components/toggle-button-group/**/*.stories.tsx",
];

module.exports = {
  stories: STORIES,
  // FIXME SW Uncomment the lines below once every story has been fixed following the service worker removal
  // stories: [
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
