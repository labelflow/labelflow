import { Flex } from "@chakra-ui/react";
import { DecoratorFn, Story } from "@storybook/react";
import {
  BASIC_DATASET_DATA,
  BASIC_IMAGE_DATA,
  WORKSPACE_DATA,
} from "../../utils/fixtures";
import { createCommonDecorator, storybookTitle } from "../../utils/stories";
import { LabelingTool } from "./labeling-tool";

const datasetId = "233e8af4-7be3-4371-a6de-1ebbe71c90b9";

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

function inGreyBoxDecorator(
  storyFn: Parameters<DecoratorFn>[0]
): ReturnType<DecoratorFn> {
  return (
    <Flex direction="column" background="gray.100" width="640px" height="480px">
      {storyFn()}
    </Flex>
  );
}

export default {
  title: storybookTitle("Labeling tool", LabelingTool),
  component: LabelingTool,
  // FIXME SW Images are not loaded anymore
  // loaders: [mockImagesLoader],
  decorators: [
    inGreyBoxDecorator,
    createCommonDecorator({
      auth: { withWorkspaces: true },
      apollo: true,
      router: {
        query: {
          workspaceSlug: WORKSPACE_DATA.slug,
          datasetSlug: BASIC_DATASET_DATA.slug,
          imageId: BASIC_IMAGE_DATA.id,
        },
      },
    }),
  ],
};

export const OneImage: Story = () => {
  return <LabelingTool />;
};
OneImage.parameters = {
  mockImages: {
    datasetId,
    datasetName: "dataset labeling one image",
    images: images.slice(0, 1),
  },
  nextRouter: {
    query: {
      imageId: images[0].id,
      datasetSlug: "dataset-labeling-one-image",
      workspaceSlug: "local",
    },
  },
};

export const ThreeImages: Story = () => {
  return <LabelingTool />;
};
ThreeImages.parameters = {
  mockImages: {
    datasetId,
    datasetName: "dataset labeling three image",
    images,
  },
  nextRouter: {
    query: {
      imageId: images[0].id,
      datasetSlug: "dataset-labeling-three-image",
      workspaceSlug: "local",
    },
  },
};
