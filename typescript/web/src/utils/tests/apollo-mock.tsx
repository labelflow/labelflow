import { FetchResult, GraphQLRequest } from "@apollo/client";
import { MockedProvider } from "@apollo/client/testing";
import { act } from "@testing-library/react";
import { PropsWithChildren } from "react";
import {
  MATCH_ANY_PARAMETERS,
  MockedResponses,
  WildcardMockedResponse,
  WildcardMockLink,
} from "wildcard-mock-link";

export type ApolloMockResponseResult<TData, TVariables> =
  | FetchResult<TData>
  | ((variables: TVariables) => FetchResult<TData>);

export type ApolloMockResponse<TData, TVariables> = Omit<
  WildcardMockedResponse,
  "request" | "result"
> & {
  request: Omit<GraphQLRequest, "variables"> & {
    variables: TVariables | typeof MATCH_ANY_PARAMETERS;
  };
  result?: ApolloMockResponseResult<TData, TVariables>;
};

export type ApolloMockResponses = ApolloMockResponse<any, any>[];

export const getApolloMockLink = (
  mocks?: ApolloMockResponse<object, object>[]
) =>
  new WildcardMockLink((mocks ?? []) as MockedResponses, {
    addTypename: true,
    act,
  });

export const getApolloMockWrapper =
  (data?: WildcardMockLink | ApolloMockResponse<object, object>[]) =>
  ({ children }: PropsWithChildren<{}>) =>
    (
      <MockedProvider
        link={data instanceof WildcardMockLink ? data : getApolloMockLink(data)}
      >
        {children}
      </MockedProvider>
    );
