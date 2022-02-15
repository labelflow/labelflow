import { act } from "@testing-library/react";
import { WildcardMockLink } from "wildcard-mock-link";
import {
  ApolloClientWithMockLink,
  ApolloMockResponse,
  getApolloMockLink,
  getApolloMockClient,
  getApolloMockWrapper,
} from "../common";

export const getJestApolloMockLink = (
  mocks?: ApolloMockResponse<object, object>[]
) => getApolloMockLink(mocks, act);

export const getJestApolloMockClient = (
  data?: WildcardMockLink | ApolloMockResponse<object, object>[]
): ApolloClientWithMockLink => getApolloMockClient(data, act);

export const getJestApolloMockWrapper = (
  data?: WildcardMockLink | ApolloMockResponse<object, object>[]
) => getApolloMockWrapper(data, act);
