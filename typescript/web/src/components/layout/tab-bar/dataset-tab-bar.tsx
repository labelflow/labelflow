import { TabBar } from "./tab-bar";

export type Props = {
  currentTab: "images" | "classes";
  datasetSlug: string;
};

export const DatasetTabBar = ({ currentTab, datasetSlug }: Props) => {
  const tabs = [
    {
      name: "images",
      url: `/local/datasets/${datasetSlug}/images`,
      isActive: currentTab === "images",
    },
    {
      name: "classes",
      url: `/local/datasets/${datasetSlug}/classes`,
      isActive: currentTab === "classes",
    },
  ];

  return <TabBar tabs={tabs} />;
};
