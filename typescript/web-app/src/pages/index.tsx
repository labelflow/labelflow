import { useEffect } from "react";
import { Spinner, Center } from "@chakra-ui/react";
import { gql, useQuery } from "@apollo/client";
import { useRouter } from "next/router";
import { Layout } from "../components/layout";

const projectsQuery = gql`
  query getProjects {
    projects {
      id
      name
      images {
        id
      }
    }
  }
`;

const IndexPage = () => {
  const router = useRouter();

  const { data: projectsData } =
    useQuery<{
      projects: { id: string; name: string; images: { id: string }[] }[];
    }>(projectsQuery);

  useEffect(() => {
    const isFirstVisit = localStorage.getItem("isFirstVisit") !== "false";
    if (!isFirstVisit) {
      router.replace({ pathname: "/projects", query: router.query });
    }
    if (isFirstVisit && projectsData != null && projectsData.projects != null) {
      // This is the first visit of the user and the projects query returned, redirect to demo project
      const demoProject =
        projectsData.projects.filter(
          (project) => project.name === "Demo project"
        )?.[0] ?? undefined;
      const demoProjectId = demoProject?.id ?? "";
      const firstImageId = demoProject?.images?.[0]?.id;
      const route =
        firstImageId != null
          ? `/projects/${demoProjectId}/images/${firstImageId}`
          : `/projects/${demoProjectId}`;
      router.replace({ pathname: route, query: router.query });
      localStorage.setItem("isFirstVisit", "false");
    }
  }, [projectsData]);

  return (
    <Layout>
      <Center h="full">
        <Spinner size="xl" />
      </Center>
    </Layout>
  );
};

export default IndexPage;
