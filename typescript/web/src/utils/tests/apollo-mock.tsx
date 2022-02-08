import { PropsWithChildren } from "react";
import { MockedProvider } from "@apollo/client/testing";
import {
  MATCH_ANY_PARAMETERS,
  MockedResponses,
  WildcardMockedResponse,
  WildcardMockLink,
} from "wildcard-mock-link";
import {
  ApolloClient,
  FetchResult,
  GraphQLRequest,
  InMemoryCache,
  NormalizedCacheObject,
} from "@apollo/client";
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

export type ApolloClientWithMockLink = {
  client: ApolloClient<NormalizedCacheObject>;
  link: WildcardMockLink;
};

export const getApolloMockLink = (
  mocks?: ApolloMockResponse<object, object>[]
) =>
  new WildcardMockLink((mocks ?? []) as MockedResponses, {
    addTypename: true,
    act,
  });

export const getApolloMockClient = (
  data?: WildcardMockLink | ApolloMockResponse<object, object>[]
): ApolloClientWithMockLink => {
  const link =
    data instanceof WildcardMockLink ? data : getApolloMockLink(data);
  return {
    client: new ApolloClient({ link, cache: new InMemoryCache() }),
    link,
  };
};

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
