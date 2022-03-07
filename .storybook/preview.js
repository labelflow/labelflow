import { RouterContext } from "next/dist/shared/lib/router-context"; // next 11.2
import { theme } from "../typescript/web/src/theme";

export const parameters = {
  options: {
    // Sort stories alphabetically by default
    storySort: (a, b) =>
      a[1].kind === b[1].kind
        ? 0
        : a[1].id.localeCompare(b[1].id, undefined, { numeric: true }),
  },
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
