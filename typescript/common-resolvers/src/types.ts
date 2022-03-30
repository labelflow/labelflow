import type {
  Scalars,
  Example as GeneratedExample,
  Image as GeneratedImage,
  Label as GeneratedLabel,
  LabelClass as GeneratedLabelClass,
  Dataset as GeneratedDataset,
  Workspace as GeneratedWorkspace,
  ImageWhereInput,
  LabelClassWhereInput,
  LabelWhereInput,
  UploadTargetHttp,
  UploadTarget,
  DatasetCreateInput,
  LabelClassCreateInput,
  ImageCreateInput,
  User,
  LabelWhereUniqueInput,
  LabelClassWhereUniqueInput,
  DatasetWhereUniqueInput,
  ImageWhereUniqueInput,
  WorkspaceCreateInput,
  WorkspaceWhereInput,
  WorkspaceWhereUniqueInput,
  WorkspaceType,
} from "@labelflow/graphql-types";
import { WorkspacePlan, WorkspaceStatus } from "@prisma/client";

type NoUndefinedField<T> = { [P in keyof T]: NonNullable<T[P]> };

export type ThumbnailSizes = 20 | 50 | 100 | 200 | 500;

export type DbImage = Omit<GeneratedImage, "labels" | "dataset">;
export type DbImageCreateInput = WithCreatedAtAndUpdatedAt<
  Required<
    NoUndefinedField<
      Omit<
        ImageCreateInput,
        | "file"
        | "externalUrl"
        | "noThumbnails"
        | "thumbnail20Url"
        | "thumbnail50Url"
        | "thumbnail100Url"
        | "thumbnail200Url"
        | "thumbnail500Url"
        | "metadata"
      >
    >
  > &
    Pick<
      ImageCreateInput,
      | "externalUrl"
      | "thumbnail20Url"
      | "thumbnail50Url"
      | "thumbnail100Url"
      | "thumbnail200Url"
      | "thumbnail500Url"
      | "metadata"
    >
>;

export type DbLabel = Omit<GeneratedLabel, "labelClass"> & {
  labelClassId: Scalars["ID"] | undefined | null;
};
export type DbLabelCreateInput = WithCreatedAtAndUpdatedAt<DbLabel>;

export type DbLabelClass = Omit<
  GeneratedLabelClass,
  "labels" | "dataset" | "labelsAggregates"
> & {
  datasetId: string;
};
export type DbLabelClassCreateInput = Required<
  NoUndefinedField<
    WithCreatedAtAndUpdatedAt<LabelClassCreateInput & { index: number }>
  >
>;

export type DbExample = GeneratedExample;

export type DbDataset = Omit<
  GeneratedDataset,
  | "images"
  | "imagesAggregates"
  | "labels"
  | "labelsAggregates"
  | "labelClasses"
  | "labelClassesAggregates"
  | "workspace"
> & { workspaceSlug: string };

export type DbWorkspace = Omit<
  GeneratedWorkspace,
  | "__typename"
  | "type"
  | "datasets"
  | "memberships"
  | "plan"
  | "stripeCustomerPortalUrl"
  | "status"
  | "imagesAggregates"
> & {
  plan: WorkspacePlan;
  stripeCustomerId?: string | undefined | null;
  status: WorkspaceStatus;
};

export type DbWorkspaceWithType = DbWorkspace & { type: WorkspaceType };

export type DbUser = Omit<User, "memberships">;

export type PartialWithNullAllowed<T> = {
  [P in keyof T]?: T[P] | undefined | null;
};

type WithCreatedAtAndUpdatedAt<T extends {}> = T & {
  createdAt: string;
  updatedAt: string;
};

type ID = string;

type Add<EntityType> = (
  entity: EntityType,
  user?: { id: string }
) => Promise<ID>;

type Count<Where> = (where?: Where) => Promise<number>;

type Delete<EntityWhereUniqueInput> = (
  input: EntityWhereUniqueInput,
  user?: { id: string }
) => Promise<void>;

type DeleteMany<EntityWhereInput> = (
  input: EntityWhereInput,
  user?: { id: string }
) => Promise<number>;

type Get<EntityType, EntityWhereUniqueInput> = (
  input: EntityWhereUniqueInput,
  user?: { id: string }
) => Promise<EntityType | undefined | null>;

type List<Entity = unknown, Where extends Record<string, any> | null = null> = (
  where?: Where | null,
  skip?: number | null,
  first?: number | null
) => Promise<Entity[]>;

