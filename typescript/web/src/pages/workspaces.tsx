import { gql, useQuery } from "@apollo/client";
import { Box, Button, Heading, HStack, useBoolean } from "@chakra-ui/react";
import { Query } from "@labelflow/graphql-types";
import { Authenticated } from "../components/auth/authenticated";
import { CookieBanner } from "../components/cookie-banner/cookie-banner";
import { Layout } from "../components/layout/layout";
import { NavLogo } from "../components/logo/nav-logo";
import { Meta } from "../components/meta";
import { LayoutSpinner } from "../components/spinner";
import { WelcomeModal } from "../components/welcome-manager/welcome-modal";
import { CreateWorkspaceModal } from "../components/workspace-switcher/create-workspace-modal";
import { Workspaces } from "../components/workspaces";
import { APP_TITLE } from "../constants";

export const GET_HOME_WORKSPACES_QUERY = gql`
  query getHomeWorkspaces {
    workspaces {
      id
      name
      slug
    }
  }
`;
const WorkspacesPage = () => {
  const { data, loading } = useQuery<Pick<Query, "workspaces">>(
    GET_HOME_WORKSPACES_QUERY,
    { fetchPolicy: "cache-and-network" }
  );
  const [
    showCreateWorkspaceModal,
    { on: openCreateWorkspaceModal, off: closeCreateWorkspaceModal },
  ] = useBoolean(false);

  return (
    <Authenticated>
      <WelcomeModal />
      <Meta title={APP_TITLE} />
      <CookieBanner />
      <Layout breadcrumbs={[<NavLogo key={0} />]}>
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
      </Layout>
    </Authenticated>
  );
};

export default WorkspacesPage;
