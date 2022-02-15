import { Story } from "@storybook/react";
import { TestWrapper, TestWrapperProps } from "../tests/test-wrapper";

export const createTestWrapperDecorator =
  (options: Omit<TestWrapperProps, "children">) => (StoryComponent: Story) =>
    (
      <TestWrapper {...options}>
        <StoryComponent />
      </TestWrapper>
    );
