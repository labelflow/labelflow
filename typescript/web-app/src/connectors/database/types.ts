import type {
  Scalars,
  Example as GeneratedExample,
  Image as GeneratedImage,
  Label as GeneratedLabel,
  LabelClass as GeneratedLabelClass,
  Project as GeneratedProject,
} from "../../graphql-types.generated";

export type DbImage =
  | (Omit<GeneratedImage, "url" | "labels"> & {
      fileId: Scalars["ID"];
    })
  | Omit<GeneratedImage, "labels">;

export type DbLabel = Omit<GeneratedLabel, "labelClass"> & {
  labelClassId: Scalars["ID"] | undefined | null;
};

export type DbLabelClass = Omit<GeneratedLabelClass, "labels">;

export type DbExample = GeneratedExample;

export type DbProject = Omit<
  GeneratedProject,
  | "images"
  | "imagesAggregates"
  | "labels"
  | "labelsAggregates"
  | "labelClasses"
  | "labelClassesAggregates"
>;
