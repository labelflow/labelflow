import { useQuery, gql } from "@apollo/client";
import NextLink from "next/link";
import {
  Text,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  chakra,
  Center,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { RiArrowRightSLine } from "react-icons/ri";
import type { Project as ProjectType } from "@labelflow/graphql-types";
import { KeymapButton } from "../../../../components/keymap-button";
import { ImportButton } from "../../../../components/import-button";
import { ExportButton } from "../../../../components/export-button";
import { Meta } from "../../../../components/meta";
import { Layout } from "../../../../components/layout";
import { ProjectTabBar } from "../../../../components/layout/tab-bar/project-tab-bar";
import { ClassesList } from "../../../../components/project-class-list";

const ArrowRightIcon = chakra(RiArrowRightSLine);

const projectNameQuery = gql`
  query getProjectName($projectId: ID!) {
    project(where: { id: $projectId }) {
      id
      name
    }
  }
`;

const ProjectClassesPage = () => {
  const router = useRouter();
  const projectId = router?.query?.projectId as string;

  const { data: projectResult } = useQuery<{
    project: { id: string; name: string };
  }>(projectNameQuery, {
    variables: {
      projectId,
    },
  });

  const projectName = projectResult?.project.name;

  return (
    <>
      <Meta title="Labelflow | Classes" />
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

            <BreadcrumbItem>
              <NextLink href={`/projects/${projectId}`}>
                <BreadcrumbLink>{projectName}</BreadcrumbLink>
              </NextLink>
            </BreadcrumbItem>

            <BreadcrumbItem isCurrentPage>
              <Text>Classes</Text>
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
        tabBar={<ProjectTabBar currentTab="classes" projectId={projectId} />}
      >
        <Center>
          <ClassesList projectId={projectId} />
        </Center>
      </Layout>
    </>
  );
};
export default ProjectClassesPage;
