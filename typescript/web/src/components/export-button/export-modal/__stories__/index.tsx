import { ExportModal } from "..";
import { chakraDecorator, apolloDecorator } from "../../../../utils/stories";

export default {
  title: "web/Export Button/Modal",
  decorators: [chakraDecorator, apolloDecorator],
};

export const Opened = () => {
  return <ExportModal isOpen onClose={() => {}} />;
};
