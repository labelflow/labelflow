import { PropsWithChildren } from "react";
import { PartialDeep } from "type-fest";
import {
  ApolloCache,
  ApolloLink,
  DefaultOptions,
  Resolvers,
} from "@apollo/client/core";
import {
  MockedProvider,
  MockedProviderProps,
  MockedResponse,
} from "@apollo/client/testing";
import { Mutation, Query } from "@labelflow/graphql-types";

export type ApolloMockedResponse = MockedResponse<
  PartialDeep<Query | Mutation>
>;

export interface ApolloMockedProviderProps<TSerializedCache = {}>
  extends MockedProviderProps {
  mocks?: ReadonlyArray<ApolloMockedResponse>;
  addTypename?: boolean;
  defaultOptions?: DefaultOptions;
  cache?: ApolloCache<TSerializedCache>;
  resolvers?: Resolvers;
  childProps?: object;
  children?: any;
  link?: ApolloLink;
}

export class ApolloMockedProvider extends MockedProvider {
  // eslint-disable-next-line @typescript-eslint/no-useless-constructor
  constructor(props: ApolloMockedProviderProps) {
    super(props);
  }
}

export const getApolloMockWrapper =
  (mockQueries?: ReadonlyArray<ApolloMockedResponse>) =>
  ({ children }: PropsWithChildren<{}>) =>
    <ApolloMockedProvider mocks={mockQueries}>{children}</ApolloMockedProvider>;
