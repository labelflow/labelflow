import {
  WorkspaceWhereUniqueInput,
  DatasetWhereUniqueInput,
  LabelWhereUniqueInput,
  ImageWhereUniqueInput,
  LabelClassWhereUniqueInput,
  MembershipWhereUniqueInput,
  UserWhereUniqueInput,
} from "@labelflow/graphql-types";
import { getPrismaClient } from "../prisma-client";

export const checkUserAccessToWorkspace = async ({
  where,
  user,
}: {
  where?: WorkspaceWhereUniqueInput;
  user?: { id: string };
}): Promise<boolean> => {
  if (user?.id == null) {
    throw new Error("User not authenticated");
  }
  const membership = await (
    await getPrismaClient()
  ).membership.findFirst({
    where: {
      userId: user.id,
      workspace: { id: where?.id ?? undefined, slug: where?.slug ?? undefined },
    },
  });
  if (membership == null) {
    throw new Error("User not authorized to access workspace");
  }
  return membership != null;
};

export const checkUserAccessToDataset = async ({
  where,
  user,
}: {
  where: DatasetWhereUniqueInput;
  user?: { id: string };
}): Promise<boolean> => {
  if (user?.id == null) {
    throw new Error("User not authenticated");
  }
  const datasetCondition =
    where.id != null ? { id: where.id } : { slug: where.slugs?.slug };
  const hasAccessToDataset =
    (await (
      await getPrismaClient()
    ).membership.findFirst({
      where: {
        userId: user?.id,
        workspace: { datasets: { some: datasetCondition } },
      },
    })) != null;
  if (!hasAccessToDataset) {
    throw new Error("User not authorized to access dataset");
  }
  return hasAccessToDataset;
};

export const checkUserAccessToLabel = async ({
  where,
  user,
}: {
  where: LabelWhereUniqueInput;
  user?: { id: string };
}): Promise<boolean> => {
  if (user?.id == null) {
    throw new Error("User not authenticated");
  }
  const hasAccessToLabel =
    (await (
      await getPrismaClient()
    ).membership.findFirst({
      where: {
        userId: user?.id,
        workspace: {
          datasets: {
            some: { images: { some: { labels: { some: { id: where.id } } } } },
          },
        },
      },
    })) != null;
  if (!hasAccessToLabel) {
    throw new Error("User not authorized to access label");
  }
  return hasAccessToLabel;
};

export const checkUserAccessToImage = async ({
  where,
  user,
}: {
  where: ImageWhereUniqueInput;
  user?: { id: string };
}): Promise<boolean> => {
  if (user?.id == null) {
    throw new Error("User not authenticated");
  }
  const hasAccessToImage =
    (await (
      await getPrismaClient()
    ).membership.findFirst({
      where: {
        userId: user?.id,
        workspace: {
          datasets: {
            some: { images: { some: { id: where.id } } },
          },
        },
      },
    })) != null;
  if (!hasAccessToImage) {
    throw new Error("User not authorized to access image");
  }
  return hasAccessToImage;
};

export const checkUserAccessToLabelClass = async ({
  where,
  user,
}: {
  where: LabelClassWhereUniqueInput;
  user?: { id: string };
}): Promise<boolean> => {
  if (user?.id == null) {
    throw new Error("User not authenticated");
  }
  const hasAccessToLabelClass =
    (await (
      await getPrismaClient()
    ).membership.findFirst({
      where: {
        userId: user?.id,
        workspace: {
          datasets: {
            some: { labelClasses: { some: { id: where.id } } },
          },
        },
      },
    })) != null;
  if (!hasAccessToLabelClass) {
    throw new Error("User not authorized to access label class");
  }
  return hasAccessToLabelClass;
};

export const checkUserAccessToMembership = async ({
  where,
  user,
}: {
  where: MembershipWhereUniqueInput;
  user?: { id: string };
}): Promise<boolean> => {
  if (user?.id == null) {
    throw new Error("User not authenticated");
  }
  // Has access to membership if the user belongs to a workspace that is linked to the membership
  const hasAccessToMembership =
    (await (
      await getPrismaClient()
    ).workspace.findFirst({
      where: {
        AND: [
          { memberships: { some: { id: where.id } } },
          { memberships: { some: { userId: user.id } } },
        ],
      },
    })) != null;
  if (!hasAccessToMembership) {
    throw new Error("User not authorized to access membership");
  }
  return hasAccessToMembership;
};

export const checkUserAccessToUser = async ({
  where,
  user,
}: {
  where: UserWhereUniqueInput;
  user?: { id: string };
}): Promise<boolean> => {
  if (user?.id == null) {
    throw new Error("User not authenticated");
  }
  // Has access to user if the current user shares a workspace with the user in the query
  const hasAccessToUser =
    where.id === user.id ||
    (await (
      await getPrismaClient()
    ).workspace.findFirst({
      where: {
        AND: [
          { memberships: { some: { userId: where.id } } },
          { memberships: { some: { userId: user.id } } },
        ],
      },
    })) != null;
  if (!hasAccessToUser) {
    throw new Error("User not authorized to access user");
  }
  return hasAccessToUser;
};
