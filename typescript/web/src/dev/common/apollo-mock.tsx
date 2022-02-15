import {
  ApolloClient,
  FetchResult,
  GraphQLRequest,
  InMemoryCache,
  NormalizedCacheObject,
} from "@apollo/client";
import { MockedProvider } from "@apollo/client/testing";
import { PropsWithChildren } from "react";
import {
  MATCH_ANY_PARAMETERS,
  MockedResponses,
  WildcardMockedResponse,
  WildcardMockLink,
  WildcardMockLinkOptions,
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

export type ApolloClientWithMockLink = {
  client: ApolloClient<NormalizedCacheObject>;
  link: WildcardMockLink;
};

export const getApolloMockLink = (
  mocks?: ApolloMockResponse<object, object>[],
  act?: WildcardMockLinkOptions["act"]
) =>
  new WildcardMockLink((mocks ?? []) as MockedResponses, {
    addTypename: true,
    act,
  });

export const getApolloMockClient = (
  data?: WildcardMockLink | ApolloMockResponse<object, object>[],
  act?: WildcardMockLinkOptions["act"]
): ApolloClientWithMockLink => {
  const link =
    data instanceof WildcardMockLink ? data : getApolloMockLink(data, act);
  return {
    client: new ApolloClient({ link, cache: new InMemoryCache() }),
    link,
  };
};

export const getApolloMockWrapper =
  (
    data?: WildcardMockLink | ApolloMockResponse<object, object>[],
    act?: WildcardMockLinkOptions["act"]
  ) =>
  ({ children }: PropsWithChildren<{}>) =>
    (
      <MockedProvider
        link={
          data instanceof WildcardMockLink ? data : getApolloMockLink(data, act)
        }
      >
        {children}
      </MockedProvider>
    );
