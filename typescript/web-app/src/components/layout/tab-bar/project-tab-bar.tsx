import { TabBar } from "./tab-bar";

export type Props = {
  currentTab: "images" | "classes";
  projectId: string;
};

export const ProjectTabBar = ({ currentTab, projectId }: Props) => {
  const tabs = [
    {
      name: "images",
      url: `/projects/${projectId}/images`,
      isActive: currentTab === "images",
    },
    {
      name: "classes",
      url: `/projects/${projectId}/classes`,
      isActive: currentTab === "classes",
    },
  ];

  return <TabBar tabs={tabs} />;
};
