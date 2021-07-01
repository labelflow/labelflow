import {
  Text,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
} from "@chakra-ui/react";
import { RiArrowRightSLine } from "react-icons/ri";
import NextLink from "next/link";
import { Meta } from "../../components/meta";
import { Layout } from "../../components/layout";

const ProjectPage = () => {
  const projectName = "super project";

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
      >
        <Text>Message bête</Text>
      </Layout>
    </>
  );
};

export default ProjectPage;
