import { TabBar } from "./tab-bar";

export type Props = {
  currentTab: "images" | "classes";
  datasetId: string;
};

export const DatasetTabBar = ({ currentTab, datasetId }: Props) => {
  const tabs = [
    {
      name: "images",
      url: `/local/datasets/${datasetId}/images`,
      isActive: currentTab === "images",
    },
    {
      name: "classes",
      url: `/local/datasets/${datasetId}/classes`,
      isActive: currentTab === "classes",
    },
  ];

  return <TabBar tabs={tabs} />;
};
