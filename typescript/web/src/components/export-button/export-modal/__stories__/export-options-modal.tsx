import { ExportFormat } from "@labelflow/graphql-types";
import { ExportOptionsModal } from "../export-options-modal";
import { chakraDecorator, apolloDecorator } from "../../../../utils/storybook";

export default {
  title: "web/Export Button/Options Modal",
  decorators: [chakraDecorator, apolloDecorator],
};

export const Opened = () => {
  return <ExportOptionsModal isOpen exportFormat={ExportFormat.Coco} />;
};
