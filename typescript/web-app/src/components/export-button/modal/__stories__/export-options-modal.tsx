import { withNextRouter } from "storybook-addon-next-router";
import { ExportOptionsModal } from "../export-options-modal";
import { chakraDecorator } from "../../../../utils/chakra-decorator";
import { apolloDecorator } from "../../../../utils/apollo-decorator";

export default {
  title: "web-app/Export Button/Options Modal",
  decorators: [chakraDecorator, apolloDecorator, withNextRouter],
};

export const Opened = () => {
  return <ExportOptionsModal isOpen />;
};
