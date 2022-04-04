import { ComponentMeta, ComponentStory } from "@storybook/react";
import { AddClassesModal as AddClassesModalComponent } from ".";
import {
  chakraDecorator,
  getApolloMockDecorator,
  modalDecorator,
  storybookTitle,
} from "../../../utils/stories";

export default {
  title: storybookTitle("Dataset classes", AddClassesModalComponent),
  component: AddClassesModalComponent,
  decorators: [chakraDecorator, modalDecorator, getApolloMockDecorator()],
} as ComponentMeta<typeof AddClassesModalComponent>;

const Template: ComponentStory<typeof AddClassesModalComponent> =
  AddClassesModalComponent;

export const AddClassesModal = Template.bind({});
AddClassesModal.args = { isOpen: true };
