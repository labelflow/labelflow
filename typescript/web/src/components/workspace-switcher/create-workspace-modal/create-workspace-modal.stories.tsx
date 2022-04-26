import { MockedProvider as ApolloProvider } from "@apollo/client/testing";
import { Story } from "@storybook/react";
import { CreateWorkspaceModal } from ".";
import { MockableLocationProvider } from "../../../utils/mockable-location";
import {
  chakraDecorator,
  queryParamsDecorator,
  storybookTitle,
} from "../../../utils/stories";
import { getApolloMockLink } from "../../../utils/tests";
import { GRAPHQL_MOCKS } from "../../workspace-name-input/workspace-name-input.fixtures";

export default {
  title: storybookTitle("Workspaces", CreateWorkspaceModal),
  decorators: [chakraDecorator, queryParamsDecorator],
};

const Template = () => (
  <ApolloProvider link={getApolloMockLink(GRAPHQL_MOCKS)}>
    <div>
      <MockableLocationProvider location="http://localhost">
        <CreateWorkspaceModal isOpen onClose={console.log} />
      </MockableLocationProvider>
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
