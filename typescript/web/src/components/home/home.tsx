import { gql, useQuery } from "@apollo/client";
import {
  Box,
  Button,
  Heading,
  HStack,
  Link,
  ListItem,
  UnorderedList,
  useBoolean,
} from "@chakra-ui/react";
import {
  GetHomeWorkspacesQuery,
  GetHomeWorkspacesQuery_workspaces,
} from "../../graphql-types/GetHomeWorkspacesQuery";
import { LayoutSpinner } from "../spinner";
import { CreateWorkspaceModal } from "../workspace-switcher/create-workspace-modal";

export const GET_HOME_WORKSPACES_QUERY = gql`
  query GetHomeWorkspacesQuery {
    workspaces {
      id
      name
      slug
    }
  }
`;

const WorkspaceItem = ({
  workspace,
}: {
  workspace: GetHomeWorkspacesQuery_workspaces;
}) => (
  <ListItem>
    <Link href={`/${workspace.slug}`}>{workspace.name}</Link>
  </ListItem>
);

const Workspaces = ({
  workspaces,
}: {
  workspaces: GetHomeWorkspacesQuery_workspaces[];
}) => (
  <UnorderedList>
    {workspaces.map((workspace) => (
      <WorkspaceItem key={workspace.id} workspace={workspace} />
    ))}
  </UnorderedList>
);

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
        <Box
          display="flex"
          flexDirection="column"
          w="full"
          p={8}
          maxWidth="5xl"
          flexGrow={1}
        >
          <HStack>
            <Heading size="lg">Workspaces</Heading>
            <Button onClick={openCreateWorkspaceModal}>New workspace</Button>
          </HStack>
          <Workspaces workspaces={data?.workspaces ?? []} />
          <CreateWorkspaceModal
            isOpen={showCreateWorkspaceModal}
            onClose={closeCreateWorkspaceModal}
          />
        </Box>
      )}
    </>
  );
};
