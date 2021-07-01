import { Meta } from "../components/meta";
import { Layout } from "../components/layout";
import { NewProjectCard } from "../components/projects/project-cards/new-project-card";

const ProjectPage = () => {
  return (
    <>
      <Meta title="Labelflow | Images" />
      <Layout>
        <NewProjectCard />
      </Layout>
    </>
  );
};

export default ProjectPage;
