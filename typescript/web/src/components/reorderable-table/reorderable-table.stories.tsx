import React from "react";
import { storybookTitle } from "../../dev/stories";
import { TestComponent } from "./reorderable-table.fixtures";

export default {
  title: storybookTitle("Pagination", "Reorderable table"),
};

export const Default = () => <TestComponent onReorder={() => {}} />;
