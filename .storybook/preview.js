import { RouterContext } from "next/dist/shared/lib/router-context"; // next 11.2

export const parameters = {
  nextRouter: {
    Provider: RouterContext.Provider,
    path: '/', // defaults to `/`
    asPath: '/', // defaults to `/`
    query: {}, // defaults to `{}`
    push() {
    } // defaults to using addon actions integration,
  },
}