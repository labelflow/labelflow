import { addDecorator } from "@storybook/react";

import { ExportButton } from "..";
import { chakraDecorator } from "../../../utils/chakra-decorator";
import { apolloDecorator } from "../../../utils/apollo-decorator";

addDecorator(chakraDecorator);
addDecorator(apolloDecorator);

export default {
  title: "web-app/Export Button",
};

export const WithButton = () => {
  return <ExportButton />;
};
