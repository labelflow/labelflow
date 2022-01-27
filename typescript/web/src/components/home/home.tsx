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
import { Query, Workspace } from "@labelflow/graphql-types";
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

type GqlWorkspace = Pick<Workspace, "id" | "name" | "slug">;

const WorkspaceItem = ({ workspace }: { workspace: GqlWorkspace }) => (
  <ListItem>
    <Link href={`/${workspace.slug}`}>{workspace.name}</Link>
  </ListItem>
);

const Workspaces = ({ workspaces }: { workspaces: GqlWorkspace[] }) => (
  <UnorderedList>
    {workspaces.map((workspace) => (
      <WorkspaceItem key={workspace.id} workspace={workspace} />
    ))}
  </UnorderedList>
);

export const Home = () => {
  const { data, loading } = useQuery<Pick<Query, "workspaces">>(
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
