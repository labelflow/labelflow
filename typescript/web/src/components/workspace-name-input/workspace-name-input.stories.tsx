import { Heading } from "@chakra-ui/react";
import { WorkspaceNameInput } from ".";
import { apolloMockDecorator, storybookTitle } from "../../dev/stories";
import { TestComponent, TEST_CASES } from "./workspace-name-input.fixtures";

export default {
  title: storybookTitle(WorkspaceNameInput),
  decorators: [apolloMockDecorator],
};

export const Default = () => (
  <div>
    {Object.entries(TEST_CASES).map(([name, [props, expected]]) => (
      <>
        <Heading size="lg">{name}</Heading>
        <Heading size="md">Expected:</Heading>
        {expected}
        <Heading size="md">Actual:</Heading>
        <TestComponent storybook {...props} />
        <br />
      </>
    ))}
  </div>
);
