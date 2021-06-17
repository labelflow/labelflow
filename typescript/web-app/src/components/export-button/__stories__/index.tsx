import { withNextRouter } from "storybook-addon-next-router";

import { chakraDecorator } from "../../../utils/chakra-decorator";
import { apolloDecorator } from "../../../utils/apollo-decorator";
import { queryParamsDecorator } from "../../../utils/query-params-decorator";

import { ExportButton } from "..";

export default {
  title: "web-app/Export Button",
  decorators: [
    chakraDecorator,
    apolloDecorator,
    queryParamsDecorator,
    withNextRouter,
  ],
};

export const WithButton = () => {
  return <ExportButton />;
};

WithButton.parameters = {
  nextRouter: {
    path: "/",
    asPath: "/?modal-export",
  },
};
