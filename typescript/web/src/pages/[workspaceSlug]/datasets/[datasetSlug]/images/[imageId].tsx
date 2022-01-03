import { gql, useQuery } from "@apollo/client";
import {
  Box,
  BreadcrumbLink,
  Flex,
  Skeleton,
  Text,
  useColorModeValue as mode,
} from "@chakra-ui/react";
import type { Image } from "@labelflow/graphql-types";
import dynamic from "next/dynamic";
import NextLink from "next/link";
import { useRouter } from "next/router";
import React from "react";
import { useErrorHandler } from "react-error-boundary";
import { AuthManager } from "../../../../../components/auth-manager";
import { CookieBanner } from "../../../../../components/cookie-banner";
import { ExportButton } from "../../../../../components/export-button";
import { Gallery } from "../../../../../components/gallery";
import { ImportButton } from "../../../../../components/import-button";
import { Layout } from "../../../../../components/layout";
import { KeymapButton } from "../../../../../components/layout/top-bar/keymap-button";
import { NavLogo } from "../../../../../components/logo/nav-logo";
import { Meta } from "../../../../../components/meta";
import { ServiceWorkerManagerModal } from "../../../../../components/service-worker-manager";
import { LayoutSpinner } from "../../../../../components/spinner";
import { WelcomeManager } from "../../../../../components/welcome-manager";
import { WorkspaceSwitcher } from "../../../../../components/workspace-switcher";
import { Error404Content } from "../../../../404";

// The dynamic import is needed because openlayers use web apis that are not available
// in NodeJS, like `Blob`, so it crashes when rendering in NextJS server side.
// And anyway, it would not make sense to render canvas server side, it would just be a loss.
const LabelingTool = dynamic(
  () => import("../../../../../components/labeling-tool"),
  {
    ssr: false,
    loading: ({ error }) => {
      if (error) throw error;
      return <LayoutSpinner aria-label="loading indicator" />;
    },
  }
);

const imageQuery = gql`
  query image($id: ID!) {
    image(where: { id: $id }) {
      id
      name
    }
  }
`;

const getDatasetQuery = gql`
  query getDataset($slug: String!, $workspaceSlug: String!) {
    dataset(where: { slugs: { slug: $slug, workspaceSlug: $workspaceSlug } }) {
      id
      name
    }
  }
`;

type ImageQueryResponse = {
  image: Pick<Image, "id" | "name">;
};

const ImagePage = () => {
  const router = useRouter();
  const { datasetSlug, imageId, workspaceSlug } = router?.query;

  const {
    data: imageResult,
    error: errorImage,
    loading: loadingImage,
  } = useQuery<ImageQueryResponse>(imageQuery, {
    variables: { id: imageId },
    skip: !imageId,
  });

  const {
    data: datasetResult,
    error: errorDataset,
    loading: loadingDataset,
  } = useQuery(getDatasetQuery, {
    variables: { slug: datasetSlug, workspaceSlug },
    skip: !datasetSlug || !workspaceSlug,
  });

  const imageName = imageResult?.image.name;
  const datasetName = datasetResult?.dataset.name;

  const handleError = useErrorHandler();
  if ((errorDataset && !loadingDataset) || (errorImage && !loadingImage)) {
    if (errorDataset && !loadingDataset) {
      if (
        !errorDataset.message.match(/Couldn't find dataset corresponding to/)
      ) {
        handleError(errorDataset);
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
    if (errorImage && !loadingImage) {
      if (!errorImage.message.match(/No image with id/)) {
        handleError(errorImage);
      }
      return (
        <>
          <ServiceWorkerManagerModal />
          <WelcomeManager />
          <AuthManager />
          <Meta title="LabelFlow | Image not found" />
          <CookieBanner />
          <Error404Content />
        </>
      );
    }
  }

  return (
    <>
      <ServiceWorkerManagerModal />
      <WelcomeManager />
      <AuthManager />
      <Meta title={`LabelFlow | Image ${imageName ?? ""}`} />
      <CookieBanner />
      <Layout
        breadcrumbs={[
          <NavLogo key={0} />,
          <WorkspaceSwitcher key={1} />,
          <NextLink key={2} href={`/${workspaceSlug}/datasets`}>
            <BreadcrumbLink>Datasets</BreadcrumbLink>
          </NextLink>,
          <NextLink
            key={3}
            href={`/${workspaceSlug}/datasets/${datasetSlug}/images`}
          >
            <BreadcrumbLink>
              {datasetName ?? <Skeleton>Dataset Name</Skeleton>}
            </BreadcrumbLink>
          </NextLink>,
          <NextLink
            key={4}
            href={`/${workspaceSlug}/datasets/${datasetSlug}/images`}
          >
            <BreadcrumbLink>Images</BreadcrumbLink>
          </NextLink>,
          imageName ? (
            <Text key={5}>{imageName}</Text>
          ) : (
            <Skeleton key={5}>Image Name</Skeleton>
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
        <Flex height="100%" flexDirection="column">
          <Box flex="1">
            <LabelingTool />
          </Box>
          <Box bg={mode("white", "gray.800")} overflow="hidden">
            <Gallery />
          </Box>
        </Flex>
      </Layout>
    </>
  );
};

export default ImagePage;
