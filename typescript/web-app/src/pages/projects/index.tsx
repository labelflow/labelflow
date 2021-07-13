import gql from "graphql-tag";
import { useQuery } from "@apollo/client";
import { Flex, Breadcrumb, BreadcrumbItem, Text } from "@chakra-ui/react";
import { RiArrowRightSLine } from "react-icons/ri";
import { useQueryParam } from "use-query-params";
import { useCallback } from "react";

import { Meta } from "../../components/meta";
import { Layout } from "../../components/layout";
import { IdParam, BoolParam } from "../../utils/query-param-bool";
import { NewProjectCard, ProjectCard } from "../../components/projects";
import type { Project as ProjectType } from "../../graphql-types.generated";

import { UpsertProjectModal } from "../../components/projects/upsert-project-modal";

export const getProjectsQuery = gql`
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
    }>(getProjectsQuery);

  const [isCreatingProject, setIsCreatingProject] = useQueryParam(
    "modal-create-project",
    BoolParam
  );
  const [editProjectId, setEditProjectId] = useQueryParam(
    "modal-edit-project",
    IdParam
  );

  const onClose = useCallback(() => {
    if (editProjectId) {
      setEditProjectId(null, "replaceIn");
    }

    if (isCreatingProject) {
      setIsCreatingProject(false, "replaceIn");
    }
  }, [editProjectId, isCreatingProject]);

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
        <UpsertProjectModal
          isOpen={isCreatingProject || editProjectId != null}
          onClose={onClose}
          projectId={editProjectId}
        />

        <Flex direction="row" wrap="wrap" p={4}>
          <NewProjectCard
            addProject={() => {
              setIsCreatingProject(true, "replaceIn");
            }}
          />

          {projectsResult?.projects?.map(
            ({
              id,
              images,
              name,
              imagesAggregates,
              labelsAggregates,
              labelClassesAggregates,
            }) => (
              <ProjectCard
                key={id}
                url={`/projects/${id}`}
                imageUrl={images[0]?.url}
                projectName={name}
                imagesCount={imagesAggregates.totalCount}
                labelClassesCount={labelClassesAggregates.totalCount}
                labelsCount={labelsAggregates.totalCount}
                editProject={() => {
                  setEditProjectId(id, "replaceIn");
                }}
                deleteProject={() => {}}
              />
            )
          )}
        </Flex>
      </Layout>
    </>
  );
};

export default ProjectPage;
