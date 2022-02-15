import { Story } from "@storybook/react";
import React from "react";
import { storybookTitle } from "../../utils/stories";
import { chakraDecorator } from "../../utils/stories/chakra-decorator";
import { PaginationProps, PaginationProvider } from "./pagination.context";
import { PerPageInput } from "./per-page-input";

export default {
  title: storybookTitle("Pagination", PerPageInput),
  component: PerPageInput,
  decorators: [chakraDecorator],
};

const Template: Story<PaginationProps> = (args) => (
  <PaginationProvider {...args}>
    <PerPageInput />
  </PaginationProvider>
);

export const Default = Template.bind({});
Default.args = {
  page: 1,
  perPage: 25,
  itemCount: 200,
  perPageOptions: [10, 25, 50, 100],
};
