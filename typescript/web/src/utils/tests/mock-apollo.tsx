import { PropsWithChildren } from "react";
import { PartialDeep } from "type-fest";
import { MockedProvider } from "@apollo/client/testing";
import {
  GraphQLVariables,
  WildcardMockedResponse,
  WildcardMockLink,
} from "wildcard-mock-link";
import { Mutation, Query } from "@labelflow/graphql-types";
import { FetchResult } from "@apollo/client";
import { act } from "@testing-library/react";
import { Story } from "@storybook/react";

declare type ApolloQueryResult = PartialDeep<Query | Mutation>;

export interface MockedApolloResponse extends WildcardMockedResponse {
  result?:
    | FetchResult<ApolloQueryResult>
    | ((variables?: GraphQLVariables) => FetchResult<ApolloQueryResult>);
}

export type ApolloMocks = Record<string, MockedApolloResponse>;

export const getMockApolloLink = (mocks?: ApolloMocks) =>
  new WildcardMockLink(mocks ? Object.values(mocks) : [], {
    addTypename: true,
    act,
  });

export const getMockApolloWrapper =
  (data?: WildcardMockLink | ApolloMocks) =>
  ({ children }: PropsWithChildren<{}>) =>
    (
      <MockedProvider
        link={data instanceof WildcardMockLink ? data : getMockApolloLink(data)}
      >
        {children}
      </MockedProvider>
    );

export const getMockApolloDecorator =
  (data?: WildcardMockLink | ApolloMocks) => (StoryComponent: Story) => {
    const Wrapper = getMockApolloWrapper(data);
    return (
      <Wrapper>
        <StoryComponent />
      </Wrapper>
    );
  };
