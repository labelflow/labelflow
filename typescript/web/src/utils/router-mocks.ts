import { useState } from "react";

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

const nextRouterMock = ({
  query: initialQuery = {},
  pathname: initialPathname = "/",
  isReady: initialIsReady = true,
} = {}) => {
  // @ts-ignore
  const router = {
    pathname: initialPathname,
    query: initialQuery,
    replace: ({ pathname, query }: { pathname: any; query: any }) => {
      router.query = query;
      router.pathname = pathname;
    },
    push: ({ pathname, query }: { pathname: any; query: any }) => {
      router.query = query;
      router.pathname = pathname;
    },
    useRouter: jest.fn(() => router),
    isReady: initialIsReady,
  };
  return router;
};

export const mockNextRouter = (
  options?: Parameters<typeof nextRouterMock>[0]
) => {
  jest.mock("next/router", () => nextRouterMock(options));
};
