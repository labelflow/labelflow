// This entire file is copied from github
// See https://github.com/pbeshai/use-query-params/issues/13#issuecomment-815577849

import React, { memo, useMemo } from "react";
import { useRouter } from "next/router";
import { QueryParamProvider as ContextProvider } from "use-query-params";

export const QueryParamProviderComponent = (props: {
  children?: React.ReactNode;
}) => {
  const { children, ...rest } = props;
  const router = useRouter();
  const match = router.asPath.match(/[^?]+/);
  const pathname = match ? match[0] : router.asPath;

  const location = useMemo(
    () =>
      ({
        search: router.asPath.replace(/[^?]+/u, ""),
      } as Location),
    [router.asPath]
  );

  const history = useMemo(
    () => ({
      push: ({ search }: Location) => {
        router.push(
          { pathname, search },
          { search, pathname },
          { shallow: true, scroll: false }
        );
      },
      replace: ({ search }: Location) => {
        router.replace(
          { pathname, search },
          { search, pathname },
          { shallow: true, scroll: false }
        );
      },
      location,
    }),
    [pathname, router.pathname, router.query, location.pathname] // See https://github.com/pbeshai/use-query-params/issues/13#issuecomment-839697642
  );

  return (
    <ContextProvider {...rest} history={history} location={location}>
      {children}
    </ContextProvider>
  );
};

export const QueryParamProvider = memo(QueryParamProviderComponent) as (props: {
  children: React.ReactNode;
}) => JSX.Element;
