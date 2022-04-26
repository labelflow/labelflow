import { ComponentMeta, ComponentStory } from "@storybook/react";
import { BASIC_DATASET_DATA } from "../../utils/fixtures";
import {
  createCommonDecorator,
  CYPRESS_SCREEN_WIDTH,
  fixedScreenDecorator,
  storybookTitle,
} from "../../utils/stories";
import { DeleteManyImagesModal } from "./delete-many-images-modal";
import { APOLLO_MOCKS, TestWrapper, TEST_IMAGE } from "./images-list.fixtures";

export default {
  title: storybookTitle("Dataset images", DeleteManyImagesModal),
  component: DeleteManyImagesModal,
  decorators: [
    createCommonDecorator({
      auth: { withWorkspaces: true },
      router: {
        query: {
          workspaceSlug: BASIC_DATASET_DATA.workspace.slug,
          datasetSlug: BASIC_DATASET_DATA.slug,
        },
      },
      apollo: { extraMocks: APOLLO_MOCKS },
    }),
    fixedScreenDecorator,
  ],
  parameters: { chromatic: { viewports: [CYPRESS_SCREEN_WIDTH] } },
} as ComponentMeta<typeof DeleteManyImagesModal>;

export const SingleSelected: ComponentStory<typeof DeleteManyImagesModal> = (
  args
) => (
  <TestWrapper selected={[TEST_IMAGE.id]}>
    <DeleteManyImagesModal {...args} />
  </TestWrapper>
);
SingleSelected.args = { isOpen: true };

export const ManySelected: ComponentStory<typeof DeleteManyImagesModal> = (
  args
) => (
  <TestWrapper
    selected={[TEST_IMAGE.id, "66671153-4316-4e5b-8d4e-02fbd8c4507b"]}
  >
    <DeleteManyImagesModal {...args} />
  </TestWrapper>
);
ManySelected.args = { isOpen: true };
