import { PropsWithChildren } from "react";
import { MockedProvider } from "@apollo/client/testing";
import {
  MATCH_ANY_PARAMETERS,
  MockedResponses,
  WildcardMockedResponse,
  WildcardMockLink,
} from "wildcard-mock-link";
import { FetchResult, GraphQLRequest } from "@apollo/client";
import { act } from "@testing-library/react";

export type ApolloMockResponse<TData, TVariables> = Omit<
  WildcardMockedResponse,
  "request" | "result"
> & {
  request: Omit<GraphQLRequest, "variables"> & {
    variables: TVariables | typeof MATCH_ANY_PARAMETERS;
  };
  result?: FetchResult<TData> | ((variables: TVariables) => FetchResult<TData>);
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
