import { ExportOptionsModal } from "../export-options-modal";
import { chakraDecorator } from "../../../../utils/chakra-decorator";
import { apolloDecorator } from "../../../../utils/apollo-decorator";
import { ExportFormat } from "../../../../../../graphql-types/src/graphql-types.generated";

export default {
  title: "web/Export Button/Options Modal",
  decorators: [chakraDecorator, apolloDecorator],
};

export const Opened = () => {
  return <ExportOptionsModal isOpen exportFormat={ExportFormat.Coco} />;
};
