import { MockedProvider as ApolloProvider } from "@apollo/client/testing";
import { Story } from "@storybook/react";
import { CreateWorkspaceModal } from "..";
import { chakraDecorator } from "../../../../utils/chakra-decorator";
import { queryParamsDecorator } from "../../../../utils/query-params-decorator";
import {
  WORKSPACE_EXISTS_MOCK_ALREADY_TAKEN_NAME,
  WORKSPACE_EXISTS_MOCK_TEST,
} from "../../../workspace-name-input/workspace-name-input.fixtures";

export default {
  title: "web/Workspace Switcher/Create Workspace Modal",
  decorators: [chakraDecorator, queryParamsDecorator],
};

const Template = () => (
  <ApolloProvider
    mocks={[
      WORKSPACE_EXISTS_MOCK_TEST,
      WORKSPACE_EXISTS_MOCK_ALREADY_TAKEN_NAME,
    ]}
  >
    <div>
      <CreateWorkspaceModal isOpen onClose={console.log} />
    </div>
  </ApolloProvider>
);

export const Open: Story = Template.bind({});

export const WithPreFilledText: Story = Template.bind({});

WithPreFilledText.parameters = {
  nextRouter: {
    asPath: "/?workspace-name=test",
  },
};

export const WithPreFilledTextAlreadyTaken: Story = Template.bind({});

WithPreFilledTextAlreadyTaken.parameters = {
  nextRouter: {
    asPath: "/?workspace-name=already-taken-name",
  },
};

export const WithPreFilledTextReservedWord: Story = Template.bind({});

WithPreFilledTextReservedWord.parameters = {
  nextRouter: {
    asPath: "/?workspace-name=Pricing",
  },
};

export const WithPreFilledTextInvalidCharacters: Story = Template.bind({});

WithPreFilledTextInvalidCharacters.parameters = {
  nextRouter: {
    asPath: "/?workspace-name=hello!",
  },
};
