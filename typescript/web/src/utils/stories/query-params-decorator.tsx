import { QueryParamProvider } from "../query-params-provider";

export const queryParamsDecorator = (Story: any) => {
  return (
    <QueryParamProvider>
      <Story />
    </QueryParamProvider>
  );
};
