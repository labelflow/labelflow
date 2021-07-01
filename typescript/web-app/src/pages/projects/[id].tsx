import {
  Text,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Center,
  Box,
  Heading,
} from "@chakra-ui/react";
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

const projectQuery = gql`
  query project($id: ID!) {
    project(where: { id: $id }) {
      id
      name
    }
  }
`;

type ProjectQueryResponse = {
  project: Pick<Project, "id" | "name">;
};

const ProjectPage = () => {
  const router = useRouter();
  const id = router?.query?.id;

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
      </Layout>
    </>
  );
};

export default ProjectPage;
