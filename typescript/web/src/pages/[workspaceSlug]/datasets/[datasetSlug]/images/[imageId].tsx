import { gql, useQuery } from "@apollo/client";
import {
  Box,
  BreadcrumbLink,
  Flex,
  Skeleton,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import dynamic from "next/dynamic";
import NextLink from "next/link";
import React from "react";
import { useErrorHandler } from "react-error-boundary";
import { Authenticated } from "../../../../../components/auth";
import { CookieBanner } from "../../../../../components/cookie-banner";
import { GET_DATASET_BY_SLUG_QUERY } from "../../../../../components/datasets/datasets.query";
import { ExportButton } from "../../../../../components/export-button";
import { Gallery } from "../../../../../components/gallery";
import { ImportButton } from "../../../../../components/import-button";
import { Layout } from "../../../../../components/layout";
import { KeymapButton } from "../../../../../components/layout/top-bar/keymap-button";
import { NavLogo } from "../../../../../components/logo/nav-logo";
import { Meta } from "../../../../../components/meta";
import { LayoutSpinner } from "../../../../../components";
import { WorkspaceSwitcher } from "../../../../../components/workspace-switcher";
import {
  ImageNameQuery,
  ImageNameQueryVariables,
} from "../../../../../graphql-types/ImageNameQuery";
import {
  useDataset,
  useWorkspace,
  useDatasetImage,
} from "../../../../../hooks";

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
      return <LayoutSpinner />;
    },
  }
);

const IMAGE_NAME_QUERY = gql`
  query ImageNameQuery($id: ID!) {
    image(where: { id: $id }) {
      id
      name
    }
  }
`;

const Body = () => {
  const { slug: workspaceSlug } = useWorkspace();
  const { slug: datasetSlug } = useDataset();
  const { id: imageId } = useDatasetImage();

  const {
    data: imageResult,
    error: errorImage,
    loading: loadingImage,
  } = useQuery<ImageNameQuery, ImageNameQueryVariables>(IMAGE_NAME_QUERY, {
    variables: { id: typeof imageId === "string" ? imageId : imageId[0] },
    skip: !imageId,
  });

  const {
    data: datasetResult,
    error: errorDataset,
    loading: loadingDataset,
  } = useQuery(GET_DATASET_BY_SLUG_QUERY, {
    variables: { slug: datasetSlug, workspaceSlug },
    skip: !datasetSlug || !workspaceSlug,
  });

  const imageName = imageResult?.image.name;
  const datasetName = datasetResult?.dataset.name;

  const galleryBg = useColorModeValue("white", "gray.800");

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
          <Meta title="LabelFlow | Image not found" />
          <CookieBanner />
          <Error404Content />
        </>
      );
    }
  }

  return (
    <>
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
            <ImportButton datasetId={datasetResult?.dataset?.id} />
            <ExportButton />
          </>
        }
      >
        <Flex grow={1} direction="column">
          <Flex grow={1} direction="column">
            <LabelingTool />
          </Flex>
          <Box bg={galleryBg} overflow="hidden">
            <Gallery />
          </Box>
        </Flex>
      </Layout>
    </>
  );
};

const ImagePage = () => (
  <Authenticated withWorkspaces>
    <Body />
  </Authenticated>
);

export default ImagePage;
