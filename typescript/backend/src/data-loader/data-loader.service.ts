import { Injectable } from "@nestjs/common";
import DataLoader from "dataloader";
import { groupBy, isNil } from "lodash";
import { uniqBy } from "lodash/fp";
import {
  FindConditions,
  FindManyOptions,
  FindOneOptions,
  In,
  IsNull,
} from "typeorm";
import {
  DatasetService,
  ImageService,
  LabelClassService,
  LabelService,
  MembershipService,
  UserService,
  WorkspaceService,
} from "../labelflow";
import { TotalCountAggregates } from "../model";
import {
  DataLoaderKey,
  DataLoaders,
  Entity,
  IdKey,
  PaginatedDataLoaderKey,
  parseDataLoaderKeys,
} from "./data-loaders";

type EntityService<
  TEntity extends Entity<TEntity, TIdKey>,
  TIdKey extends IdKey<TEntity, TIdKey>
> = {
  findAll: (options?: FindManyOptions<TEntity>) => Promise<TEntity[]>;
  count: (options?: FindManyOptions<TEntity>) => Promise<number>;
};

type FindAllOptionsBase<
  TEntity extends Entity<TEntity, TIdKey>,
  TIdKey extends IdKey<TEntity, TIdKey>
> = {
  ownerIdKey: string | number | symbol;
  where?: FindConditions<TEntity>;
  relations?: string[];
  order?: FindOneOptions<TEntity>["order"];
};

type FindAllOptionsFn<
  TEntity extends Entity<TEntity, TIdKey>,
  TIdKey extends IdKey<TEntity, TIdKey>
> = (ids: string[]) => FindAllOptionsBase<TEntity, TIdKey>;

type FindAllOptions<
  TEntity extends Entity<TEntity, TIdKey>,
  TIdKey extends IdKey<TEntity, TIdKey>
> = TIdKey | FindAllOptionsFn<TEntity, TIdKey>;

const parseFindAllOptions = <
  TEntity extends Entity<TEntity, TIdKey>,
  TIdKey extends IdKey<TEntity, TIdKey>
>(
  fnOrIdKey: FindAllOptions<TEntity, TIdKey>,
  ids: string[]
): FindAllOptionsBase<TEntity, TIdKey> =>
  typeof fnOrIdKey === "function"
    ? fnOrIdKey(ids)
    : {
        where: { [fnOrIdKey]: In(ids) } as FindConditions<TEntity>,
        ownerIdKey: fnOrIdKey,
      };

type LoaderOptions<
  TEntity extends Entity<TEntity, TIdKey>,
  TIdKey extends IdKey<TEntity, TIdKey>
> = {
  service: EntityService<TEntity, TIdKey>;
  findAllOptions: FindAllOptions<TEntity, TIdKey>;
};

type BatchLoadFnOptions<
  TEntity extends Entity<TEntity, TIdKey>,
  TIdKey extends IdKey<TEntity, TIdKey>
> = Pick<LoaderOptions<TEntity, TIdKey>, "service"> & {
  findAllOptions: FindAllOptions<TEntity, TIdKey>;
  ids: readonly PaginatedDataLoaderKey[];
};

type BatchLoadFn<
  TEntity extends Entity<TEntity, TIdKey>,
  TIdKey extends IdKey<TEntity, TIdKey>,
  TResult
> = (options: BatchLoadFnOptions<TEntity, TIdKey>) => Promise<TResult[]>;

type CreateLoaderOptions<
  TEntity extends Entity<TEntity, TIdKey>,
  TIdKey extends IdKey<TEntity, TIdKey>,
  TResult
> = LoaderOptions<TEntity, TIdKey> & {
  batchLoadFn: BatchLoadFn<TEntity, TIdKey, TResult>;
};

const createLoader = <
  TEntity extends Entity<TEntity, TIdKey>,
  TIdKey extends IdKey<TEntity, TIdKey>,
  TResult
>({
  service,
  batchLoadFn,
  findAllOptions,
}: CreateLoaderOptions<TEntity, TIdKey, TResult>) => {
  return new DataLoader((ids: readonly DataLoaderKey[]) => {
    const parsed = parseDataLoaderKeys(ids);
    return batchLoadFn({ service, findAllOptions, ids: parsed });
  });
};

type GetFindManyOptions<
  TEntity extends Entity<TEntity, TIdKey>,
  TIdKey extends IdKey<TEntity, TIdKey>
> = Pick<BatchLoadFnOptions<TEntity, TIdKey>, "ids" | "findAllOptions">;

const getFindManyOptions = <
  TEntity extends Entity<TEntity, TIdKey>,
  TIdKey extends IdKey<TEntity, TIdKey>
>({
  ids,
  findAllOptions,
}: GetFindManyOptions<TEntity, TIdKey>): FindManyOptions<TEntity> &
  Pick<FindAllOptionsBase<TEntity, TIdKey>, "ownerIdKey"> => {
  // For now, we apply the pagination on the whole set of IDS but we should
  // ideally do it per-item since the same entity can be asked at multiple levels
  // Use SQL join to skip/
  // Maybe this can kelp https://stackoverflow.com/a/68194248
  const { first, skip } = ids[0];
  const parsedIds = ids.map(({ id }) => id);
  const opts = parseFindAllOptions<TEntity, TIdKey>(findAllOptions, parsedIds);
  return { ...opts, withDeleted: false, take: first, skip };
};

