import React from "react";
import { Authenticated } from "../../components/auth";
import { CookieBanner } from "../../components/cookie-banner";
import { InvitationManager } from "../../components/invitation-manager";
import { Layout } from "../../components/layout";
import { NavLogo } from "../../components/logo/nav-logo";
import { Meta } from "../../components/meta";

const AcceptInvite = () => (
  <Authenticated>
    <Meta title="LabelFlow | Invitation" />
    <CookieBanner />
    <Layout breadcrumbs={[<NavLogo key={0} />]}>
      <InvitationManager />
    </Layout>
  </Authenticated>
);

export default AcceptInvite;
