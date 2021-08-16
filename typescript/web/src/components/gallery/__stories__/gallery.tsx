import { HStack } from "@chakra-ui/react";
import { Story } from "@storybook/react";

import { mockImagesLoader } from "../../../utils/mock-image-loader";

import { chakraDecorator } from "../../../utils/chakra-decorator";
import { apolloDecorator } from "../../../utils/apollo-decorator";

import { Gallery } from "../gallery";

import imageSampleCollection from "../../../utils/image-sample-collection";

const datasetId = "233e2e14-7be3-4371-a6de-1ebbe71c90b9";

function pad(num: number, size: number) {
  return `000000000${num}`.substr(-size);
}

const images = imageSampleCollection
  .slice(0, 15)
  .map((url: string, index: number) => ({
    id: `5ec44f0f-11ec-454d-a198-607eddbc${pad(index, 4)}`,
    name: `Hello ${index}`,
    url,
  }));

export default {
  title: "web/Gallery",
  component: Gallery,
  loaders: [mockImagesLoader],
  decorators: [chakraDecorator, apolloDecorator],
};

const Template: Story = () => (
  <HStack background="gray.100" padding={4} spacing={4}>
    <Gallery />
  </HStack>
);

export const Images = Template.bind({});
Images.parameters = {
  mockImages: { datasetId, images },
  nextRouter: {
    query: {
      imageId: images[0].id,
      datasetId,
    },
  },
};
