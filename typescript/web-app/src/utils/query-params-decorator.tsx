import { QueryParamProvider } from "./query-params-provider";

export const queryParamsDecorator = (storyFn: any) => {
  return <QueryParamProvider>{storyFn()}</QueryParamProvider>;
};
