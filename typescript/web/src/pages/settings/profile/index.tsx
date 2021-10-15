import React from "react";
import { Meta } from "../../../components/meta";
import { Layout } from "../../../components/layout";
import { ServiceWorkerManagerModal } from "../../../components/service-worker-manager";
import { AuthManager } from "../../../components/auth-manager";
import { WelcomeManager } from "../../../components/welcome-manager";
import { CookieBanner } from "../../../components/cookie-banner";
import { NavLogo } from "../../../components/logo/nav-logo";
import { Profile } from "../../../components/profile";

const ProfilePage = () => {
  return (
    <>
      <ServiceWorkerManagerModal />
      <WelcomeManager />
      <AuthManager />
      <Meta title="LabelFlow | Profile" />
      <CookieBanner />
      <Layout breadcrumbs={[<NavLogo key={0} />]}>
        <Profile />
      </Layout>
    </>
  );
};

export default ProfilePage;
