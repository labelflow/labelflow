import { Prisma } from "@prisma/client";

import {
  MutationUpdateUserArgs,
  QueryUserArgs,
  QueryUsersArgs,
} from "@labelflow/graphql-types";

import { prisma } from "../repository";

const users = async (_: any, args: QueryUsersArgs) => {
  return await prisma.user.findMany({
    skip: args.skip ?? undefined,
    take: args.first ?? undefined,
    orderBy: { createdAt: Prisma.SortOrder.asc },
  });
};

const user = async (_: any, args: QueryUserArgs) => {
  const userFromDb = await prisma.user.findUnique({
    where: args.where,
  });

  if (userFromDb == null) {
    throw new Error(`Couldn't find an user with id: "${args.where.id}"`);
  }

  return userFromDb;
};

const updateUser = async (_: any, args: MutationUpdateUserArgs) => {
  return await prisma.user.update({
    where: args.where,
    data: { ...args.data, name: args.data.name ?? undefined },
  });
};

const memberships = async (parent: User) => {
  return await prisma.membership.findMany({
    where: { userId: parent.id },
    orderBy: { createdAt: Prisma.SortOrder.asc },
  });
};

export default {
  Query: { users, user },
  Mutation: { updateUser },
  User: { memberships },
};
