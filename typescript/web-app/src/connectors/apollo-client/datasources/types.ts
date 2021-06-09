import type {
  LabelClass,
  Label,
  Maybe,
} from "../../../graphql-types.generated";

export type LabelClassDataSource = {
  getPaginatedLabelClasses: (params?: {
    skip?: Maybe<number>;
    first?: Maybe<number>;
  }) => Promise<LabelClass[]>;

  getLabelClassById: (id: string) => Promise<LabelClass>;

  createLabelClass: (params: {
    color: string;
    name: string;
    id?: Maybe<string>;
  }) => Promise<string>;
};

export type LabelDataSource = {
  getLabelsByClassId: (id: string) => Promise<Array<Label>>;
};
