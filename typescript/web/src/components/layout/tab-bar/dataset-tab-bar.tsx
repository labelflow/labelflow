import { TabBar } from "./tab-bar";

export type Props = {
  currentTab: "images" | "classes";
  datasetSlug: string;
  workspaceSlug: string;
};

export const DatasetTabBar = ({
  currentTab,
  datasetSlug,
  workspaceSlug,
}: Props) => {
  const tabs = [
    {
      name: "images",
      url: `/${workspaceSlug}/datasets/${datasetSlug}/images`,
      isActive: currentTab === "images",
    },
    {
      name: "classes",
      url: `/${workspaceSlug}/datasets/${datasetSlug}/classes`,
      isActive: currentTab === "classes",
    },
  ];

  return <TabBar tabs={tabs} />;
};
