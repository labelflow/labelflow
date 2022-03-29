import { ComponentMeta, ComponentStory } from "@storybook/react";
import { DEEP_DATASET_WITH_IMAGES_DATA } from "../../utils/fixtures";
import { createCommonDecorator, storybookTitle } from "../../utils/stories";
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
} as ComponentMeta<typeof ImagesListComponent>;

const Template: ComponentStory<typeof ImagesListComponent> =
  ImagesListComponent;

export const ImagesList = Template.bind({});
ImagesList.args = {
  workspaceSlug: DEEP_DATASET_WITH_IMAGES_DATA.workspace.slug,
  datasetSlug: DEEP_DATASET_WITH_IMAGES_DATA.slug,
  datasetId: DEEP_DATASET_WITH_IMAGES_DATA.id,
  imagesTotalCount: DEEP_DATASET_WITH_IMAGES_DATA.images.length,
};
