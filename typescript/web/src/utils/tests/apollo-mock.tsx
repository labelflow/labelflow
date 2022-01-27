import { PropsWithChildren } from "react";
import { MockedProvider } from "@apollo/client/testing";
import {
  GraphQLVariables,
  MATCH_ANY_PARAMETERS,
  WildcardMockedResponse,
  WildcardMockLink,
} from "wildcard-mock-link";
import { FetchResult, GraphQLRequest } from "@apollo/client";
import { act } from "@testing-library/react";

export interface ApolloMockResponse<
  TVariables extends Record<string, any> = Record<string, any>,
  TData extends Record<string, any> = Record<string, any>
> extends WildcardMockedResponse {
  request: Omit<GraphQLRequest, "variables"> & {
    variables?: TVariables | typeof MATCH_ANY_PARAMETERS;
  };
  result?:
    | FetchResult<TData>
    | ((variables?: TVariables | GraphQLVariables) => FetchResult<TData>);
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
