import { ApolloError } from "@apollo/client";
import {
  AlertStatus,
  useToast as useChakraToast,
  UseToastOptions as UseChakraToastOptions,
} from "@chakra-ui/react";
import { isNil } from "lodash/fp";
import { useCallback } from "react";
import { getApolloErrorMessage } from "../utils/get-apollo-error-message";

export type ToastFnParameters =
  | [UseChakraToastOptions]
  | [string, string, AlertStatus]
  | [];

export type StatusToastFnParameters =
  | [Omit<UseChakraToastOptions, "status">]
  | [string, string]
  | [];

const getToastOptions = ([titleOrOptions, ...args]:
  | ToastFnParameters
  | StatusToastFnParameters): UseChakraToastOptions => {
  if (isNil(titleOrOptions)) return {};
  if (typeof titleOrOptions === "object") return titleOrOptions;
  const [description, status] = args;
  return { title: titleOrOptions, description, status };
};

/**
 * Returns a toast reusable across the application
 */
export const useToast = (...hookArgs: ToastFnParameters) => {
  const toastOptions = getToastOptions(hookArgs);
  const toast = useChakraToast({
    // Make description actually optional since when title is **not** empty:
    // * Title is hidden if description is `undefined`
    // * Title is shown if description is an empty string
    description: "",
    ...toastOptions,
  });
  return useCallback(
    (...fnArgs: ToastFnParameters) => {
      const fnOptions = getToastOptions(fnArgs);
      return toast({
        isClosable: true,
        position: "bottom-right",
        duration: 10000,
        ...fnOptions,
      });
    },
    [toast]
  );
};

const useStatusToast = (
  status: AlertStatus,
  hookArgs: StatusToastFnParameters = [{}]
) => {
  const hookOptions = getToastOptions(hookArgs);
  const toast = useToast({ ...hookOptions, status });
  return useCallback(
    (...args: StatusToastFnParameters) => {
      const fnOptions = getToastOptions(args);
      return toast(fnOptions);
    },
    [toast]
  );
};

/** Returns a successful toast reusable across the application */
export const useSuccessToast = (...hookArgs: StatusToastFnParameters) =>
  useStatusToast("success", hookArgs);

/**
 * Returns an error toast reusable across the application
 */
export const useErrorToast = (...hookArgs: StatusToastFnParameters) =>
  useStatusToast("error", hookArgs);

/**
 * Returns an apollo error toast reusable across the application
 */
export const useApolloErrorToast = (...hookArgs: StatusToastFnParameters) => {
  const toast = useErrorToast(...hookArgs);
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
