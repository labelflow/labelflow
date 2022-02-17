import DataLoader from "dataloader";
import {
  Dataset,
  Image,
  Label,
  LabelClass,
  Membership,
  TotalCountAggregates,
  User,
  Workspace,
} from "../model";

export type DataLoaderPagination = {
  first?: number;
  skip?: number;
};

export type PaginatedDataLoaderKey = DataLoaderPagination & {
  id: string;
};

export type DataLoaderKey = string | PaginatedDataLoaderKey;

export type IdKey<
  TEntity extends Entity<TEntity, TIdKey>,
  TIdKey extends IdKey<TEntity, TIdKey>
> = keyof TEntity | "id";

export type Entity<
  TEntity extends Entity<TEntity, TIdKey>,
  TIdKey extends IdKey<TEntity, TIdKey>
> = {
  [ownerIdKey in TIdKey]?: string;
};

export const parseDataLoaderKeys = <
  TEntity extends Entity<TEntity, TIdKey>,
  TIdKey extends IdKey<TEntity, TIdKey>
>(
  ids: readonly DataLoaderKey[]
): PaginatedDataLoaderKey[] =>
  ids.map((id) => (typeof id === "string" ? { id } : id));

export type ManyToOneDataLoader<TEntity> = DataLoader<DataLoaderKey, TEntity[]>;

export type ByIdDataLoader<TEntity> = DataLoader<DataLoaderKey, TEntity>;

export type CountDataLoader = DataLoader<DataLoaderKey, TotalCountAggregates>;

export type DataLoaders = {
  datasetWorkspaceSlug: ManyToOneDataLoader<Dataset>;
  imageDatasetId: ManyToOneDataLoader<Image>;
  imagesDatasetIdCount: CountDataLoader;
  labelClassDatasetId: ManyToOneDataLoader<LabelClass>;
  labelClassId: ByIdDataLoader<LabelClass>;
  labelClassesDatasetIdCount: CountDataLoader;
  labelImageId: ManyToOneDataLoader<Label>;
  labelLabelClassId: ManyToOneDataLoader<Label>;
  labelsDatasetIdCount: CountDataLoader;
  labelsLabelClassIdCount: CountDataLoader;
  membershipUserId: ManyToOneDataLoader<Membership>;
  membershipWorkspaceSlug: ManyToOneDataLoader<Membership>;
  userId: ByIdDataLoader<User>;
  workspaceSlug: ByIdDataLoader<Workspace>;
};
