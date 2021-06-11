import { addDecorator } from "@storybook/react";

import { ExportFormatCard } from "../export-format-card";
import { chakraDecorator } from "../../../../utils/chakra-decorator";
import { apolloDecorator } from "../../../../utils/apollo-decorator";

addDecorator(chakraDecorator);
addDecorator(apolloDecorator);

export default {
  title: "web-app/Export Button/export format card",
};

export const Default = () => {
  return <ExportFormatCard />;
};
