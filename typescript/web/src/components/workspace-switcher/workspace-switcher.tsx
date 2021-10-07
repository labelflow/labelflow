import { gql, useQuery } from "@apollo/client";
import { Workspace } from "@labelflow/graphql-types";
import { useRouter } from "next/router";
import { useState, useCallback, useMemo } from "react";
import { startCase } from "lodash/fp";
import { WorkspaceMenu } from "./workspace-menu";

import { WorkspaceItem } from "./workspace-menu/workspace-selection-popover";

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

  // const client = useApolloClient();

  const { data: getWorkspacesData, previousData: getWorkspacesPreviousData } =
    useQuery(getWorkspacesQuery, {
      variables: { workspaceSlug },
    });

  const workspaces: (Workspace & { src?: string })[] = [
    { id: "local", slug: "local", name: "Local", src: null },
    ...(getWorkspacesData?.workspaces ??
      getWorkspacesPreviousData?.workspaces ??
      []),
  ];

  const [isOpen, setIsOpen] = useState(false);

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
    console.log(`Switch to workspace ${workspace?.slug ?? "unknown"}`);
    if (workspace.slug !== null) {
      router.push(`/${workspace?.slug}`);
    }
  }, []);

  const createNewWorkspace = useCallback(() => {
    alert("Create workspace");
  }, []);

  if (workspaces == null) {
    return null;
  }

  if (selectedWorkspace == null) {
    return (
      <WorkspaceMenu
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        workspaces={workspaces}
        onSelectedWorkspaceChange={(workspace: WorkspaceItem) =>
          setSelectedWorkspace(workspace)
        }
        createNewWorkspace={createNewWorkspace}
        selectedWorkspace={null}
      />
    );
  }

  return (
    <WorkspaceMenu
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      workspaces={workspaces}
      onSelectedWorkspaceChange={(workspace: WorkspaceItem) =>
        setSelectedWorkspace(workspace)
      }
      createNewWorkspace={createNewWorkspace}
      selectedWorkspace={selectedWorkspace}
    />
  );
};
