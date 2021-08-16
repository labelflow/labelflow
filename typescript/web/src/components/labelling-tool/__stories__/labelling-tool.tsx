import { DecoratorFn, Story } from "@storybook/react";
import { Box } from "@chakra-ui/react";

import { chakraDecorator } from "../../../utils/chakra-decorator";
import { queryParamsDecorator } from "../../../utils/query-params-decorator";
import { apolloDecorator } from "../../../utils/apollo-decorator";

import { mockImagesLoader } from "../../../utils/mock-image-loader";
import { LabellingTool } from "../labelling-tool";

const datasetId = "233e2ff4-7be3-4371-a6de-1ebbe71c90b9";

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
    <Box background="gray.100" width="640px" height="480px">
      {storyFn()}
    </Box>
  );
}

export default {
  title: "web/Labelling Tool",
  component: LabellingTool,
  loaders: [mockImagesLoader],
  decorators: [
    inGreyBoxDecorator,
    queryParamsDecorator,
    chakraDecorator,
    apolloDecorator,
  ],
};

export const OneImage: Story = () => {
  return <LabellingTool />;
};
OneImage.parameters = {
  mockImages: { images: images.slice(0, 1) },
  nextRouter: {
    query: {
      imageId: images[0].id,
      datasetId,
    },
  },
};

export const ThreeImages: Story = () => {
  return <LabellingTool />;
};
ThreeImages.parameters = {
  mockImages: { images },
  nextRouter: {
    query: {
      imageId: images[0].id,
      datasetId,
    },
  },
};
