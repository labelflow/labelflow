import { gql, useQuery } from "@apollo/client";
import { useBoolean } from "@chakra-ui/react";
import { GetHomeWorkspacesQuery } from "../../graphql-types/GetHomeWorkspacesQuery";
import { LayoutSpinner } from "../spinner";
import { CreateWorkspaceModal } from "../workspace-switcher/create-workspace-modal";
import { Workspaces } from "../workspaces";

export const GET_HOME_WORKSPACES_QUERY = gql`
  query GetHomeWorkspacesQuery {
    workspaces {
      id
      name
      slug
      plan
      image
    }
  }
`;

export const Home = () => {
  const { data, loading } = useQuery<GetHomeWorkspacesQuery>(
    GET_HOME_WORKSPACES_QUERY,
    { fetchPolicy: "cache-and-network" }
  );
  const [
    showCreateWorkspaceModal,
    { on: openCreateWorkspaceModal, off: closeCreateWorkspaceModal },
  ] = useBoolean(false);
  return (
    <>
      {loading ? (
        <LayoutSpinner />
      ) : (
        <>
          <Workspaces
            workspaces={data?.workspaces ?? []}
            openCreateWorkspaceModal={openCreateWorkspaceModal}
          />
          <CreateWorkspaceModal
            isOpen={showCreateWorkspaceModal}
            onClose={closeCreateWorkspaceModal}
          />
        </>
      )}
    </>
  );
};
