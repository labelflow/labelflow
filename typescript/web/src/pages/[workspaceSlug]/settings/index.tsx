import React from "react";
import { Text, Box } from "@chakra-ui/react";
import { useRouter } from "next/router";
// import { useQuery, gql, useMutation } from "@apollo/client";
import { Meta } from "../../../components/meta";
import { Layout } from "../../../components/layout";
import { ServiceWorkerManagerModal } from "../../../components/service-worker-manager";
import { AuthManager } from "../../../components/auth-manager";
import { WelcomeManager } from "../../../components/welcome-manager";
import { CookieBanner } from "../../../components/cookie-banner";
import { WorkspaceTabBar } from "../../../components/layout/tab-bar/workspace-tab-bar";
import { WorkspaceSettings } from "../../../components/settings/workspace";
import { WorkspaceSwitcher } from "../../../components/workspace-switcher";
import { NavLogo } from "../../../components/logo/nav-logo";

// const membershipsQuery = gql`
//   query getMembershipsMembers($workspaceSlug: String) {
//     memberships(where: { workspaceSlug: $workspaceSlug }) {
//       id
//       role
//       user {
//         id
//         name
//         email
//         image
//       }
//       workspace {
//         id
//         name
//       }
//     }
//   }
// `;

const WorkspaceSettingsPage = () => {
  const workspaceSlug = useRouter().query?.workspaceSlug as string;

  // const { data: membershipsData } = useQuery(membershipsQuery, {
  //   variables: { workspaceSlug },
  //   skip: workspaceSlug == null,
  // });

  // const [deleteMembership] = useMutation(deleteMembershipMutation, {
  //   refetchQueries: ["getMembershipsMembers"],
  // });

  // const [updateMembership] = useMutation(updateMembershipMutation, {
  //   refetchQueries: ["getMembershipsMembers"],
  // });

  return (
    <>
      <ServiceWorkerManagerModal />
      <WelcomeManager />
      <AuthManager />
      <Meta title="LabelFlow | Workspace Settings" />
      <CookieBanner />
      <Layout
        breadcrumbs={[
          <NavLogo key={0} />,
          <WorkspaceSwitcher key={1} />,
          <Text key={2}>Settings</Text>,
        ]}
        tabBar={
          <WorkspaceTabBar
            currentTab="settings"
            workspaceSlug={workspaceSlug}
          />
        }
      >
        <Box p={8}>
          <WorkspaceSettings
            workspace={{
              id: "1",
              slug: workspaceSlug,
              name: workspaceSlug,
              image: null,
            }}
            changeName={(name: string) => {}}
            changeImage={(name: string) => {}}
          />
        </Box>
      </Layout>
    </>
  );
};

export default WorkspaceSettingsPage;
