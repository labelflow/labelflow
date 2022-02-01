import { isNil } from "lodash/fp";
import { NextRouter } from "next/router";
import { ParsedUrlQuery } from "querystring";
import { useState } from "react";
import { Url } from "url";

export const useQueryParamsMock = (
  initialValues: { [key: string]: any } = {}
) => ({
  useQueryParam: (paramName: string) =>
    useState(initialValues[paramName] ?? false),
  withDefault: () => undefined,
  StringParam: () => undefined,
});

export const mockUseQueryParams = (
  options?: Parameters<typeof useQueryParamsMock>[0]
) => {
  jest.mock("use-query-params", () => useQueryParamsMock(options));
};

export class RouterMock implements Pick<NextRouter, "pathname" | "query"> {
  constructor(
    public pathname: string,
    public query: ParsedUrlQuery,
    public isReady: boolean
  ) {}

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
}

const nextRouterMock = ({
  query: initialQuery = {},
  pathname: initialPathname = "/",
  isReady: initialIsReady = true,
} = {}) => {
  const router = new RouterMock(initialPathname, initialQuery, initialIsReady);
  return { useRouter: jest.fn(() => router) };
};

export const mockNextRouter = (
  options?: Parameters<typeof nextRouterMock>[0]
) => {
  jest.mock("next/router", () => nextRouterMock(options));
};
