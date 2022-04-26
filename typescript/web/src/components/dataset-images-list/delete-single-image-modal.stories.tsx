import { ComponentMeta, ComponentStory } from "@storybook/react";
import { BASIC_DATASET_DATA } from "../../utils/fixtures";
import {
  createCommonDecorator,
  CYPRESS_SCREEN_WIDTH,
  fixedScreenDecorator,
  storybookTitle,
} from "../../utils/stories";
import { DeleteSingleImageModal as DeleteSingleImageModalComponent } from "./delete-single-image-modal";
import { APOLLO_MOCKS, TestWrapper, TEST_IMAGE } from "./images-list.fixtures";

export default {
  title: storybookTitle("Dataset images", DeleteSingleImageModalComponent),
  component: DeleteSingleImageModalComponent,
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
} as ComponentMeta<typeof DeleteSingleImageModalComponent>;

const Template: ComponentStory<typeof DeleteSingleImageModalComponent> = (
  args
) => (
  <TestWrapper singleToDelete={TEST_IMAGE.id}>
    <DeleteSingleImageModalComponent {...args} />
  </TestWrapper>
);

export const DeleteSingleImageModal = Template.bind({});
DeleteSingleImageModal.args = { isOpen: true };
