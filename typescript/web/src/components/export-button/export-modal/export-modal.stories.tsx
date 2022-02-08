import { ExportModal } from ".";
import {
  apolloMockDecorator,
  chakraDecorator,
  storybookTitle,
} from "../../../utils/stories";

export default {
  title: storybookTitle("Export Button", ExportModal),
  decorators: [chakraDecorator, apolloMockDecorator],
};

export const Opened = () => {
  return <ExportModal isOpen onClose={() => {}} />;
};
