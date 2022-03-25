import { Prisma } from "@prisma/client";
import { isEmpty, isNil } from "lodash/fp";

type ObjectWithoutNulls<T> = {
  [key in keyof T]: Exclude<T[key], null>;
};

export function castObjectNullsToUndefined<T>(
  item: T | undefined | null
): ObjectWithoutNulls<T>;
export function castObjectNullsToUndefined(item: undefined | null): undefined;

export function castObjectNullsToUndefined<T>(
  item: T | undefined | null
): ObjectWithoutNulls<T> | undefined {
  if (item) {
    return Object.fromEntries(
      Object.entries(item as Object).map(([key, value]) => [
        key,
        value === null ? undefined : value,
      ])
    ) as ObjectWithoutNulls<T>;
  }
  return undefined;
}

export type WhereInInput<TKey extends string = "id"> = Record<
  TKey,
  { in: string[] }
>;

export const sanitizeWhereIn = <
  TKey extends string = "id",
  TWhereInput extends WhereInInput<TKey> = WhereInInput<TKey>
>(
  key: TKey,
  value: TWhereInput[TKey] | null | undefined
): TWhereInput | undefined => {
  if (isNil(value)) return undefined;
  // Make sure that no item is null or empty to satisfy Prisma constraints and
  // avoid matching every values instead of none.
  const filtered = value.in.filter((item) => !isEmpty(item)) as string[];
  if (isEmpty(filtered)) return undefined;
  return { [key]: { in: filtered } } as TWhereInput;
};

export type GetWorkspaceFilterOptions = {
  extraWorkspaceFilter?: Prisma.WorkspaceWhereInput;
};

export type WorkspaceFilter = { workspace: Prisma.WorkspaceWhereInput };

export const getWorkspaceFilter = (
  userId: string,
  { extraWorkspaceFilter }: GetWorkspaceFilterOptions = {}
): WorkspaceFilter => {
  return {
    workspace: {
      memberships: { some: { userId } },
      deletedAt: { equals: null },
      ...extraWorkspaceFilter,
    },
  };
};

export type GetDatasetFilterOptions = GetWorkspaceFilterOptions & {
  extraDatasetFilter?: Prisma.DatasetWhereInput;
};

export type DatasetFilter = {
  dataset: Omit<Prisma.DatasetWhereInput, "workspace"> & WorkspaceFilter;
};

export const getDatasetFilter = (
  userId: string,
  datasetId: string | null | undefined,
  { extraDatasetFilter, ...workspaceOptions }: GetDatasetFilterOptions = {}
): DatasetFilter => ({
  dataset: {
    id: datasetId ?? undefined,
    ...extraDatasetFilter,
    ...getWorkspaceFilter(userId, workspaceOptions),
  },
});

export type GetImageFilterOptions = GetDatasetFilterOptions & {
  extraImageFilter?: Prisma.ImageWhereInput;
};

export type ImageFilter = {
  image: Omit<Prisma.ImageWhereInput, "dataset"> & DatasetFilter;
};

export const getImageFilter = (
  userId: string,
  datasetId: string | null | undefined,
  { extraImageFilter, ...datasetOptions }: GetImageFilterOptions = {}
): ImageFilter => ({
  image: {
    ...extraImageFilter,
    ...getDatasetFilter(userId, datasetId, datasetOptions),
  },
});
