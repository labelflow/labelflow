import { withNextRouter } from "storybook-addon-next-router";

import { Box } from "@chakra-ui/react";
import { chakraDecorator } from "../../../utils/chakra-decorator";
import { apolloDecorator } from "../../../utils/apollo-decorator";
import { queryParamsDecorator } from "../../../utils/query-params-decorator";

import { ProjectCard } from "..";

export default {
  title: "web-app/Project Card",
  decorators: [
    chakraDecorator,
    apolloDecorator,
    queryParamsDecorator,
    withNextRouter,
  ],
};

const property = {
  imageUrl: "https://bit.ly/2Z4KKcF",
  imageAlt: "Rear view of modern home with pool",
  projectName: "A project name",
  imagesCount: 15,
  labelClassesCount: 10,
  labelsCount: 0,
  editProject: () => console.log("Edit project button click"),
  deleteProject: () => console.log("Delete project button click"),
};

const Template = (args: any) => (
  <Box background="gray.100" padding={4}>
    <ProjectCard {...args} />
  </Box>
);

export const Default = () => {
  return <Template {...property} />;
};

export const OverflowingValues = () => {
  return (
    <Template
      {...property}
      {...{
        projectName: "lkfhslkmhsefkvznlefksjpaieuraizerzier",
        imagesCount: 1588986473693642,
        labelClassesCount: 10870827847289374,
        labelsCount: 987837807389792,
      }}
    />
  );
};
