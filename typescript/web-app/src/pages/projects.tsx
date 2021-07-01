import gql from "graphql-tag";
import { useQuery } from "@apollo/client";
import NextLink from "next/link";
import { SimpleGrid } from "@chakra-ui/react";
import { Meta } from "../components/meta";
import { Layout } from "../components/layout";
import { NewProjectCard } from "../components/projects/project-cards/new-project-card";
import type { Project as ProjectType } from "../graphql-types.generated";
import { ProjectCard } from "../components/projects/project-cards";

const getProjectsQuery = gql`
  query getProjects {
    projects {
      id
      name
      images {
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
      <Layout>
        <SimpleGrid
          gap={12}
          padding={12}
          minChildWidth="24rem"
          justifyItems="center"
        >
          <NewProjectCard />
          {projectsResult?.projects?.map(({ id, name, images }) => (
            <NextLink href={`/projects/${id}`} key={id}>
              <ProjectCard
                projectName={name}
                imageUrl="https://images.unsplash.com/photo-1579513141590-c597876aefbc?auto=format&fit=crop&w=882&q=80"
                imagesCount={0}
                labelClassesCount={0}
                labelsCount={0}
                editProject={() => {}}
                deleteProject={() => {}}
              />
            </NextLink>
          ))}
        </SimpleGrid>
      </Layout>
    </>
  );
};

export default ProjectPage;
