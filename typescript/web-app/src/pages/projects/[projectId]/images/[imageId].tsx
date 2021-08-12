import React, { useEffect } from "react";
import { useQuery, gql } from "@apollo/client";
import {
  Text,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Center,
  Spinner,
  Box,
  Flex,
  chakra,
} from "@chakra-ui/react";

import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { RiArrowRightSLine } from "react-icons/ri";
import NextLink from "next/link";
import type { Image } from "@labelflow/graphql-types";
import { AppLifecycleManager } from "../../../../components/app-lifecycle-manager";
import { KeymapButton } from "../../../../components/keymap-button";
import { ImportButton } from "../../../../components/import-button";
import { ExportButton } from "../../../../components/export-button";
import { Meta } from "../../../../components/meta";
import { Layout } from "../../../../components/layout";
import { Gallery } from "../../../../components/gallery";
import Error404Page from "../../../404";

const ArrowRightIcon = chakra(RiArrowRightSLine);

// The dynamic import is needed because openlayers use web apis that are not available
// in NodeJS, like `Blob`, so it crashes when rendering in NextJS server side.
// And anyway, it would not make sense to render canvas server side, it would just be a loss.
const LabellingTool = dynamic(
  () => import("../../../../components/labelling-tool"),
  {
    ssr: false,
    loading: ({ error }) => {
      if (error) throw error;
      return (
        <Center h="full">
          <Spinner aria-label="loading indicator" size="xl" />
        </Center>
      );
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

const getProjectQuery = gql`
  query getProject($id: ID!) {
    project(where: { id: $id }) {
      id
      name
    }
  }
`;

type ImageQueryResponse = {
  image: Pick<Image, "id" | "name">;
};

const ImagePage = ({
  assumeServiceWorkerActive,
}: {
  assumeServiceWorkerActive: boolean;
}) => {
  const router = useRouter();
  const { projectId, imageId } = router?.query;

  const { data: imageResult, error: errorImage } = useQuery<ImageQueryResponse>(
    imageQuery,
    {
      variables: { id: imageId },
      skip: typeof imageId !== "string",
    }
  );

  const { data: projectResult, error: errorProject } = useQuery(
    getProjectQuery,
    {
      variables: { id: projectId },
    }
  );

  const imageName = imageResult?.image.name;
  const projectName = projectResult?.project.name;

  if (errorImage || errorProject) {
    return <Error404Page />;
  }

  return (
    <>
      <AppLifecycleManager
        assumeServiceWorkerActive={assumeServiceWorkerActive}
      />
      <Meta title={`Labelflow | Image ${imageName ?? ""}`} />
      <Layout
        topBarLeftContent={
          <Breadcrumb
            overflow="hidden"
            textOverflow="ellipsis"
            whiteSpace="nowrap"
            spacing="8px"
            sx={{ "*": { display: "inline !important" } }}
            separator={<ArrowRightIcon color="gray.500" />}
          >
            <BreadcrumbItem>
              <NextLink href="/projects">
                <BreadcrumbLink>Projects</BreadcrumbLink>
              </NextLink>
            </BreadcrumbItem>

            <BreadcrumbItem isCurrentPage>
              <NextLink href={`/projects/${projectId}/images`}>
                <BreadcrumbLink>{projectName}</BreadcrumbLink>
              </NextLink>
            </BreadcrumbItem>

            <BreadcrumbItem>
              <NextLink href={`/projects/${projectId}/images`}>
                <BreadcrumbLink>Images</BreadcrumbLink>
              </NextLink>
            </BreadcrumbItem>

            <BreadcrumbItem isCurrentPage>
              <Text>{imageName}</Text>
            </BreadcrumbItem>
          </Breadcrumb>
        }
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
            <LabellingTool />
          </Box>
          <Box bg="white" overflow="hidden">
            <Gallery />
          </Box>
        </Flex>
      </Layout>
    </>
  );
};

export default ImagePage;
