import { ExportModal } from "..";
import {
  chakraDecorator,
  apolloMockDecorator,
} from "../../../../utils/stories";

export default {
  title: "web/Export Button/Modal",
  decorators: [chakraDecorator, apolloMockDecorator],
};

export const Opened = () => {
  return <ExportModal isOpen onClose={() => {}} />;
};
