import { Story } from "@storybook/react";
import { LayoutSpinner as LayoutSpinnerComponent } from ".";
import { chakraDecorator, storybookTitle } from "../../../utils/stories";
import { TestComponent, Wrapper } from "./layout-spinner.fixtures";

const testDecorator = (StoryComponent: Story) => (
  <Wrapper>
    <StoryComponent />
  </Wrapper>
);

export default {
  title: storybookTitle("Core", "Spinner", LayoutSpinnerComponent),
  component: LayoutSpinnerComponent,
  decorators: [chakraDecorator, testDecorator],
};

export const LayoutSpinner = () => <TestComponent />;

LayoutSpinner.parameters = {
  chromatic: { disableSnapshot: true },
};
