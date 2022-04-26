import {
  Dataset,
  Image,
  Label,
  LabelClass,
  LabelsAggregates,
} from "@labelflow/graphql-types";
import { SetRequired } from "type-fest";
import { UserWithWorkspacesQuery_user_memberships_workspace } from "../../graphql-types/UserWithWorkspacesQuery";

export type LabelClassData = Pick<
  LabelClass,
  "id" | "index" | "name" | "color"
> & {
  shortcut: string;
  dataset: DatasetData;
  labelsAggregates: LabelsAggregates;
};

export type ImageData = SetRequired<
  Pick<Image, "id" | "name" | "url" | "thumbnail200Url" | "width" | "height">,
  "thumbnail200Url"
> & {
  dataset: DatasetData;
  labels: (Omit<LabelData, "imageId" | "labelClass"> & {
    labelClass: Omit<LabelClassData, "dataset">;
  })[];
};

export type LabelData = SetRequired<
  Pick<
    Label,
    | "id"
    | "type"
    | "imageId"
    | "x"
    | "y"
    | "width"
    | "height"
    | "smartToolInput"
    | "geometry"
  >,
  "smartToolInput"
> & {
  labelClass: LabelClassData;
};

export type DatasetData = Pick<Dataset, "id" | "name" | "slug"> & {
  labelClasses: Omit<LabelClassData, "dataset">[];
  images: Omit<ImageData, "dataset">[];
  workspace: WorkspaceData;
};

export type WorkspaceData = UserWithWorkspacesQuery_user_memberships_workspace;
