import { Story } from "@storybook/react";
import { LayoutSpinner } from ".";
import { storybookTitle } from "../../dev/stories";
import { TestComponent, Wrapper } from "./layout-spinner.fixtures";

const testDecorator = (StoryComponent: Story) => (
  <Wrapper>
    <StoryComponent />
  </Wrapper>
);

export default {
  title: storybookTitle("Spinner", LayoutSpinner),
  decorators: [testDecorator],
};

export const Default = () => <TestComponent />;

Default.parameters = {
  chromatic: { disableSnapshot: true },
};
