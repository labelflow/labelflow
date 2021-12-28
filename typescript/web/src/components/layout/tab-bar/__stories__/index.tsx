import { TabBar, TabBarItem } from "..";
import { chakraDecorator, storybookTitle } from "../../../../utils/storybook";

export default {
  title: storybookTitle(TabBar),
  decorators: [chakraDecorator],
};

const tabs: TabBarItem[] = [
  {
    name: "Tab 1",
    url: "#",
    isActive: true,
  },
  {
    name: "Tab 2",
    url: "#",
    isActive: false,
  },
  {
    name: "Tab 3",
    url: "#",
    isActive: false,
  },
];

export const Default = () => {
  return <TabBar tabs={tabs} />;
};
