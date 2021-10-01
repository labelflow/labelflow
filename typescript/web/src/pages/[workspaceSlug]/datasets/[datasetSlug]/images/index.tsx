import React from "react";
import { gql, useQuery } from "@apollo/client";
import NextLink from "next/link";
import {
  Box,
  VStack,
  useColorModeValue as mode,
  Image,
  Center,
  Skeleton,
  Spinner,
  Text,
  BreadcrumbLink,
  Heading,
  SimpleGrid,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { isEmpty } from "lodash/fp";

import { useErrorHandler } from "react-error-boundary";
import type { Dataset as DatasetType } from "@labelflow/graphql-types";
import { ServiceWorkerManagerModal } from "../../../../../components/service-worker-manager";
import { KeymapButton } from "../../../../../components/layout/top-bar/keymap-button";
import { ImportButton } from "../../../../../components/import-button";
import { ExportButton } from "../../../../../components/export-button";
import { Meta } from "../../../../../components/meta";
import { Layout } from "../../../../../components/layout";
import { EmptyStateNoImages } from "../../../../../components/empty-state";
import { DatasetTabBar } from "../../../../../components/layout/tab-bar/dataset-tab-bar";
import { Error404Content } from "../../../../404";
import { AuthManager } from "../../../../../components/auth-manager";

import { WelcomeManager } from "../../../../../components/welcome-manager";
import { CookieBanner } from "../../../../../components/cookie-banner";

export const datasetDataQuery = gql`
  query getDatasetData($slug: String!, $workspaceSlug: String!) {
    dataset(where: { slugs: { slug: $slug, workspaceSlug: $workspaceSlug } }) {
      id
      name
      images {
        id
        name
        url
      }
    }
  }
`;

const ImagesPage = () => {
  const router = useRouter();
  const datasetSlug = router?.query?.datasetSlug as string;
  const workspaceSlug = router?.query?.workspaceSlug as string;

  const {
    data: datasetResult,
    error,
    loading,
  } = useQuery<{
    dataset: DatasetType;
  }>(datasetDataQuery, {
    variables: {
      slug: datasetSlug,
      workspaceSlug,
    },
    skip: !datasetSlug || !workspaceSlug,
  });

  const datasetName = datasetResult?.dataset.name;

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

  const cardBackground = mode("white", "gray.700");
  const imageBackground = mode("gray.100", "gray.800");
  return (
    <>
      <ServiceWorkerManagerModal />
      <WelcomeManager />
      <AuthManager />
      <Meta title="LabelFlow | Images" />
      <CookieBanner />
      <Layout
        breadcrumbs={[
          <NextLink href={`/${workspaceSlug}/datasets`}>
            <BreadcrumbLink>Datasets</BreadcrumbLink>
          </NextLink>,
          <NextLink href={`/${workspaceSlug}/datasets/${datasetSlug}`}>
            <BreadcrumbLink>
              {datasetName ?? <Skeleton>Dataset Name</Skeleton>}
            </BreadcrumbLink>
          </NextLink>,
          <Text>Images</Text>,
        ]}
        topBarRightContent={
          <>
            <KeymapButton />
            <ImportButton />
            <ExportButton />
          </>
        }
        tabBar={
          <DatasetTabBar
            currentTab="images"
            datasetSlug={datasetSlug}
            workspaceSlug={workspaceSlug}
          />
        }
      >
        {!datasetResult && (
          <Center h="full">
            <Spinner size="xl" />
          </Center>
        )}
        {datasetResult && isEmpty(datasetResult?.dataset?.images) && (
          <Center h="full">
            <Box as="section">
              <Box
                maxW="2xl"
                mx="auto"
                px={{ base: "6", lg: "8" }}
                py={{ base: "16", sm: "20" }}
                textAlign="center"
              >
                <EmptyStateNoImages w="full" />
                <Heading as="h2">You don&apos;t have any images.</Heading>
                <Text mt="4" fontSize="lg">
                  Fortunately, it’s very easy to add some.
                </Text>

                <ImportButton
                  colorScheme="brand"
                  variant="solid"
                  mt="8"
                  showModal={false}
                />
              </Box>
            </Box>
          </Center>
        )}

        {datasetResult && !isEmpty(datasetResult?.dataset?.images) && (
          <SimpleGrid
            minChildWidth="240px"
            spacing={{ base: "2", md: "8" }}
            padding={{ base: "2", md: "8" }}
          >
            {datasetResult?.dataset?.images?.map(({ id, name, url }) => (
              <NextLink
                href={`/${workspaceSlug}/datasets/${datasetSlug}/images/${id}`}
                key={id}
              >
                <a
                  href={`/${workspaceSlug}/datasets/${datasetSlug}/images/${id}`}
                >
                  <VStack
                    maxW="486px"
                    p={4}
                    background={cardBackground}
                    rounded={8}
                    height="270px"
                    justifyContent="space-between"
                  >
                    <Heading
                      as="h3"
                      size="sm"
                      overflow="hidden"
                      textOverflow="ellipsis"
                      whiteSpace="nowrap"
                      w="full"
                      flexGrow={0}
                      flexShrink={0}
                    >
                      {name}
                    </Heading>
                    <Image
                      background={imageBackground}
                      alt={name}
                      src={url}
                      ignoreFallback
                      objectFit="contain"
                      h="208px"
                      w="full"
                      flexGrow={0}
                      flexShrink={0}
                    />
                  </VStack>
                </a>
              </NextLink>
            ))}
          </SimpleGrid>
        )}
      </Layout>
    </>
  );
};

export default ImagesPage;
