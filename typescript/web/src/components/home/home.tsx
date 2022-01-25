import { gql, useQuery } from "@apollo/client";
import { Box, Button, Heading, HStack, useBoolean } from "@chakra-ui/react";
import { Query } from "@labelflow/graphql-types";
import { isEmpty } from "lodash/fp";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useCookies } from "react-cookie";
import { LayoutSpinner } from "../spinner";
import { CreateWorkspaceModal } from "../workspace-switcher/create-workspace-modal";
import { Workspaces } from "../workspaces";

export const GET_HOME_WORKSPACES_QUERY = gql`
  query getHomeWorkspaces {
    workspaces {
      id
      name
      slug
    }
  }
`;

const WorkspaceRedirection = ({ slug }: { slug: string }) => {
  const router = useRouter();
  const [{ lastUserId }, setLastUserId, removeLastVisitedWorkspaceSlug] =
    useCookies(["lastUserId", "lastVisitedWorkspaceSlug"]);
  const { data: session } = useSession();
  const userId = session?.user?.id;
  if (lastUserId === userId) {
    router.replace({ pathname: `/${slug}/datasets` });
  } else {
    // If the user has changed, we remove the last visited workspace
    // slug from the cookies as it does not belong to the current user
    removeLastVisitedWorkspaceSlug("lastVisitedWorkspaceSlug", {
      path: "/",
      httpOnly: false,
    });
    // And we update the user id cookie for further use
    setLastUserId("lastUserId", userId, {
      path: "/",
      httpOnly: false,
    });
  }
  return <></>;
};

export const Home = () => {
  const { data, loading } = useQuery<Pick<Query, "workspaces">>(
    GET_HOME_WORKSPACES_QUERY,
    { fetchPolicy: "cache-and-network" }
  );
  const [
    showCreateWorkspaceModal,
    { on: openCreateWorkspaceModal, off: closeCreateWorkspaceModal },
  ] = useBoolean(false);

  const [{ lastVisitedWorkspaceSlug }] = useCookies([
    "lastVisitedWorkspaceSlug",
  ]);
  return loading ? (
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
      {!isEmpty(lastVisitedWorkspaceSlug) ? (
        <WorkspaceRedirection slug={lastVisitedWorkspaceSlug} />
      ) : (
        <Workspaces workspaces={data?.workspaces ?? []} />
      )}
      <CreateWorkspaceModal
        isOpen={showCreateWorkspaceModal}
        onClose={closeCreateWorkspaceModal}
      />
    </Box>
  );
};
