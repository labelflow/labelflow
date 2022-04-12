import { ComponentMeta, ComponentStory } from "@storybook/react";
import { AddClassesModal as AddClassesModalComponent } from ".";
import {
  chakraDecorator,
  CYPRESS_SCREEN_WIDTH,
  fixedScreenDecorator,
  getApolloMockDecorator,
  storybookTitle,
} from "../../../utils/stories";

export default {
  title: storybookTitle("Dataset classes", AddClassesModalComponent),
  component: AddClassesModalComponent,
  decorators: [chakraDecorator, fixedScreenDecorator, getApolloMockDecorator()],
  parameters: { chromatic: { viewports: [CYPRESS_SCREEN_WIDTH] } },
} as ComponentMeta<typeof AddClassesModalComponent>;

const Template: ComponentStory<typeof AddClassesModalComponent> =
  AddClassesModalComponent;

export const AddClassesModal = Template.bind({});
AddClassesModal.args = { isOpen: true };
