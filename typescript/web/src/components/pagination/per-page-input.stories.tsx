import { Story } from "@storybook/react";
import React from "react";
import { chakraDecorator } from "../../utils/stories/chakra-decorator";
import { PerPageInput } from "./per-page-input";
import { PaginationProps, PaginationProvider } from "./pagination.context";

export default {
  title: "web/Pagination/Per-page input",
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
