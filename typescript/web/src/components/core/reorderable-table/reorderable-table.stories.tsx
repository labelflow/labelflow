import { storybookTitle } from "../../../utils/stories";
import { chakraDecorator } from "../../../utils/stories/chakra-decorator";
import { TestComponent } from "./reorderable-table.fixtures";

export default {
  title: storybookTitle("Core", "Reorderable table"),
  decorators: [chakraDecorator],
};

export const ReorderableTable = () => <TestComponent onReorder={() => {}} />;
