import { gql, useQuery } from "@apollo/client";

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
import { UpsertProjectDelete } from "../../components/projects/upsert-project-delete";

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

  const [isCreatingProject, setIsCreatingProject] = useQueryParam(
    "modal-create-project",
    BoolParam
  );
  const [editProjectId, setEditProjectId] = useQueryParam(
    "modal-edit-project",
    IdParam
  );
  const [deleteProjectId, setDeleteProjectId] = useQueryParam(
    "alert-edit-project",
    IdParam
  );

  const onClose = useCallback(() => {
    if (editProjectId) {
      setEditProjectId(null, "replaceIn");
    }

    if (isCreatingProject) {
      setIsCreatingProject(false, "replaceIn");
    }

    if (deleteProjectId) {
      setDeleteProjectId(null, "replaceIn");
    }
  }, [editProjectId, isCreatingProject, deleteProjectId]);

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

        <UpsertProjectDelete
          isOpen={deleteProjectId != null}
          onClose={onClose}
          projectId={deleteProjectId}
        />

        <Flex direction="row" wrap="wrap" p={4}>
          <NewProjectCard
            addProject={() => {
              setIsCreatingProject(true, "replaceIn");
            }}
          />

          {projectsResult?.projects?.map(({ id, name }) => (
            <ProjectCard
              key={id}
              url={`/projects/${id}`}
              projectName={name}
              imagesCount={0}
              labelClassesCount={0}
              labelsCount={0}
              editProject={() => {
                setEditProjectId(id, "replaceIn");
              }}
              deleteProject={() => {
                setDeleteProjectId(id, "replaceIn");
              }}
            />
          ))}
        </Flex>
      </Layout>
    </>
  );
};

export default ProjectPage;
