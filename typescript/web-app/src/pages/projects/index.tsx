import gql from "graphql-tag";
import { useQuery } from "@apollo/client";
import { Flex, Breadcrumb, BreadcrumbItem, Text } from "@chakra-ui/react";
import { RiArrowRightSLine } from "react-icons/ri";

import { Meta } from "../../components/meta";
import { Layout } from "../../components/layout";
import { NewProjectCard, ProjectCard } from "../../components/projects";
import type { Project as ProjectType } from "../../graphql-types.generated";

const getProjectsQuery = gql`
  query getProjects {
    projects {
      id
      name
      images {
        id
        url
      }
    }
  }
`;

const ProjectPage = () => {
  const { data: projectsResult } =
    useQuery<{ projects: Pick<ProjectType, "id" | "name" | "images">[] }>(
      getProjectsQuery
    );

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
        <Flex direction="row" wrap="wrap" p={4}>
          <NewProjectCard />
          {projectsResult?.projects?.map(({ id, name }) => (
            <ProjectCard
              key={id}
              url={`/projects/${id}`}
              projectName={name}
              imagesCount={0}
              labelClassesCount={0}
              labelsCount={0}
              editProject={() => {}}
              deleteProject={() => {}}
            />
          ))}
        </Flex>
      </Layout>
    </>
  );
};

export default ProjectPage;
