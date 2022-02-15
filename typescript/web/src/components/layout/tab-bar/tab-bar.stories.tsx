import { TabBar, TabBarItem } from ".";
import { WORKSPACE_DATA } from "../../../dev/fixtures";
import {
  createTestWrapperDecorator,
  storybookTitle,
} from "../../../dev/stories";

export default {
  title: storybookTitle(TabBar),
  decorators: [
    createTestWrapperDecorator({
      auth: { withWorkspaces: true },
      apollo: true,
      router: { query: { workspaceSlug: WORKSPACE_DATA.slug } },
    }),
  ],
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
