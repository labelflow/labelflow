import { useWorkspace } from "../../../hooks";
import { TabBar } from "./tab-bar";

export type Props = {
  currentTab: "datasets" | "members" | "settings" | "graphiql";
};

export const WorkspaceTabBar = ({ currentTab }: Props) => {
  const { slug } = useWorkspace();
  const tabs = [
    {
      name: "datasets",
      url: `/${slug}/datasets`,
      isActive: currentTab === "datasets",
    },
    {
      name: "members",
      url: `/${slug}/members`,
      isActive: currentTab === "members",
    },
    {
      name: "settings",
      url: `/${slug}/settings`,
      isActive: currentTab === "settings",
    },
    {
      name: "GraphiQL",
      url: `/${slug}/graphiql`,
      isActive: currentTab === "graphiql",
    },
  ];

  return <TabBar tabs={tabs} />;
};