type Update<Entity, EntityWhereUniqueInput> = (
  input: EntityWhereUniqueInput,
  data: PartialWithNullAllowed<Entity>,
  user?: { id: string }
) => Promise<boolean>;

export type Repository = {
  image: {
    add: Add<DbImageCreateInput>;
    addMany: (
      args: { images: DbImageCreateInput[]; datasetId: string },
      user?: { id: string }
    ) => Promise<ID[]>;
    count: Count<ImageWhereInput & { user?: { id: string } }>;
    get: Get<DbImage, ImageWhereUniqueInput>;
    list: List<DbImage, ImageWhereInput & { user?: { id: string } }>;
    delete: Delete<ImageWhereUniqueInput>;
    deleteMany: DeleteMany<ImageWhereInput>;
    update: Update<DbImage, ImageWhereUniqueInput>;
  };
  label: {
    add: Add<DbLabelCreateInput>;
    addMany: (
      args: {
        labels: Omit<DbLabelCreateInput, "imageId" | "labelClassId">[];
        imageId: string;
      },
      user?: { id: string }
    ) => Promise<ID[]>;
    count: Count<LabelWhereInput & { user?: { id: string } }>;
    delete: Delete<LabelWhereUniqueInput>;
    deleteMany: DeleteMany<LabelWhereInput>;
    get: Get<DbLabel, LabelWhereUniqueInput>;
    list: List<DbLabel, LabelWhereInput & { user?: { id: string } }>;
    update: Update<DbLabel, LabelWhereUniqueInput>;
  };
  labelClass: {
    add: Add<DbLabelClassCreateInput>;
    addMany: (
      args: { labelClasses: DbLabelClassCreateInput[] },
      user?: { id: string }
    ) => Promise<ID[]>;
    count: Count<LabelClassWhereInput & { user?: { id: string } }>;
    delete: Delete<LabelClassWhereUniqueInput>;
    get: Get<DbLabelClass, LabelClassWhereUniqueInput>;
    list: List<
      DbLabelClass,
      LabelClassWhereInput & { user?: { id: string } } & {
        id?: string | { in: string[] };
      }
    >;
    update: Update<DbLabelClass, LabelClassWhereUniqueInput>;
  };
  dataset: {
    add: Add<DatasetCreateInput>;
    delete: Delete<DatasetWhereUniqueInput>;
    get: Get<DbDataset, DatasetWhereUniqueInput>;
    list: List<DbDataset, { workspaceSlug?: string; user?: { id: string } }>;
    update: Update<DbDataset, DatasetWhereUniqueInput>;
  };
  workspace: {
    add: Add<WorkspaceCreateInput>;
    get: Get<DbWorkspaceWithType, WorkspaceWhereUniqueInput>;
    list: List<
      DbWorkspaceWithType,
      WorkspaceWhereInput & { user?: { id: string } }
    >;
    update: Update<DbWorkspaceWithType, WorkspaceWhereUniqueInput>;
    delete: Delete<WorkspaceWhereUniqueInput>;
    countImages: Get<number, WorkspaceWhereUniqueInput>;
  };
  upload: {
    getUploadTargetHttp: (
      key: string,
      origin: string
    ) => Promise<UploadTargetHttp> | UploadTargetHttp;
    getUploadTarget: (
      key: string,
      origin: string
    ) => Promise<UploadTarget> | UploadTarget;
    put: (url: string, file: Blob, req?: Request) => Promise<void>;
    get: (url: string, req?: Request) => Promise<ArrayBuffer>;
    getSignedDownloadUrl: (key: string, expiresIn: number) => Promise<string>;
    delete: (url: string) => Promise<void>;
  };
  imageProcessing: {
    processImage: (
      image: {
        id: string;
        url: string;
        width: number | null | undefined;
        height: number | null | undefined;
        mimetype: string | null | undefined;
        noThumbnails?: boolean | null | undefined;
        thumbnail20Url?: string | null | undefined;
        thumbnail50Url?: string | null | undefined;
        thumbnail100Url?: string | null | undefined;
        thumbnail200Url?: string | null | undefined;
        thumbnail500Url?: string | null | undefined;
      },
      getImage: (url: string) => Promise<ArrayBuffer>,
      putThumbnail: (targetDownloadUrl: string, blob: Blob) => Promise<void>
    ) => Promise<{
      width: number;
      height: number;
      mimetype: string;
      thumbnail20Url?: string;
      thumbnail50Url?: string;
      thumbnail100Url?: string;
      thumbnail200Url?: string;
      thumbnail500Url?: string;
    }>;
  };
};

export type Context = {
  repository: Repository;
  user?: { id: string };
  session?: any;
  req: Request;
};
