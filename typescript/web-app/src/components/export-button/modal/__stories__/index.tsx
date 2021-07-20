import { withNextRouter } from "storybook-addon-next-router";
import { ExportModal } from "..";
import { chakraDecorator } from "../../../../utils/chakra-decorator";
import { apolloDecorator } from "../../../../utils/apollo-decorator";

export default {
  title: "web-app/Export Button/Modal",
  decorators: [chakraDecorator, apolloDecorator, withNextRouter],
};

export const Opened = () => {
  return <ExportModal isOpen />;
};
