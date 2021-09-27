import {
  WorkspaceWhereUniqueInput,
  DatasetWhereUniqueInput,
  LabelWhereUniqueInput,
  ImageWhereUniqueInput,
} from "@labelflow/graphql-types";
import { prisma } from "./prisma-client";

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
  const membership = await prisma.membership.findFirst({
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
    (await prisma.membership.findFirst({
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
    (await prisma.membership.findFirst({
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
    (await prisma.membership.findFirst({
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
