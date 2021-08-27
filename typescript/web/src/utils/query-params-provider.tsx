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

  const { pathname, asPath } = router;

  const location = useMemo(
    () =>
      // Do not use window.location here because it breaks storybook next router addon and query param decorator
      ({
        search: asPath.replace(/[^?]+/u, ""),
      } as Location),
    [asPath]
  );

  const history = useMemo(
    () => ({
      push: ({ search }: Location) => {
        router.push({ path: router.asPath, search }, undefined, {
          shallow: true,
          scroll: false,
        });
      },
      replace: ({ search }: Location) => {
        console.log("REPLACE", {
          pathname: router.pathname,
          search,
          query: router.query,
        });
        router.replace(
          { path: router.asPath, search, query: router.query },
          undefined,
          {
            shallow: true,
            scroll: false,
          }
        );
      },
      location,
    }),
    [pathname, router.pathname, router.query] // See https://github.com/pbeshai/use-query-params/issues/13#issuecomment-839697642
  );

  return (
    <ContextProvider {...rest} history={history} location={location}>
      {children}
    </ContextProvider>
  );
};

export const QueryParamProvider = memo(QueryParamProviderComponent);
