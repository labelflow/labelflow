import { ApolloError } from "@apollo/client";
import { AlertStatus, useToast as useChakraToast } from "@chakra-ui/react";
import { useCallback } from "react";
import { getApolloErrorMessage } from "../utils/get-apollo-error-message";

/**
 * Returns a toast reusable across the application
 */
export const useToast = () => {
  const toast = useChakraToast();
  return useCallback(
    (title: string, description: string, status: AlertStatus) =>
      toast({
        title,
        description,
        status,
        isClosable: true,
        position: "bottom-right",
        duration: 10000,
      }),
    [toast]
  );
};

/**
 * Returns an error toast reusable across the application
 */
export const useErrorToast = () => {
  const toast = useToast();
  return useCallback(
    (title: string, description: string) => toast(title, description, "error"),
    [toast]
  );
};

/**
 * Returns an apollo error toast reusable across the application
 */
export const useApolloErrorToast = () => {
  const toast = useErrorToast();
  return useCallback(
    (error: ApolloError) => {
      toast(
        "Error while contacting the GraphQL server",
        getApolloErrorMessage(error)
      );
    },
    [toast]
  );
};
