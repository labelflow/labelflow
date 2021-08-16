import NextRouter from "next/router";
import { kebabCase } from "lodash/fp";

/**
 * The real router to use: Either the real Next Router, or a mock, for storybook
 * This is needed to make it work inside storybook
 */
const Router: {
  query: { [key: string]: any };
  pathname: string;
  replace: (a: any, b: any, c: any) => void;
} = NextRouter.router
  ? NextRouter
  : {
      query: {},
      pathname: "",
      replace: () => {},
    };

export const getRouterValue = <T extends string>(name: string): T =>
  Router.query[kebabCase(name)] as T;

export const setRouterValue =
  <T extends string>(name: string) =>
  (value: T): void => {
    const { query, pathname } = Router;
    if (value === null || value === undefined) {
      // Remove params that are undefined
      // This gives simpler, more beautiful URLs
      delete query[kebabCase(name)];
    } else {
      query[kebabCase(name)] = value;
    }
    Router.replace({ pathname, query }, undefined, {
      shallow: true,
      scroll: false,
    });
  };
