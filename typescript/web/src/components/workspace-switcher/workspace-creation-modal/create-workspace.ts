import {
  ApolloCache,
  ApolloError,
  DefaultContext,
  gql,
  MutationTuple,
  OperationVariables,
  useMutation,
} from "@apollo/client";
import { useToast, UseToastOptions } from "@chakra-ui/react";
import { Mutation } from "@labelflow/graphql-types";
import { useRouter } from "next/router";
import { useCallback } from "react";
import { useQueryParam } from "use-query-params";
import { BoolParam } from "../../../utils/query-param-bool";

export const createWorkspaceMutation = gql`
  mutation createWorkspace($name: String!) {
    createWorkspace(data: { name: $name }) {
      id
      slug
    }
  }
`;

type CreateWorkspaceMutationResult = Pick<Mutation, "createWorkspace">;

function getCreateWorkspaceMutationToastErrorOptions(
  caughtError: any
): UseToastOptions {
  const errorOptions: UseToastOptions =
    caughtError instanceof ApolloError
      ? {
          title: "Needs to be signed in",
          description:
            "Only signed-in users can to create and share Workspaces online, please sign in.",
          status: "info",
        }
      : {
          title: "Could not create workspace",
          description: caughtError?.message ?? caughtError,
          status: "error",
        };
  return {
    isClosable: true,
    position: "bottom-right",
    duration: 10000,
    ...errorOptions,
  };
}

function useCreateWorkspaceMutationError(): (error: unknown) => void {
  const toast = useToast();
  const setSigninModalOpen = useQueryParam("modal-signin", BoolParam)[1];
  return useCallback(
    (caughtError: any) => {
      const options: UseToastOptions =
        getCreateWorkspaceMutationToastErrorOptions(caughtError);
      toast(options);
      if (caughtError instanceof ApolloError) {
        setSigninModalOpen(true, "replaceIn");
      }
    },
    [setSigninModalOpen]
  );
}

export function useCreateWorkspace(
  workspaceName: string
): MutationTuple<
  CreateWorkspaceMutationResult,
  OperationVariables,
  DefaultContext,
  ApolloCache<unknown>
> {
  const router = useRouter();
  const onError = useCreateWorkspaceMutationError();
  const onCompleted = useCallback(
    ({ createWorkspace }: CreateWorkspaceMutationResult) => {
      if (createWorkspace) {
        router.push(`/${createWorkspace.slug}`);
      }
    },
    [router]
  );
  return useMutation<CreateWorkspaceMutationResult>(createWorkspaceMutation, {
    variables: { name: workspaceName },
    refetchQueries: ["getWorkspaces"],
    onCompleted,
    onError,
  });
}
