import {
  VStack,
  Box,
  Image,
  Center,
  Spinner,
  Text,
  Breadcrumb,
  BreadcrumbItem,
  Wrap,
  WrapItem,
  Heading,
  BreadcrumbLink,
} from "@chakra-ui/react";
import { isEmpty } from "lodash/fp";
import { RiArrowRightSLine } from "react-icons/ri";
import NextLink from "next/link";
import gql from "graphql-tag";
import { useQuery } from "@apollo/client";
import { useEffect } from "react";
import { useRouter } from "next/router";

import { Meta } from "../../components/meta";
import { Layout } from "../../components/layout";
import { Project } from "../../graphql-types.generated";
import { ImportButton } from "../../components/import-button";
import { ExportButton } from "../../components/export-button";
import { KeymapButton } from "../../components/keymap-button";
import { EmptyStateImage } from "../../components/empty-state";
import type { Image as ImageType } from "../../graphql-types.generated";

const projectQuery = gql`
  query project($id: ID!) {
    project(where: { id: $id }) {
      id
      name
    }
  }
`;

const imagesOfProjectQuery = gql`
  query getImagesOfProject($projectId: ID!) {
    images(where: { projectId: $projectId }) {
      id
      name
      url
    }
  }
`;

type ProjectQueryResponse = {
  project: Pick<Project, "id" | "name">;
};

const ProjectPage = () => {
  const router = useRouter();
  const id = router?.query?.id;

  const { data: imagesResult } = useQuery<{
    images: Pick<ImageType, "id" | "url" | "name">[];
  }>(imagesOfProjectQuery, {
    variables: {
      projectId: id,
    },
  });

  const { data: projectResult, error } = useQuery<ProjectQueryResponse>(
    projectQuery,
    {
      variables: { id },
      skip: typeof id !== "string",
    }
  );

  useEffect(() => {
    if (error) {
      router.replace({ pathname: "/projects", query: router.query });
    }
  }, [error]);

  const projectName = projectResult?.project.name;

  return (
    <>
      <Meta title={`Labelflow | Project ${projectName ?? ""}`} />
      <Layout
        topBarLeftContent={
          <Breadcrumb
            spacing="8px"
            separator={<RiArrowRightSLine color="gray.500" />}
          >
            <BreadcrumbItem>
              <NextLink href="/projects">
                <BreadcrumbLink>Projects</BreadcrumbLink>
              </NextLink>
            </BreadcrumbItem>

            <BreadcrumbItem isCurrentPage>
              <Text
                maxWidth="20rem"
                textOverflow="ellipsis"
                whiteSpace="nowrap"
                overflow="hidden"
              >
                {projectName}
              </Text>
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
        {!imagesResult && (
          <Center h="full">
            <Spinner size="xl" />
          </Center>
        )}
        {imagesResult && isEmpty(imagesResult?.images) && (
          <Center h="full">
            <Box as="section">
              <Box
                maxW="2xl"
                mx="auto"
                px={{ base: "6", lg: "8" }}
                py={{ base: "16", sm: "20" }}
                textAlign="center"
              >
                <EmptyStateImage w="full" />
                <Heading as="h2">
                  You don&apos;t have any images in this project.
                </Heading>
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

        {imagesResult && !isEmpty(imagesResult?.images) && (
          <Wrap h="full" spacing={8} padding={8} justify="space-evenly">
            {imagesResult?.images?.map(({ id: imageId, name, url }) => (
              <NextLink href={`/images/${imageId}`} key={imageId}>
                {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                <a>
                  <WrapItem p={4} background="white" rounded={8}>
                    <VStack w="20rem" h="20rem" justify="space-between">
                      <Heading
                        as="h3"
                        size="sm"
                        overflow="hidden"
                        textOverflow="ellipsis"
                        whiteSpace="nowrap"
                        w="full"
                      >
                        {name}
                      </Heading>
                      <Image
                        background="gray.100"
                        alt={name}
                        src={url}
                        ignoreFallback
                        objectFit="contain"
                        h="18rem"
                        w="full"
                      />
                    </VStack>
                  </WrapItem>
                </a>
              </NextLink>
            ))}
          </Wrap>
        )}
      </Layout>
    </>
  );
};

export default ProjectPage;
