import { QueryParamProvider as ContextProvider } from "use-query-params";

export const queryParamsDecorator = (storyFn: any) => {
  const location = {
    ancestorOrigins: {
      contains: () => false,
      item: () => "",
      length: 1,
    },
    hash: "",
    host: "labelflow.ai",
    hostname: "labelflow.ai",
    href: "https://labelflow.ai",
    origin: "labelflow.ai",
    pathname: "/",
    port: "80",
    protocol: "https",
    search: "",
    assign: () => {},
    reload: () => {},
    replace: () => {},
  };
  const history = {
    push: () => {},
    replace: () => {},
  };
  return (
    <ContextProvider history={history} location={location}>
      {storyFn()}
    </ContextProvider>
  );
};
