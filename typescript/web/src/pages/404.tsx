import { Text } from "@chakra-ui/react";
import React from "react";
import { CookieBanner } from "../components/cookie-banner";
import { EmptyStateNoSearchResult } from "../components/empty-state";
import { InfoBody } from "../components/info-body/info-body";
import { Layout } from "../components/layout";
import { NavLogo } from "../components/logo/nav-logo";
import { Meta } from "../components/meta";

export const Error404Content = () => (
  <Layout breadcrumbs={[<NavLogo key={0} />]}>
    <InfoBody
      title="Page not found"
      illustration={EmptyStateNoSearchResult}
      homeButtonType="nextLink"
      homeButtonLabel="Go back to LabelFlow home page"
    >
      <Text mt="4" fontSize="lg">
        There is nothing to see here.
        <br />
        If you followed a link to get here, you might not have access to the
        content at this page, or the link might be broken.
      </Text>
    </InfoBody>
  </Layout>
);

const Error404Page = () => {
  return (
    <>
      <Meta title="LabelFlow | Not found" />
      <CookieBanner />
      <Error404Content />
    </>
  );
};

export default Error404Page;
