import { DbLabel } from "@labelflow/common-resolvers";
import type { LabelWhereInput } from "@labelflow/graphql-types";
import { getDatabase } from "../database";
import { list } from "./utils/list";

/* `count` and `list` need to handle a specific logic when you want it to be filtered by dataset
 * We can't do joins with dexies so we need to do it manually. */

export const countLabels = async (
  whereWithUser?: LabelWhereInput & { user?: { id: string } }
) => {
  const { user, ...wherePossiblyEmpty } = whereWithUser ?? {};
  const where =
    Object.keys(wherePossiblyEmpty).length < 1 ? null : wherePossiblyEmpty;
  if (where) {
    if ("datasetId" in where) {
      const imagesOfDataset = await (
        await getDatabase()
      ).image
        .where({
          datasetId: where.datasetId,
        })
        .toArray();

      return await (await getDatabase()).label
        .filter((currentLabel) =>
          imagesOfDataset.some((image) => currentLabel.imageId === image.id)
        )
        .count();
    }

    return await (await getDatabase()).label.where(where).count();
  }

  return await (await getDatabase()).label.count();
};

export const listLabels = async (
  whereWithUser?: (LabelWhereInput & { user?: { id: string } }) | null,
  skip?: number | null,
  first?: number | null
) => {
  const { user, ...wherePossiblyEmpty } = whereWithUser ?? {};
  const where =
    Object.keys(wherePossiblyEmpty).length < 1 ? null : wherePossiblyEmpty;
  if (where && "datasetId" in where) {
    const imagesOfDataset = await (
      await getDatabase()
    ).image
      .where({
        datasetId: where.datasetId,
      })
      .toArray();

    return await (await getDatabase()).label
      .filter((currentLabel) =>
        imagesOfDataset.some((image) => currentLabel.imageId === image.id)
      )
      .sortBy("createdAt");
  }

  return await list<DbLabel, LabelWhereInput>(
    async () => (await getDatabase()).label
  )(where, skip, first);
};
