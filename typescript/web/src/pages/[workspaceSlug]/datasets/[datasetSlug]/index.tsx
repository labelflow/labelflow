import { ApolloError, useQuery } from "@apollo/client";
import { BreadcrumbLink, Skeleton, Text } from "@chakra-ui/react";
import { isEmpty, isNil } from "lodash/fp";
import NextLink from "next/link";
import { useRouter } from "next/router";
import { useCallback } from "react";
import { useErrorHandler } from "react-error-boundary";
import { Authenticated } from "../../../../components/auth";
import { CookieBanner } from "../../../../components/cookie-banner";
import { GET_DATASET_BY_SLUG_QUERY } from "../../../../components/datasets/datasets.query";
import { ExportButton } from "../../../../components/export-button";
import { ImportButton } from "../../../../components/import-button";
import { Layout } from "../../../../components/layout";
import { KeymapButton } from "../../../../components/layout/top-bar/keymap-button";
import { NavLogo } from "../../../../components/logo/nav-logo";
import { Meta } from "../../../../components/meta";
import { LayoutSpinner } from "../../../../components";
import { WorkspaceSwitcher } from "../../../../components/workspace-switcher";
import {
  GetDatasetBySlugQuery,
  GetDatasetBySlugQueryVariables,
} from "../../../../graphql-types";
import { useRouterQueryString } from "../../../../hooks";
import { getApolloErrorMessage } from "../../../../utils";

const useApolloErrorHandler = () => {
  const router = useRouter();
  const handleError = useErrorHandler();
  return useCallback(
    (error: ApolloError) => {
      if (!router.isReady) return;
      const errorMsg = getApolloErrorMessage(error);
      if (errorMsg === "User not authorized to access dataset") {
        router.push("/404");
      } else {
        handleError(error);
      }
    },
    [handleError, router]
  );
};

const useRedirectToDefaultTab = () => {
  const router = useRouter();
  return useCallback(() => {
    if (!router.isReady) return;
    const { datasetSlug, workspaceSlug, ...queryRest } = router.query;
    router.replace({
      pathname: `/${workspaceSlug}/datasets/${datasetSlug}/images`,
      query: queryRest,
    });
  }, [router]);
};

const useRedirect = (
  loading: boolean,
  error: ApolloError | undefined
): void => {
  const handleError = useApolloErrorHandler();
  const redirectToDefaultTab = useRedirectToDefaultTab();
  const router = useRouter();
  if (!loading && router.isReady) {
    if (isNil(error)) {
      redirectToDefaultTab();
    } else {
      handleError(error);
    }
  }
};

const Body = () => {
  const datasetSlug = useRouterQueryString("datasetSlug");
  const workspaceSlug = useRouterQueryString("workspaceSlug");

  const {
    data: datasetResult,
    error,
    loading,
  } = useQuery<GetDatasetBySlugQuery, GetDatasetBySlugQueryVariables>(
    GET_DATASET_BY_SLUG_QUERY,
    {
      variables: { slug: datasetSlug, workspaceSlug },
      skip: isEmpty(workspaceSlug) || isEmpty(datasetSlug),
    }
  );

  const datasetName = datasetResult?.dataset.name;

  useRedirect(loading, error);

  const handleError = useErrorHandler();
  if (error && !loading) {
    handleError(getApolloErrorMessage(error));
    return <></>;
  }

  return (
    <>
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
            <ImportButton datasetId={datasetResult?.dataset?.id} />
            <ExportButton />
          </>
        }
      >
        <LayoutSpinner />
      </Layout>
    </>
  );
};

const DatasetIndexPage = () => (
  <Authenticated withWorkspaces>
    <Body />
  </Authenticated>
);

export default DatasetIndexPage;
