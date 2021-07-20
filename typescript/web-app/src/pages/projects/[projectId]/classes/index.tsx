import { gql, useQuery } from "@apollo/client";
import NextLink from "next/link";
import {
  Text,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  chakra,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { RiArrowRightSLine } from "react-icons/ri";
import { KeymapButton } from "../../../../components/keymap-button";
import { ImportButton } from "../../../../components/import-button";
import { ExportButton } from "../../../../components/export-button";
import { Meta } from "../../../../components/meta";
import { Layout } from "../../../../components/layout";
import type { Project as ProjectType } from "../../../../graphql-types.generated";

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

const ClassesPage = () => {
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

            <BreadcrumbItem isCurrentPage>
              <Text>{projectName}</Text>
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
        tabs={[
          {
            name: "images",
            url: `/projects/${projectId}/images`,
            isActive: false,
          },
          {
            name: "classes",
            url: `/projects/${projectId}/classes`,
            isActive: true,
          },
        ]}
      >
        <></>
      </Layout>
    </>
  );
};

export default ClassesPage;
