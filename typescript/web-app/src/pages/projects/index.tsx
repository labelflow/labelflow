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
      images(first: 1) {
        id
        url
      }
      imagesAggregates {
        totalCount
      }
      labelsAggregates {
        totalCount
      }
      labelClassesAggregates {
        totalCount
      }
    }
  }
`;

const ProjectPage = () => {
  const { data: projectsResult } =
    useQuery<{
      projects: Pick<
        ProjectType,
        | "id"
        | "name"
        | "images"
        | "imagesAggregates"
        | "labelClassesAggregates"
        | "labelsAggregates"
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
            ({
              id,
              name,
              images,
              imagesAggregates,
              labelsAggregates,
              labelClassesAggregates,
            }) => (
              <NextLink href={`/projects/${id}`} key={id}>
                {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                <a style={{ width: "100%" }}>
                  <ProjectCard
                    projectName={name}
                    imageUrl={images[0]?.url}
                    imagesCount={imagesAggregates.totalCount}
                    labelClassesCount={labelClassesAggregates.totalCount}
                    labelsCount={labelsAggregates.totalCount}
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
