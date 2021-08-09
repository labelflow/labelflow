import { useCallback, useEffect } from "react";
import { gql, useQuery } from "@apollo/client";
import { useRouter } from "next/router";
import { GetServerSideProps } from "next";
import { Flex, Breadcrumb, BreadcrumbItem, Text } from "@chakra-ui/react";
import { RiArrowRightSLine } from "react-icons/ri";
import { useQueryParam } from "use-query-params";
import { useCookie } from "next-cookie";

import type { Project as ProjectType } from "@labelflow/graphql-types";
import { Meta } from "../../components/meta";
import { Layout } from "../../components/layout";
import { IdParam, BoolParam } from "../../utils/query-param-bool";
import { NewProjectCard, ProjectCard } from "../../components/projects";

import { UpsertProjectModal } from "../../components/projects/upsert-project-modal";
import { DeleteProjectModal } from "../../components/projects/delete-project-modal";

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

const ProjectPage = ({ cookie }: { cookie: string }) => {
  const router = useRouter();

  const { data: projectsResult, loading } =
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
  const [deleteProjectId, setDeleteProjectId] = useQueryParam(
    "alert-delete-project",
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

  const parsedCookie = useCookie(cookie);

  useEffect(() => {
    const didVisitDemoProject = parsedCookie.get("didVisitDemoProject");

    if (
      !didVisitDemoProject &&
      projectsResult?.projects != null &&
      loading === false
    ) {
      // This is the first visit of the user and the projects query returned, redirect to demo project
      const demoProject =
        projectsResult.projects.filter(
          (project) => project.name === "Demo project"
        )?.[0] ?? undefined;
      const demoProjectId = demoProject?.id ?? "";
      const firstImageId = demoProject?.images?.[0]?.id;

      if (firstImageId != null) {
        const route = `/projects/${demoProjectId}/images/${firstImageId}`;
        router.replace({ pathname: route, query: router.query });
      }

      parsedCookie.set("didVisitDemoProject", true);
    }
  }, [projectsResult, parsedCookie, loading]);

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

        <DeleteProjectModal
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
                deleteProject={() => {
                  setDeleteProjectId(id, "replaceIn");
                }}
              />
            )
          )}
        </Flex>
      </Layout>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  return {
    props: {
      cookie: context.req.headers.cookie || "",
    },
  };
};

export default ProjectPage;
