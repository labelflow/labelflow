import { Story } from "@storybook/react";
import { LayoutSpinner } from "..";
import { chakraDecorator } from "../../../utils/chakra-decorator";
import { TestComponent, Wrapper } from "../layout-spinner.fixtures";

const testDecorator = (StoryComponent: Story) => (
  <Wrapper>
    <StoryComponent />
  </Wrapper>
);

export default {
  title: `web/Spinner/${LayoutSpinner.name}`,
  decorators: [chakraDecorator, testDecorator],
};

export const Default = () => <TestComponent />;

Default.parameters = {
  chromatic: { disableSnapshot: true },
};
