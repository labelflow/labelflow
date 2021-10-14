import { gql, useQuery } from "@apollo/client";
import { Workspace } from "@labelflow/graphql-types";
import { useRouter } from "next/router";
import { useState, useCallback, useMemo } from "react";
import { startCase } from "lodash/fp";

import { WorkspaceMenu } from "./workspace-menu";
import { WorkspaceItem } from "./workspace-menu/workspace-selection-popover";
import { WorkspaceCreationModal } from "./workspace-creation-modal";

const getWorkspacesQuery = gql`
  query getWorkspaces {
    workspaces {
      id
      name
      slug
    }
  }
`;

export const WorkspaceSwitcher = () => {
  const router = useRouter();
  const workspaceSlug = router?.query.workspaceSlug as string;

  const [isOpen, setIsOpen] = useState(false);

  const { data: getWorkspacesData, previousData: getWorkspacesPreviousData } =
    useQuery(getWorkspacesQuery);

  const workspaces: (Workspace & { src?: string })[] = [
    { id: "local", slug: "local", name: "Local", src: null },
    ...(getWorkspacesData?.workspaces ??
      getWorkspacesPreviousData?.workspaces ??
      []),
  ];

  const selectedWorkspace = useMemo(() => {
    if (workspaceSlug == null) {
      return null;
    }
    if (workspaces == null) {
      return {
        id: "local",
        slug: workspaceSlug,
        name: startCase(workspaceSlug),
        src: null,
      };
    }
    return workspaces.find(({ slug }) => slug === workspaceSlug);
  }, [workspaceSlug, workspaces]);

  const setSelectedWorkspace = useCallback((workspace: WorkspaceItem) => {
    const slug = workspace?.slug;
    if (slug !== null) {
      router.push(`/${slug}`);
    }
  }, []);

  const [isCreationModalOpen, setIsCreationModalOpen] = useState(false);
  const [initialWorkspaceName, setInitialWorkspaceName] =
    useState<string | undefined>();

  const createNewWorkspace = useCallback(async (name: string) => {
    setInitialWorkspaceName(name);
    setIsCreationModalOpen(true);
  }, []);

  if (workspaces == null) {
    return null;
  }

  return (
    <>
      <WorkspaceMenu
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        workspaces={workspaces}
        onSelectedWorkspaceChange={(workspace: WorkspaceItem) =>
          setSelectedWorkspace(workspace)
        }
        createNewWorkspace={createNewWorkspace}
        selectedWorkspace={selectedWorkspace == null ? null : selectedWorkspace}
      />
      <WorkspaceCreationModal
        initialWorkspaceName={initialWorkspaceName}
        isOpen={isCreationModalOpen}
        onClose={() => setIsCreationModalOpen(false)}
      />
    </>
  );
};
