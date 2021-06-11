import Router from "next/router";
import { kebabCase } from "lodash/fp";

export const getRouterValue = <T extends string>(name: string): T =>
  Router.query[kebabCase(name)] as T;

export const setRouterValue =
  <T extends string>(name: string) =>
  (value: T): void => {
    const router = Router;
    if (value === null || value === undefined) {
      // Remove params that are undefined
      // This gives simpler, more beautiful URLs
      delete router.query[kebabCase(name)];
    } else {
      router.query[kebabCase(name)] = value;
    }
    Router.replace(router);
  };
