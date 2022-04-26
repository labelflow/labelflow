import { ApolloError } from "@apollo/client";
import { isEmpty, isNil } from "lodash/fp";

const getApolloNetworkErrorMessage = (
  error: ApolloError["networkError"]
): string | undefined => {
  if (isNil(error)) return undefined;
  if ("result" in error) {
    // ServerError.result type is Record<string, any>
    const result = error.result as
      | { errors?: { message?: string }[] }
      | undefined;
    if (isNil(result) || isNil(result.errors)) return undefined;
    const firstMessage = result.errors.find(({ message }) => !isEmpty(message));
    if (!isNil(firstMessage)) return firstMessage.message;
  }
  return error.message;
};

/**
 * Tries to find the more meaningful error as possible from an ApolloError
 * @param error - The error to analyze
 */
export const getApolloErrorMessage = (error: ApolloError): string => {
  const { graphQLErrors, networkError } = error;
  if (!isEmpty(graphQLErrors)) return graphQLErrors[0].message;
  const networkMessage = getApolloNetworkErrorMessage(networkError);
  if (!isNil(networkMessage)) return networkMessage;
  return error.message;
};
