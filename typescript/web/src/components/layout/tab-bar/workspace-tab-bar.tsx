import { TabBar } from "./tab-bar";

export type Props = {
  currentTab: "datasets" | "members";
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
  ];

  return <TabBar tabs={tabs} />;
};
