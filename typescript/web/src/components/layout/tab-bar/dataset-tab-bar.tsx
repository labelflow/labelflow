import { TabBar } from "./tab-bar";

export type Props = {
  currentTab: "images" | "classes";
  datasetSlug: string;
};

export const DatasetTabBar = ({ currentTab, datasetSlug }: Props) => {
  const tabs = [
    {
      name: "images",
      url: `/datasets/${datasetSlug}/images`,
      isActive: currentTab === "images",
    },
    {
      name: "classes",
      url: `/datasets/${datasetSlug}/classes`,
      isActive: currentTab === "classes",
    },
  ];

  return <TabBar tabs={tabs} />;
};
