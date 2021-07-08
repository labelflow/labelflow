import gql from "graphql-tag";
import { useQuery } from "@apollo/client";
import NextLink from "next/link";
import { SimpleGrid, Breadcrumb, BreadcrumbItem, Text } from "@chakra-ui/react";
import { RiArrowRightSLine } from "react-icons/ri";

import { Meta } from "../../components/meta";
import { Layout } from "../../components/layout";
import { NewProjectCard, ProjectCard } from "../../components/projects";
import type { Project as ProjectType } from "../../graphql-types.generated";

export const projectsQuery = gql`
  query getProjects {
    projects {
      id
      name
      imagesCount
      labelClassesCount
      labelsCount
    }
  }
`;

const ProjectPage = () => {
  const { data: projectsResult } =
    useQuery<{
      projects: Pick<
        ProjectType,
        "id" | "name" | "imagesCount" | "labelClassesCount" | "labelsCount"
      >[];
    }>(projectsQuery);

  return (
    <>
      <Meta title="Labelflow | Projects" />
      <Layout
        topBarLeftContent={
          <Breadcrumb
            spacing="8px"
            separator={<RiArrowRightSLine color="gray.500" />}
          >
            <BreadcrumbItem>
              <Text>Projects</Text>
            </BreadcrumbItem>
          </Breadcrumb>
        }
      >
        <SimpleGrid
          gap={12}
          padding={12}
          minChildWidth="24rem"
          justifyItems="center"
        >
          <NewProjectCard />
          {/* @ts-ignore */}
          {projectsResult?.projects?.map(
            ({ id, name, imagesCount, labelClassesCount, labelsCount }) => (
              <NextLink href={`/projects/${id}`} key={id}>
                {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                <a style={{ width: "100%" }}>
                  <ProjectCard
                    projectName={name}
                    imagesCount={imagesCount}
                    labelClassesCount={labelClassesCount}
                    labelsCount={labelsCount}
                    editProject={() => {}}
                    deleteProject={() => {}}
                  />
                </a>
              </NextLink>
            )
          )}
        </SimpleGrid>
      </Layout>
    </>
  );
};

export default ProjectPage;
