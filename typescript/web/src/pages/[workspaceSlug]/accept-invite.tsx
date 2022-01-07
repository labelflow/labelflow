import React from "react";
import type { GetServerSideProps } from "next";
import { getSession } from "next-auth/react";

import { Meta } from "../../components/meta";
import { AuthManager } from "../../components/auth-manager";
import { Layout } from "../../components/layout";
import { WelcomeModal } from "../../components/welcome-manager";
import { CookieBanner } from "../../components/cookie-banner";
import { NavLogo } from "../../components/logo/nav-logo";

import { InvitationManager } from "../../components/invitation-manager";

const AcceptInvite = () => {
  return (
    <>
      <WelcomeModal />
      <AuthManager />
      <Meta title="LabelFlow | Local Workspace" />
      <CookieBanner />
      <Layout breadcrumbs={[<NavLogo key={0} />]}>
        <InvitationManager />
      </Layout>
    </>
  );
};

export default AcceptInvite;

export const getServerSideProps: GetServerSideProps = async ({
  query,
  req,
  resolvedUrl,
}) => {
  const session = await getSession({ req });

  // open the login modal if the user is not logged in
  if (!session && !("modal-signin" in query)) {
    return {
      redirect: {
        destination: `${resolvedUrl}&modal-signin`,
        permanent: false,
      },
    };
  }

  return { props: {} };
};
