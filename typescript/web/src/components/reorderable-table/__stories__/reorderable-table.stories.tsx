import React from "react";
import { chakraDecorator } from "../../../utils/chakra-decorator";
import { TestComponent } from "../reorderable-table.fixtures";

export default {
  title: "web/Reorderable table",
  decorators: [chakraDecorator],
};

export const Default = () => <TestComponent onReorder={() => {}} />;
