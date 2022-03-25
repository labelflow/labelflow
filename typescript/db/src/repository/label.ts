import { DbLabel, Repository } from "@labelflow/common-resolvers";
import { LabelWhereInput } from "@labelflow/graphql-types";
import { Prisma } from "@prisma/client";
import { isEmpty, isNil } from "lodash/fp";
import { getPrismaClient } from "../prisma-client";
import { AuthorizationError } from "./authorization-error";
import {
  castObjectNullsToUndefined,
  getImageFilter,
  sanitizeWhereIn,
} from "./utils";

type WhereWithUser =
  | (LabelWhereInput & { user?: { id: string } })
  | undefined
  | null;

const sanitizeWhereInput = (
  whereWithUser: WhereWithUser
): Prisma.LabelWhereInput | undefined => {
  if (isNil(whereWithUser)) return undefined;
  const { user, id, datasetId, ...where } = whereWithUser;
  if (isNil(user) || isEmpty(user?.id)) return undefined;
  return castObjectNullsToUndefined({
    ...where,
    ...sanitizeWhereIn("id", id),
    ...getImageFilter(user.id, datasetId),
  });
};

export const countLabels: Repository["label"]["count"] = async (
  whereWithUser
) => {
  const where = sanitizeWhereInput(whereWithUser);
  if (isNil(where)) return 0;
  const db = await getPrismaClient();
  return await db.label.count({ where });
};

export const listLabels: Repository["label"]["list"] = async (
  whereWithUser,
  skip = undefined,
  first = undefined
) => {
  const where = sanitizeWhereInput(whereWithUser);
  if (isNil(where)) return [];
  const db = await getPrismaClient();
  return db.label.findMany(
    castObjectNullsToUndefined({
      where,
      orderBy: { createdAt: Prisma.SortOrder.asc },
      skip,
      take: first,
    })
    // ts(2322) - Types of property 'geometry' are incompatible.
    //   Type 'JsonValue' is not assignable to type 'Geometry'.
    //     Type 'null' is not assignable to type 'Geometry'.
  ) as unknown as DbLabel[];
};

export const deleteManyLabels: Repository["label"]["deleteMany"] = async (
  whereInput,
  user
) => {
  const db = await getPrismaClient();
  const where = sanitizeWhereInput({ ...whereInput, user });
  if (isNil(where)) {
    throw new AuthorizationError("deleteManyLabels");
  }
  const { count } = await db.label.deleteMany({ where });
  return count;
};
