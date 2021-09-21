import {
  WorkspaceWhereUniqueInput,
  DatasetWhereUniqueInput,
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
