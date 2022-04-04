import { Button, Flex, HStack } from "@chakra-ui/react";
import { Story } from "@storybook/react";
import React from "react";
import { BASIC_DATASET_DATA, WORKSPACE_DATA } from "../../../utils/fixtures";
import { createCommonDecorator, storybookTitle } from "../../../utils/stories";
import { ImageNavigationTool } from "./image-navigation-tool";
import { APOLLO_MOCKS } from "./image-navigation-tool.fixtures";

const datasetId = "2e5e2ff4-7be3-4371-a6de-1ebbe71c90b9";

const images = [
  {
    id: "5ec44f0f-11ec-454d-a198-607eddbc801c",
    name: "Hello puffin 1",
    url: "https://images.unsplash.com/photo-1612564148954-59545876eaa0?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "a63d2bb6-5ad1-46f1-8a3d-a9bed96067d7",
    name: "Hello puffin 2",
    url: "https://images.unsplash.com/photo-1580629905303-faaa03202631?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "cb340d03-be7a-4b2e-b0db-bf2f521998c0",
    name: "Hello puffin 3",
    url: "https://images.unsplash.com/photo-1490718720478-364a07a997cd?auto=format&fit=crop&w=600&q=80",
  },
];

export default {
  title: storybookTitle("Labeling tool", ImageNavigationTool),
  component: ImageNavigationTool,
  // FIXME SW Images are not loaded anymore
  // loaders: [mockImagesLoader],
  decorators: [
    createCommonDecorator({
      auth: { withWorkspaces: true },
      apollo: { extraMocks: APOLLO_MOCKS },
      router: {
        query: {
          workspaceSlug: WORKSPACE_DATA.slug,
          datasetSlug: BASIC_DATASET_DATA.slug,
        },
      },
    }),
  ],
};

const Template: Story = () => (
  <HStack background="gray.100" padding={4} spacing={4}>
    <ImageNavigationTool />
    <Button variant="solid" background="white" color="gray.800">
      Button just to compare
    </Button>
    <Flex> </Flex>
  </HStack>
);

export const NoInput = Template.bind({});
NoInput.parameters = {
  nextRouter: {
    query: { datasetId, workspaceSlug: "local" },
  },
};

export const NoImage = Template.bind({});
NoImage.parameters = {
  mockImages: { datasetId, images: [] },
  nextRouter: {
    query: { imageId: "a", datasetId, workspaceSlug: "local" },
  },
};

export const NoImageNoId = Template.bind({});
NoImageNoId.parameters = {
  mockImages: { datasetId, images: [] },
  nextRouter: {
    query: { datasetId, workspaceSlug: "local" },
  },
};

export const OneImage = Template.bind({});
OneImage.parameters = {
  mockImages: {
    datasetId,
    datasetName: "dataset navigation one image",
    images: images.slice(0, 1),
  },
  nextRouter: {
    query: {
      imageId: images[0].id,
      datasetSlug: "dataset-navigation-one-image",
      workspaceSlug: "local",
    },
  },
};

export const OneWrongImage = Template.bind({});
OneWrongImage.parameters = {
  mockImages: {
    datasetId,
    datasetName: "dataset navigation wrong image",
    images: images.slice(1, 2),
  },
  nextRouter: {
    query: {
      imageId: "a",
      datasetSlug: "dataset-navigation-wrong-image",
      workspaceSlug: "local",
    },
  },
};

export const Basic1 = Template.bind({});
Basic1.parameters = {
  mockImages: { datasetId, datasetName: "dataset navigation basic1", images },
  nextRouter: {
    query: {
      imageId: images[0].id,
      datasetSlug: "dataset-navigation-basic1",
      workspaceSlug: "local",
    },
  },
};

export const Basic2 = Template.bind({});
Basic2.parameters = {
  mockImages: { datasetId, datasetName: "dataset navigation basic2", images },
  nextRouter: {
    query: {
      imageId: images[1].id,
      datasetSlug: "dataset-navigation-basic2",
      workspaceSlug: "local",
    },
  },
};

export const Basic3 = Template.bind({});
Basic3.parameters = {
  mockImages: { datasetId, datasetName: "dataset navigation basic3", images },
  nextRouter: {
    query: {
      imageId: images[2].id,
      datasetSlug: "dataset-navigation-basic3",
      workspaceSlug: "local",
    },
  },
};

export const BasicWrongImage = Template.bind({});
BasicWrongImage.parameters = {
  mockImages: {
    datasetId,
    datasetName: "dataset navigation wrong basic",
    images,
  },
  withImageIdInQueryStringRouter: { id: "d" },
  nextRouter: {
    query: {
      imageId: "wrong-id",
      datasetSlug: "dataset-navigation-wrong-basic",
      workspaceSlug: "local",
    },
  },
};
