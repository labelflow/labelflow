import { isNil } from "lodash/fp";
import { DomainLocale } from "next/dist/server/config-shared";
import { MittEmitter } from "next/dist/shared/lib/mitt";
import { PrefetchOptions } from "next/dist/shared/lib/router/router";
import { NextRouter } from "next/router";
import { ParsedUrlQuery } from "querystring";
import { Url } from "url";

export type RouterMockOptions = Partial<
  Pick<NextRouter, "pathname" | "query" | "isReady">
>;

/* Types TransitionOptions and NextHistoryState are not exported */
type NextTransitionOptions = {
  shallow?: boolean;
  locale?: string | false;
  scroll?: boolean;
};

type NextHistoryState = {
  url: string;
  as: string;
  options: NextTransitionOptions;
};

export class RouterMock implements NextRouter {
  pathname: string;

  query: ParsedUrlQuery;

  isReady: boolean;

  constructor({
    query = {},
    pathname = "/",
    isReady = true,
  }: Partial<RouterMockOptions> = {}) {
    this.pathname = pathname;
    this.query = query;
    this.isReady = isReady;
  }

  async replace({ pathname, query }: Url): Promise<boolean> {
    if (isNil(query) || isNil(pathname)) return false;
    if (typeof query === "string") {
      throw new Error("Replacing queries as string is unsupported");
    }
    this.query = query;
    this.pathname = pathname;
    return true;
  }

  push(url: Url): Promise<boolean> {
    return this.replace(url);
  }

  /** Properties below are not supported yet */
  /* eslint-disable @typescript-eslint/no-unused-vars */
  /* eslint-disable class-methods-use-this */
  // @ts-ignore
  route: string;

  // @ts-ignore
  asPath: string;

  // @ts-ignore
  basePath: string;

  locale?: string | undefined;

  locales?: string[] | undefined;

  defaultLocale?: string | undefined;

  domainLocales?: DomainLocale[] | undefined;

  // @ts-ignore
  isLocaleDomain: boolean;

  reload(): void {
    throw new Error("Method not implemented.");
  }

  back(): void {
    throw new Error("Method not implemented.");
  }

  prefetch(
    url: string,
    asPath?: string,
    options?: PrefetchOptions
  ): Promise<void> {
    return Promise.resolve();
    // throw new Error("Method not implemented.");
  }

  beforePopState(cb: (state: NextHistoryState) => boolean): void {
    throw new Error("Method not implemented.");
  }

  // @ts-ignore
  events: MittEmitter<
    | "routeChangeStart"
    | "beforeHistoryChange"
    | "routeChangeComplete"
    | "routeChangeError"
    | "hashChangeStart"
    | "hashChangeComplete"
  >;

  // @ts-ignore
  isFallback: boolean;

  // @ts-ignore
  isPreview: boolean;
  /* eslint-enable class-methods-use-this */
}

const nextRouterMock = (options: RouterMockOptions | undefined) => {
  const router = new RouterMock(options);
  return { useRouter: jest.fn(() => router) };
};

export const mockNextRouter = (options?: RouterMockOptions) => {
  jest.mock("next/router", () => nextRouterMock(options));
};
