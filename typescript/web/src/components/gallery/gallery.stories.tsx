import { HStack } from "@chakra-ui/react";
import { Story } from "@storybook/react";
import { BASIC_DATASET_DATA, WORKSPACE_DATA } from "../../utils/fixtures";
import imageSampleCollection from "../../utils/image-sample-collection";
import { createCommonDecorator, storybookTitle } from "../../utils/stories";
import { Gallery } from "./gallery";

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
  title: storybookTitle(Gallery),
  component: Gallery,
  // FIXME SW Images are not loaded anymore
  // loaders: [mockImagesLoader],
  decorators: [
    createCommonDecorator({
      auth: { withWorkspaces: true },
      apollo: true,
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
    <Gallery />
  </HStack>
);

export const Images = Template.bind({});
Images.parameters = {
  mockImages: { datasetId, datasetName: "dataset gallery", images },
  nextRouter: {
    query: {
      imageId: images[0].id,
      datasetSlug: "dataset-gallery",
      workspaceSlug: "local",
    },
  },
};
