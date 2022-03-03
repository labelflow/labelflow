import { Story } from "@storybook/react";
import { PaginationProps, PaginationProvider, PaginationToolbar } from ".";
import { chakraDecorator, storybookTitle } from "../../../utils/stories";

export default {
  title: storybookTitle("Core", "Pagination", PaginationToolbar),
  component: PaginationToolbar,
  decorators: [chakraDecorator],
};

const Template: Story<PaginationProps> = (args) => (
  <PaginationProvider {...args}>
    <PaginationToolbar width="100%" />
  </PaginationProvider>
);

export const Default = Template.bind({});
Default.args = {
  itemCount: 100,
};

export const On1stWith1Page = Template.bind({});
On1stWith1Page.args = {
  itemCount: 1,
  page: 1,
  perPage: 10,
};

export const On1stWith60ItemsAnd2Pages = Template.bind({});
On1stWith60ItemsAnd2Pages.args = {
  itemCount: 60,
  page: 1,
  perPage: 25,
};

export const On2ndWith60ItemsAnd2Pages = Template.bind({});
On2ndWith60ItemsAnd2Pages.args = {
  itemCount: 60,
  page: 2,
  perPage: 50,
};

export const With50ItemsAnd100PerPage = Template.bind({});
With50ItemsAnd100PerPage.args = {
  itemCount: 60,
  perPage: 100,
};
