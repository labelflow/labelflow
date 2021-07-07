import { useQuery } from "@apollo/client";
import gql from "graphql-tag";
import NextLink from "next/link";
import {
  VStack,
  Box,
  Image,
  Center,
  Spinner,
  Text,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Wrap,
  WrapItem,
  Heading,
  chakra,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { isEmpty } from "lodash/fp";
import { RiArrowRightSLine } from "react-icons/ri";
import { KeymapButton } from "../../../../components/keymap-button";
import { ImportButton } from "../../../../components/import-button";
import { ExportButton } from "../../../../components/export-button";
import { Meta } from "../../../../components/meta";
import { Layout } from "../../../../components/layout";
import type {
  Image as ImageType,
  Project as ProjectType,
} from "../../../../graphql-types.generated";
import { EmptyStateImage } from "../../../../components/empty-state";

const ArrowRightIcon = chakra(RiArrowRightSLine);

export const imagesOfProjectQuery = gql`
  query getImagesOfProject($projectId: ID!) {
    images(where: { projectId: $projectId }) {
      id
      name
      url
    }
  }
`;

const projectQuery = gql`
  query project($id: ID!) {
    project(where: { id: $id }) {
      id
      name
    }
  }
`;

const ImagesPage = () => {
  const router = useRouter();
  const { projectId } = router?.query;

  const { data: projectResult } = useQuery<{
    project: Pick<ProjectType, "id" | "name">;
  }>(projectQuery, {
    variables: {
      id: projectId,
    },
  });

  const { data: imagesResult } = useQuery<{
    images: Pick<ImageType, "id" | "url" | "name">[];
  }>(imagesOfProjectQuery, {
    variables: {
      projectId,
    },
  });

  const projectName = projectResult?.project.name;

  return (
    <>
      <Meta title="Labelflow | Images" />
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
              <Text>{projectName}</Text>
            </BreadcrumbItem>

            <BreadcrumbItem>
              <Text>Images</Text>
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

        {imagesResult && !isEmpty(imagesResult?.images) && (
          <Wrap h="full" spacing={8} padding={8} justify="space-evenly">
            {imagesResult?.images?.map(({ id, name, url }) => (
              <NextLink href={`/projects/${projectId}/images/${id}`} key={id}>
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

export default ImagesPage;
