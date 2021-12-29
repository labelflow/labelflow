import { TabBar } from "./tab-bar";

export type Props = {
  currentTab: "datasets" | "members" | "settings" | "graphiql";
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
    {
      name: "GraphiQL",
      url: `/${workspaceSlug}/graphiql`,
      isActive: currentTab === "graphiql",
    },
  ];

  return <TabBar tabs={tabs} />;
};
