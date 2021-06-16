import { ExportModal } from "..";
import { chakraDecorator } from "../../../../utils/chakra-decorator";
import { apolloDecorator } from "../../../../utils/apollo-decorator";

export default {
  title: "web-app/Export Button/Modal",
  decorators: [chakraDecorator, apolloDecorator],
};

export const Opened = () => {
  return <ExportModal isOpen />;
};
