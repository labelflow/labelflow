import React, { useEffect } from "react";
import { Skeleton, Text, Center, BreadcrumbLink } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useQuery, gql } from "@apollo/client";
import { useErrorHandler } from "react-error-boundary";
import NextLink from "next/link";

import { Spinner } from "../../../../components/spinner";
import { WorkspaceSwitcher } from "../../../../components/workspace-switcher";
import { NavLogo } from "../../../../components/logo/nav-logo";
import { Meta } from "../../../../components/meta";
import { ServiceWorkerManagerModal } from "../../../../components/service-worker-manager";
import { Layout } from "../../../../components/layout";
import { Error404Content } from "../../../404";
import { ExportButton } from "../../../../components/export-button";
import { ImportButton } from "../../../../components/import-button";
import { KeymapButton } from "../../../../components/layout/top-bar/keymap-button";
import { AuthManager } from "../../../../components/auth-manager";
import { WelcomeManager } from "../../../../components/welcome-manager";
import { CookieBanner } from "../../../../components/cookie-banner";

const getDataset = gql`
  query getDataset($slug: String!, $workspaceSlug: String!) {
    dataset(where: { slugs: { slug: $slug, workspaceSlug: $workspaceSlug } }) {
      id
      name
    }
  }
`;

const DatasetIndexPage = () => {
  const router = useRouter();
  const { datasetSlug, workspaceSlug, ...queryRest } = router.query;

  const {
    data: datasetResult,
    error,
    loading,
  } = useQuery(getDataset, {
    variables: { slug: datasetSlug, workspaceSlug },
    skip: typeof datasetSlug !== "string" || typeof workspaceSlug !== "string",
  });

  const datasetName = datasetResult?.dataset.name;

  useEffect(() => {
    if (router.isReady && !error && !loading) {
      router.replace({
        pathname: `/${workspaceSlug}/datasets/${datasetSlug}/images`,
        query: queryRest,
      });
    }
  }, [error, loading, router.isReady]);

  const handleError = useErrorHandler();
  if (error && !loading) {
    if (!error.message.match(/Couldn't find dataset corresponding to/)) {
      handleError(error);
    }
    return (
      <>
        <ServiceWorkerManagerModal />
        <WelcomeManager />
        <AuthManager />
        <Meta title="LabelFlow | Dataset not found" />
        <CookieBanner />
        <Error404Content />
      </>
    );
  }

  return (
    <>
      <ServiceWorkerManagerModal />
      <WelcomeManager />
      <AuthManager />
      <Meta title={`LabelFlow | ${datasetName ?? "Dataset"}`} />
      <CookieBanner />
      <Layout
        breadcrumbs={[
          <NavLogo key={0} />,
          <WorkspaceSwitcher key={1} />,
          <NextLink key={2} href={`/${workspaceSlug}/datasets`}>
            <BreadcrumbLink>Datasets</BreadcrumbLink>
          </NextLink>,
          <Text key={3}>{datasetName}</Text> ?? (
            <Skeleton key={1}>Dataset Name</Skeleton>
          ),
        ]}
        topBarRightContent={
          <>
            <KeymapButton />
            <ImportButton />
            <ExportButton />
          </>
        }
      >
        <Center h="full">
          <Spinner />
        </Center>
      </Layout>
    </>
  );
};

export default DatasetIndexPage;
