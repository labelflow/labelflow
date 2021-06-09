import type { LabelClass, Maybe } from "../../../graphql-types.generated";
// import type { DbLabelClass } from "../../database";

export type LabelClassDataSource = {
  getPaginatedLabelClasses: (params: {
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
