import React from "react";
import { storybookTitle } from "../../utils/stories";
import { chakraDecorator } from "../../utils/stories/chakra-decorator";
import { TestComponent } from "./reorderable-table.fixtures";

export default {
  title: storybookTitle("Pagination", "Reorderable table"),
  decorators: [chakraDecorator],
};

export const Default = () => <TestComponent onReorder={() => {}} />;
