import { ComponentMeta, ComponentStory } from "@storybook/react";
import React from "react";
import {
  chakraDecorator,
  getApolloMockDecorator,
  modalDecorator,
  storybookTitle,
} from "../../utils/stories";
import { DeleteLabelClassModal as DeleteLabelClassModalComponent } from "./delete-label-class-modal";
import {
  APOLLO_MOCKS,
  TestComponent,
} from "./delete-label-class-modal.fixtures";

export default {
  title: storybookTitle("Dataset classes", DeleteLabelClassModalComponent),
  component: DeleteLabelClassModalComponent,
  decorators: [
    chakraDecorator,
    modalDecorator,
    getApolloMockDecorator(APOLLO_MOCKS),
  ],
} as ComponentMeta<typeof DeleteLabelClassModalComponent>;

const Template: ComponentStory<typeof TestComponent> = (args) => (
  <TestComponent {...args} />
);

export const DeleteLabelClassModal = Template.bind({});
