import { QueryParamProvider } from "../../utils";

export const queryParamsDecorator = (Story: any) => {
  return (
    <QueryParamProvider>
      <Story />
    </QueryParamProvider>
  );
};
