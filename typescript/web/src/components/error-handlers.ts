import { ApolloError } from "@apollo/client";
import { useCallback } from "react";
import { useApolloErrorToast } from "./toast";

/**
 * Hook returning a generic handler for apollo errors
 */
export const useApolloError = () => {
  const toast = useApolloErrorToast();
  return useCallback(
    (error: ApolloError) => {
      toast(error);
      // eslint-disable-next-line no-console
      console.error("Apollo error", JSON.stringify(error, undefined, "  "));
    },
    [toast]
  );
};
