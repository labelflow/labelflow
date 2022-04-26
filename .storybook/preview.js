import { MINIMAL_VIEWPORTS } from "@storybook/addon-viewport";
import { pascalCase } from "change-case";
import { RouterContext } from "next/dist/shared/lib/router-context"; // next 11.2
import { theme } from "../typescript/web/src/theme";

// Reuse Cypress values to make sure that it's compliant with our minimal UX requirements
const CYPRESS_SCREEN_WIDTH = 1000;
const CYPRESS_SCREEN_HEIGHT = 660;

const CYPRESS_VIEWPORT = {
  name: "Cypress",
  type: "desktop",
  styles: {
    width: `${CYPRESS_SCREEN_WIDTH}px`,
    height: `${CYPRESS_SCREEN_HEIGHT}px`,
  },
};

const CHAKRA_SIZES = {
  "3xs": "14rem",
  "2xs": "16rem",
  xs: "20rem",
  sm: "24rem",
  md: "28rem",
  lg: "32rem",
  xl: "36rem",
  "2xl": "42rem",
  "3xl": "48rem",
  "4xl": "56rem",
  "5xl": "64rem",
  "6xl": "72rem",
  "7xl": "80rem",
  "8xl": "90rem",
};

const CHAKRA_VIEWPORTS = Object.entries(CHAKRA_SIZES).reduce(
  (prev, [name, size]) => ({
    ...prev,
    [`chakra-sizes-${name}`]: {
      name: `Chakra UI ${name}`,
      type: "desktop",
      styles: { width: size, height: `${CYPRESS_SCREEN_HEIGHT}px` },
    },
  }),
  {}
);

const CHAKRA_CONTAINER_SIZES = {
  sm: "640px",
  md: "768px",
  lg: "1024px",
  xl: "1280px",
};

const CHAKRA_CONTAINER_VIEWPORTS = Object.entries(CHAKRA_CONTAINER_SIZES).reduce(
  (prev, [name, size]) => ({
    ...prev,
    [`chakra-sizes-container-${name}`]: {
      name: `Chakra UI ${name} (container)`,
      type: "desktop",
      styles: { width: size, height: `${CYPRESS_SCREEN_HEIGHT}px` },
    },
  }),
  {}
);

const STORYBOOK_VIEWPORTS = {
  ...MINIMAL_VIEWPORTS,
  ...CHAKRA_VIEWPORTS,
  ...CHAKRA_CONTAINER_VIEWPORTS,
  cypress: CYPRESS_VIEWPORT,
};

export const parameters = {
  options: {
    // Sort stories alphabetically by default
    storySort: (a, b) =>
      a[1].kind === b[1].kind
        ? 0
        : a[1].id.localeCompare(b[1].id, undefined, { numeric: true }),
  },
  viewport: { viewports: STORYBOOK_VIEWPORTS },
  nextRouter: {
    Provider: RouterContext.Provider,
    isReady: true,
    path: "/", // defaults to `/`
    asPath: "/", // defaults to `/`
    query: {}, // defaults to `{}`
    push() {}, // defaults to using addon actions integration,
  },
  chakra: { theme },
};
