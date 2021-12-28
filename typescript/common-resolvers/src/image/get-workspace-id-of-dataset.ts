import { Repository } from "../types";

export async function getWorkspaceIdOfDataset({
  datasetId,
  repository,
  user,
}: {
  datasetId: string;
  repository: Repository;
  user: { id: string } | undefined;
}) {
  const workspaceSlug = (await repository.dataset.get({ id: datasetId }, user))
    ?.workspaceSlug;

  if (!workspaceSlug) {
    throw new Error(
      "Could not find workspace slug associated with the dataset"
    );
  }

  const workspaceId = (
    await repository.workspace.get(
      {
        slug: workspaceSlug,
      },
      user
    )
  )?.id;

  if (!workspaceId) {
    throw new Error("Could not find workspace id associated with the dataset");
  }
  return workspaceId;
}
