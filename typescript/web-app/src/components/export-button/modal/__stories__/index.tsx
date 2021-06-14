import { addDecorator } from "@storybook/react";

import { ExportModal } from "..";
import { chakraDecorator } from "../../../../utils/chakra-decorator";
import { apolloDecorator } from "../../../../utils/apollo-decorator";

addDecorator(chakraDecorator);
addDecorator(apolloDecorator);

export default {
  title: "web-app/Export Button/Modal",
};

export const Opened = () => {
  return <ExportModal isOpen />;
};
