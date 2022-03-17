import { useQuery } from "@apollo/client";
import { BreadcrumbLink, Skeleton, Text } from "@chakra-ui/react";
import NextLink from "next/link";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { useErrorHandler } from "react-error-boundary";
import { Authenticated } from "../../../../components/auth";
import { CookieBanner } from "../../../../components/cookie-banner";
import { CreateTutorial } from "../../../../components/datasets";
import { GET_DATASET_BY_SLUG_QUERY } from "../../../../components/datasets/datasets.query";
import { ExportButton } from "../../../../components/export-button";
import { ImportButton } from "../../../../components/import-button";
import { Layout } from "../../../../components/layout";
import { KeymapButton } from "../../../../components/layout/top-bar/keymap-button";
import { NavLogo } from "../../../../components/logo/nav-logo";
import { Meta } from "../../../../components/meta";
import { LayoutSpinner } from "../../../../components/spinner";
import { WorkspaceSwitcher } from "../../../../components/workspace-switcher";
import { Error404Content } from "../../../404";

type ApolloNetworkError =
  | { result?: { errors?: { message: string }[] } }
  | undefined;

const Body = () => {
  const router = useRouter();
  const { datasetSlug, workspaceSlug, ...queryRest } = router.query;

  const {
    data: datasetResult,
    error,
    loading,
  } = useQuery(GET_DATASET_BY_SLUG_QUERY, {
    variables: { slug: datasetSlug, workspaceSlug },
    skip: typeof datasetSlug !== "string" || typeof workspaceSlug !== "string",
  });
  const datasetName = datasetResult?.dataset.name;
  const isTutorial = datasetSlug === "tutorial";
  const datasetTitle = isTutorial ? "Tutorial" : datasetName ?? "Dataset";

  useEffect(() => {
    if (router.isReady && !error && !loading) {
      router.replace({
        pathname: `/${workspaceSlug}/datasets/${datasetSlug}/images`,
        query: queryRest,
      });
    }
  }, [
    datasetSlug,
    error,
    loading,
    queryRest,
    router,
    router.isReady,
    workspaceSlug,
  ]);

  const handleError = useErrorHandler();
  // See https://github.com/apollographql/apollo-client/issues/6222
  const errorMessage =
    error && !loading
      ? (error.networkError as ApolloNetworkError)?.result?.errors?.[0].message
      : undefined;
  const isNotFound =
    error &&
    !loading &&
    errorMessage?.match(/Couldn't find dataset corresponding to/);
  if (error && !loading && !isNotFound) {
    handleError(error);
  }

  return (
    <>
      <Meta
        title={`LabelFlow | ${isNotFound ? "Dataset not found" : datasetTitle}`}
      />
      <CookieBanner />
      {(isNotFound && !isTutorial && <Error404Content />) || (
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
              <ImportButton datasetId={datasetResult?.dataset?.id} />
              <ExportButton />
            </>
          }
        >
          {(!loading && isTutorial && <CreateTutorial />) || <LayoutSpinner />}
        </Layout>
      )}
    </>
  );
};

const DatasetIndexPage = () => (
  <Authenticated withWorkspaces>
    <Body />
  </Authenticated>
);

export default DatasetIndexPage;
