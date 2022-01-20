import React from "react";
import { chakraDecorator } from "../../../utils/stories/chakra-decorator";
import { TestComponent } from "../reorderable-table.fixtures";

export default {
  title: "web/Reorderable table",
  decorators: [chakraDecorator],
};

export const Default = () => <TestComponent onReorder={() => {}} />;
