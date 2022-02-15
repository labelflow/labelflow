import { Story } from "@storybook/react";
import React from "react";
import { storybookTitle } from "../../dev/stories";
import { PageNavigation } from "./page-navigation";
import { PaginationProps, PaginationProvider } from "./pagination.context";

export default {
  title: storybookTitle("Pagination", PageNavigation),
  component: PageNavigation,
};

const Template: Story<PaginationProps> = (args) => (
  <PaginationProvider {...args}>
    <PageNavigation />
  </PaginationProvider>
);

export const On1stWith1Page = Template.bind({});
On1stWith1Page.args = { page: 1, itemCount: 1 };

export const On1stWith2Pages = Template.bind({});
On1stWith2Pages.args = { page: 1, itemCount: 15 };

export const On2ndWith2Pages = Template.bind({});
On2ndWith2Pages.args = { page: 2, itemCount: 15 };

export const On1stWithManyPages = Template.bind({});
On1stWithManyPages.args = { page: 1, itemCount: 500 };

export const OnMiddleWithManyPages = Template.bind({});
OnMiddleWithManyPages.args = { page: 42, itemCount: 500 };
