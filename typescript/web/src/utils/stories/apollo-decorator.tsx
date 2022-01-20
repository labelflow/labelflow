import {
  ApolloMockedProvider,
  ApolloMockedResponse,
} from "../tests/mock-apollo";

export const getApolloDecorator =
  (mockQueries?: ReadonlyArray<ApolloMockedResponse>) => (Story: any) =>
    (
      <ApolloMockedProvider mocks={mockQueries}>
        <Story />
      </ApolloMockedProvider>
    );

export const apolloDecorator = getApolloDecorator();
