import { Story } from "@storybook/react";
import React from "react";
import { chakraDecorator, storybookTitle } from "../../../utils/stories";
import { PaginationProps, PaginationProvider } from "./pagination.context";
import { PerPageInput as PerPageInputComponent } from "./per-page-input";

export default {
  title: storybookTitle("Core", "Pagination", PerPageInputComponent),
  component: PerPageInputComponent,
  decorators: [chakraDecorator],
};

const Template: Story<PaginationProps> = (args) => (
  <PaginationProvider {...args}>
    <PerPageInputComponent />
  </PaginationProvider>
);

export const PerPageInput = Template.bind({});
PerPageInput.args = {
  page: 1,
  perPage: 25,
  itemCount: 200,
  perPageOptions: [10, 25, 50, 100],
};
