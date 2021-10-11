import { Prisma } from "@prisma/client";

import {
  MutationUpdateUserArgs,
  QueryUserArgs,
  QueryUsersArgs,
} from "@labelflow/graphql-types";
import { Context, DbUser } from "@labelflow/common-resolvers";

import { prisma } from "../repository/prisma-client";
import { checkUserAccessToUser } from "../repository/access-control";

const users = async (_: any, args: QueryUsersArgs, { user }: Context) => {
  if (user?.id == null) {
    return [];
  }
  return await prisma.user.findMany({
    skip: args.skip ?? undefined,
    take: args.first ?? undefined,
    orderBy: { createdAt: Prisma.SortOrder.asc },
    where: {
      memberships: {
        some: { workspace: { memberships: { some: { userId: user?.id } } } },
      },
    },
  });
};

const user = async (
  _: any,
  args: QueryUserArgs,
  { user: userData }: Context
) => {
  await checkUserAccessToUser({ where: args.where, user: userData });
  const userFromDb = await prisma.user.findUnique({
    where: args.where,
  });

  if (userFromDb == null) {
    throw new Error(`Couldn't find an user with id: "${args.where.id}"`);
  }

  return userFromDb;
};

const updateUser = async (
  _: any,
  args: MutationUpdateUserArgs,
  { user: userData }: Context
) => {
  if (userData?.id !== args.where.id) {
    throw new Error("User not authorized to access user");
  }
  return await prisma.user.update({
    where: args.where,
    data: { ...args.data, name: args.data.name ?? undefined },
  });
};

const memberships = async (
  parent: DbUser,
  _: any,
  { user: userData }: Context
) => {
  if (userData?.id == null) {
    return [];
  }
  return await prisma.membership.findMany({
    where: {
      userId: parent.id,
      workspace: { memberships: { some: { userId: userData?.id } } },
    },
    orderBy: { createdAt: Prisma.SortOrder.asc },
  });
};

export default {
  Query: { users, user },
  Mutation: { updateUser },
  User: { memberships },
};
