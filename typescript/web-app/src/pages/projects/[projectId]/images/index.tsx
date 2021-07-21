import { gql, useQuery } from "@apollo/client";
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
import type { Project as ProjectType } from "../../../../graphql-types.generated";
import { EmptyStateImage } from "../../../../components/empty-state";

const ArrowRightIcon = chakra(RiArrowRightSLine);

export const projectDataQuery = gql`
  query getProjectData($projectId: ID!) {
    project(where: { id: $projectId }) {
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
  const { projectId } = router?.query;

  const { data: projectResult } = useQuery<{
    project: ProjectType;
  }>(projectDataQuery, {
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
        {!projectResult && (
          <Center h="full">
            <Spinner size="xl" />
          </Center>
        )}
        {projectResult && isEmpty(projectResult?.project?.images) && (
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

        {projectResult && !isEmpty(projectResult?.project?.images) && (
          <Wrap h="full" spacing={8} padding={8} justify="space-evenly">
            {projectResult?.project?.images?.map(({ id, name, url }) => (
              <NextLink href={`/projects/${projectId}/images/${id}`} key={id}>
                {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                <a>
                  <WrapItem p={4} background="white" rounded={8}>
                    <VStack w="80" h="80" justify="space-between">
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
                        h="72"
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
