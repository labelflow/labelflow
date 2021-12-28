import {
  WorkspaceWhereUniqueInput,
  DatasetWhereUniqueInput,
  LabelWhereUniqueInput,
  ImageWhereUniqueInput,
  LabelClassWhereUniqueInput,
  MembershipWhereUniqueInput,
  UserWhereUniqueInput,
} from "@labelflow/graphql-types";
import { isNil } from "lodash/fp";
import { getPrismaClient } from "../prisma-client";
import { AuthenticationError } from "./authentication-error";
import { AuthorizationError } from "./authorization-error";

/**
 * Throws an error if user does not have access to workspace
 */
export const checkUserAccessToWorkspace = async ({
  where,
  user,
}: {
  where?: WorkspaceWhereUniqueInput;
  user?: { id: string };
}): Promise<void> => {
  if (isNil(user) || isNil(user?.id)) {
    throw new AuthenticationError();
  }
  const membership = await (
    await getPrismaClient()
  ).membership.findFirst({
    where: {
      userId: user.id,
      workspace: {
        id: where?.id ?? undefined,
        slug: where?.slug ?? undefined,
        // Prevent user from accessing deleted workspaces
        deletedAt: { equals: null },
      },
    },
  });
  if (isNil(membership)) {
    throw new AuthorizationError("workspace");
  }
};

export const checkUserAccessToDataset = async ({
  where,
  user,
}: {
  where: DatasetWhereUniqueInput;
  user?: { id: string };
}): Promise<boolean> => {
  if (user?.id == null) {
    throw new AuthenticationError();
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
    throw new AuthorizationError("dataset");
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
    throw new AuthenticationError();
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
    throw new AuthorizationError("label");
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
    throw new AuthenticationError();
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
    throw new AuthorizationError("image");
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
    throw new AuthenticationError();
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
    throw new AuthorizationError("label class");
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
    throw new AuthenticationError();
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
    throw new AuthorizationError("membership");
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
    throw new AuthenticationError();
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
    throw new AuthorizationError("user");
  }
  return hasAccessToUser;
};
