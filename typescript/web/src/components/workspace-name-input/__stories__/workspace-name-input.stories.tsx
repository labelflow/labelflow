import { MockedProvider as ApolloProvider } from "@apollo/client/testing";
import {
  WorkspaceNameInput,
  WorkspaceNameInputProvider,
  WorkspaceNameMessage,
} from "..";
import { apolloDecorator } from "../../../utils/apollo-decorator";
import { chakraDecorator } from "../../../utils/chakra-decorator";
import { GRAPHQL_MOCKS } from "../workspace-name-input.fixtures";

export default {
  title: `web/${WorkspaceNameInput.name}`,
  component: WorkspaceNameInput,
  decorators: [chakraDecorator, apolloDecorator],
};

interface TemplateProps {
  defaultName?: string;
}

const Template = ({ defaultName }: TemplateProps) => (
  <ApolloProvider mocks={GRAPHQL_MOCKS}>
    <WorkspaceNameInputProvider defaultName={defaultName}>
      <WorkspaceNameInput />
      <WorkspaceNameMessage hideError={false} />
    </WorkspaceNameInputProvider>
  </ApolloProvider>
);

export const WithoutDefaultName = Template;

export const WithDefaultName = Template.bind({ defaultName: "default name" });
