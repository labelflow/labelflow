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

declare type ApolloQueryResult = PartialDeep<Query | Mutation>;

export interface ApolloMockResponse extends WildcardMockedResponse {
  result?:
    | FetchResult<ApolloQueryResult>
    | ((variables?: GraphQLVariables) => FetchResult<ApolloQueryResult>);
}

export const getApolloMockLink = (mocks?: ApolloMockResponse[]) =>
  new WildcardMockLink(mocks ?? [], {
    addTypename: true,
    act,
  });

export const getApolloMockWrapper =
  (data?: WildcardMockLink | ApolloMockResponse[]) =>
  ({ children }: PropsWithChildren<{}>) =>
    (
      <MockedProvider
        link={data instanceof WildcardMockLink ? data : getApolloMockLink(data)}
      >
        {children}
      </MockedProvider>
    );
