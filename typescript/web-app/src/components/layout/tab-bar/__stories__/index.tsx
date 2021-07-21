import { chakraDecorator } from "../../../../utils/chakra-decorator";

import { TabBar, TabBarItem } from "..";

export default {
  title: "web-app/Tab bar",
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
