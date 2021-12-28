export type DatasetClassesQueryResult = {
  dataset: {
    id: string;
    name: string;
    labelClasses: {
      id: string;
      index: number;
      name: string;
      color: string;
    }[];
  };
};

export type LabelClassWithShortcut = {
  id: string;
  index: number;
  name: string;
  color: string;
  shortcut: string;
  labelsAggregates: {
    totalCount: number;
  };
};
