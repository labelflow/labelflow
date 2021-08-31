import type {
  Scalars,
  Example as GeneratedExample,
  Image as GeneratedImage,
  Label as GeneratedLabel,
  LabelClass as GeneratedLabelClass,
  Dataset as GeneratedDataset,
  ImageWhereInput,
  LabelClassWhereInput,
  LabelWhereInput,
  UploadTargetHttp,
  UploadTarget,
} from "@labelflow/graphql-types";

export type DbImage = Omit<GeneratedImage, "labels">;

export type DbLabel = Omit<GeneratedLabel, "labelClass"> & {
  labelClassId: Scalars["ID"] | undefined | null;
};

export type DbLabelClass = Omit<GeneratedLabelClass, "labels">;

export type DbExample = GeneratedExample;

export type DbDataset = Omit<
  GeneratedDataset,
  | "images"
  | "imagesAggregates"
  | "labels"
  | "labelsAggregates"
  | "labelClasses"
  | "labelClassesAggregates"
>;

type PartialWithNullAllowed<T> = { [P in keyof T]?: T[P] | undefined | null };

type ID = string;

type Add<EntityType> = (entity: EntityType) => Promise<ID>;
type Count<Where> = (where?: Where) => Promise<number>;
type Delete = (id: ID) => Promise<void>;
type GetById<EntityType> = (id: ID) => Promise<EntityType | undefined | null>;
type GetByName<EntityType> = (
  name: string
) => Promise<EntityType | undefined | null>;
type GetBySlug<EntityType> = (
  slug: string
) => Promise<EntityType | undefined | null>;
type List<Entity = unknown, Where extends Record<string, any> | null = null> = (
  where?: Where | null,
  skip?: number | null,
  first?: number | null
) => Promise<Entity[]>;
type Update<Entity> = (
  id: ID,
  data: PartialWithNullAllowed<Entity>
) => Promise<boolean>;

export type Repository = {
  image: {
    add: Add<DbImage>;
    count: Count<ImageWhereInput>;
    getById: GetById<DbImage>;
    list: List<DbImage, ImageWhereInput>;
  };
  label: {
    add: Add<DbLabel>;
    count: Count<LabelWhereInput>;
    delete: Delete;
    getById: GetById<DbLabel>;
    list: List<DbLabel, LabelWhereInput>;
    update: Update<DbLabel>;
  };
  labelClass: {
    add: Add<DbLabelClass>;
    count: Count<LabelClassWhereInput>;
    delete: Delete;
    getById: GetById<DbLabelClass>;
    list: List<DbLabelClass, LabelClassWhereInput>;
    update: Update<DbLabelClass>;
  };
  dataset: {
    add: Add<DbDataset>;
    delete: Delete;
    getById: GetById<DbDataset>;
    getByName: GetByName<DbDataset>;
    getBySlug: GetBySlug<DbDataset>;
    list: List<DbDataset, null>;
    update: Update<DbDataset>;
  };
  upload: {
    getUploadTargetHttp: (
      key: string
    ) => Promise<UploadTargetHttp> | UploadTargetHttp;
    getUploadTarget: (key: string) => Promise<UploadTarget> | UploadTarget;
    put: (url: string, file: Blob) => Promise<void>;
    get: (url: string) => Promise<ArrayBuffer>;
    delete: (url: string) => Promise<void>;
  };
};

export type Context = { repository: Repository };
