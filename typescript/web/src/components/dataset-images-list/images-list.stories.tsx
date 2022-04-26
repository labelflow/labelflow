import { Flex } from "@chakra-ui/react";
import { ComponentMeta, ComponentStory } from "@storybook/react";
import {
  DEEP_DATASET_WITH_CLASSES_DATA,
  DEEP_DATASET_WITH_IMAGES_DATA,
} from "../../utils/fixtures";
import {
  CHROMATIC_VIEWPORTS,
  createCommonDecorator,
  storybookTitle,
} from "../../utils/stories";
import { ImagesList as ImagesListComponent } from "./images-list";
import { APOLLO_MOCKS } from "./images-list.fixtures";

export default {
  title: storybookTitle("Dataset images", ImagesListComponent),
  component: ImagesListComponent,
  decorators: [
    createCommonDecorator({
      auth: { withWorkspaces: true },
      router: {
        query: {
          workspaceSlug: DEEP_DATASET_WITH_IMAGES_DATA.workspace.slug,
          datasetSlug: DEEP_DATASET_WITH_IMAGES_DATA.slug,
        },
      },
      apollo: { extraMocks: APOLLO_MOCKS },
    }),
  ],
  parameters: {
    chromatic: { viewports: CHROMATIC_VIEWPORTS },
  },
} as ComponentMeta<typeof ImagesListComponent>;

const Template: ComponentStory<typeof ImagesListComponent> = (args) => (
  <Flex direction="column" minHeight="600px">
    <ImagesListComponent {...args} />
  </Flex>
);

export const WithImages = Template.bind({});
WithImages.args = {
  workspaceSlug: DEEP_DATASET_WITH_IMAGES_DATA.workspace.slug,
  datasetSlug: DEEP_DATASET_WITH_IMAGES_DATA.slug,
  datasetId: DEEP_DATASET_WITH_IMAGES_DATA.id,
  imagesTotalCount: DEEP_DATASET_WITH_IMAGES_DATA.images.length,
};

export const WithoutImages = Template.bind({});
WithoutImages.args = {
  workspaceSlug: DEEP_DATASET_WITH_CLASSES_DATA.workspace.slug,
  datasetSlug: DEEP_DATASET_WITH_CLASSES_DATA.slug,
  datasetId: DEEP_DATASET_WITH_CLASSES_DATA.id,
  imagesTotalCount: DEEP_DATASET_WITH_CLASSES_DATA.images.length,
};
