import { useState } from "react";

export const useQueryParamsMock = (
  initialValues: Record<string, unknown> = {}
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
