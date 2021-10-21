import { TabBar } from "./tab-bar";

export type Props = {
  currentTab: "datasets" | "members" | "settings";
  workspaceSlug: string;
};

export const WorkspaceTabBar = ({ currentTab, workspaceSlug }: Props) => {
  const tabs = [
    {
      name: "datasets",
      url: `/${workspaceSlug}/datasets`,
      isActive: currentTab === "datasets",
    },
    {
      name: "members",
      url: `/${workspaceSlug}/members`,
      isActive: currentTab === "members",
    },
    {
      name: "settings",
      url: `/${workspaceSlug}/settings`,
      isActive: currentTab === "settings",
    },
  ];

  return <TabBar tabs={tabs} />;
};