type FindAllBatchFnOptions<
  TEntity extends Entity<TEntity, TIdKey>,
  TIdKey extends IdKey<TEntity, TIdKey>,
  TResult
> = BatchLoadFnOptions<TEntity, TIdKey> & {
  transform: (entities: TEntity[]) => TResult;
};

const findAllBatchFn = async <
  TEntity extends Entity<TEntity, TIdKey>,
  TIdKey extends IdKey<TEntity, TIdKey>,
  TResult
>({
  service,
  ids,
  findAllOptions,
  transform,
}: FindAllBatchFnOptions<TEntity, TIdKey, TResult>): Promise<TResult[]> => {
  if (ids.length === 0) return [];
  const { ownerIdKey, ...options } = getFindManyOptions({
    ids,
    findAllOptions,
  });
  const data = await service.findAll(options);
  const grouped = groupBy(data, ownerIdKey);
  return ids.map(({ id }) =>
    transform((grouped[id] ?? []).filter((value) => !isNil(value)))
  );
};

const manyToOne = <
  TIdKey extends IdKey<TEntity, TIdKey>,
  TEntity extends Entity<TEntity, TIdKey>
>(
  service: EntityService<TEntity, TIdKey>,
  findAllOptions: FindAllOptions<TEntity, TIdKey>
) =>
  createLoader({
    service,
    findAllOptions,
    batchLoadFn: (opts) =>
      findAllBatchFn({ ...opts, transform: (entities) => entities }),
  });

const byId = <
  TIdKey extends IdKey<TEntity, TIdKey>,
  TEntity extends Entity<TEntity, TIdKey>
>(
  service: EntityService<TEntity, TIdKey>,
  findAllOptions: FindAllOptions<TEntity, TIdKey>
) =>
  createLoader<TEntity, TIdKey, TEntity>({
    service,
    findAllOptions,
    batchLoadFn: (opts) =>
      findAllBatchFn({ ...opts, transform: (entities) => entities[0] }),
  });

type CountBatchFnOptions<
  TEntity extends Entity<TEntity, TIdKey>,
  TIdKey extends IdKey<TEntity, TIdKey>
> = BatchLoadFnOptions<TEntity, TIdKey>;

const countBatchFn = async <
  TEntity extends Entity<TEntity, TIdKey>,
  TIdKey extends IdKey<TEntity, TIdKey>
>({
  ids,
  ...opts
}: CountBatchFnOptions<TEntity, TIdKey>) => {
  const { service } = opts;
  if (ids.length === 0) return [];
  const fullIds = parseDataLoaderKeys(ids);
  const groupedIds = uniqBy("id", fullIds);
  const data = await Promise.all(
    groupedIds.map(async ({ id }) => {
      const { ownerIdKey, ...findManyOptions } = getFindManyOptions({
        ids: [{ id }],
        ...opts,
      });
      const result = await service.count(findManyOptions);
      return { id, count: result };
    })
  );
  const grouped = groupBy(data, "id");
  return fullIds.map(({ id }) => ({
    totalCount: grouped[id][0].count,
  }));
};

const count = <
  TIdKey extends IdKey<TEntity, TIdKey>,
  TEntity extends Entity<TEntity, TIdKey>
>(
  service: EntityService<TEntity, TIdKey>,
  findAllOptions: FindAllOptions<TEntity, TIdKey>
) =>
  createLoader<TEntity, TIdKey, TotalCountAggregates>({
    service,
    findAllOptions,
    batchLoadFn: countBatchFn,
  });

@Injectable()
export class DataLoaderService {
  constructor(
    private readonly datasets: DatasetService,
    private readonly images: ImageService,
    private readonly labelClasses: LabelClassService,
    private readonly labels: LabelService,
    private readonly memberships: MembershipService,
    private readonly users: UserService,
    private readonly workspaces: WorkspaceService
  ) {}

  createLoaders(): DataLoaders {
    return {
      datasetId: byId(this.datasets, "id"),
      datasetWorkspaceSlug: manyToOne(this.datasets, "workspaceSlug"),
      imageDatasetId: manyToOne(this.images, "datasetId"),
      imagesDatasetIdCount: count(this.images, "datasetId"),
      labelClassDatasetId: manyToOne(
        this.labelClasses,
        (datasetId: string[]) => ({
          ownerIdKey: "datasetId",
          where: { datasetId: In(datasetId) },
          order: { index: "ASC" },
        })
      ),
      labelClassId: byId(this.labelClasses, "id"),
      labelClassesDatasetIdCount: count(this.labelClasses, "datasetId"),
      labelImageId: manyToOne(this.labels, "imageId"),
      labelLabelClassId: manyToOne(this.labels, "labelClassId"),
      labelsDatasetIdCount: count(this.labels, (datasetId: string[]) => ({
        ownerIdKey: "datasetId",
        where: { image: { datasetId: In(datasetId) } },
        relations: ["image"],
      })),
      labelsLabelClassIdCount: count(this.labels, "labelClassId"),
      membershipUserId: manyToOne(this.memberships, (ids: string[]) => ({
        ownerIdKey: "userId",
        where: { userId: In(ids), workspace: { deletedAt: IsNull() } },
        relations: ["workspace"],
      })),
      membershipWorkspaceSlug: manyToOne(this.memberships, "workspaceSlug"),
      userId: byId(this.users, "id"),
      workspaceSlug: byId(this.workspaces, (slugs: string[]) => ({
        ownerIdKey: "slug",
        where: { slug: In(slugs), deletedAt: IsNull() },
      })),
    };
  }
}
