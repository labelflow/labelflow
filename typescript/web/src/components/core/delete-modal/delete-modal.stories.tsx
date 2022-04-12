import { ComponentMeta, ComponentStory } from "@storybook/react";
import {
  chakraDecorator,
  CYPRESS_SCREEN_WIDTH,
  fixedScreenDecorator,
  storybookTitle,
} from "../../../utils/stories";
import { DeleteModal as DeleteModalComponent } from "./delete-modal";

const meta: ComponentMeta<typeof DeleteModalComponent> = {
  title: storybookTitle("Core", DeleteModalComponent),
  component: DeleteModalComponent,
  decorators: [chakraDecorator, fixedScreenDecorator],
  parameters: { chromatic: { viewports: [CYPRESS_SCREEN_WIDTH] } },
};

export default meta;

const Template: ComponentStory<typeof DeleteModalComponent> = (args) => (
  <DeleteModalComponent {...args} />
);

export const Default = Template.bind({});
Default.args = {
  isOpen: true,
  header: "Delete FooBar",
  body: "Are you sure that you want to delete this resource?",
};

export const Deleting = Template.bind({});
Deleting.args = {
  ...Default.args,
  deleting: true,
};
Deleting.parameters = { chromatic: { disableSnapshot: true } };
