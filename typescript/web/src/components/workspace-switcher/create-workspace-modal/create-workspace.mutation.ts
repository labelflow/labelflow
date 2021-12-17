import {
  ApolloCache,
  ApolloError,
  DefaultContext,
  gql,
  MutationTuple,
  OperationVariables,
  useMutation,
} from "@apollo/client";
import { Mutation } from "@labelflow/graphql-types";
import { isNil } from "lodash/fp";
import { useRouter } from "next/router";
import { useCallback } from "react";
import { useQueryParam } from "use-query-params";
import { BoolParam } from "../../../utils/query-param-bool";
import { useApolloError } from "../../error-handlers";

export const CREATE_WORKSPACE_MUTATION = gql`
  mutation createWorkspace($name: String!) {
    createWorkspace(data: { name: $name }) {
      id
      slug
    }
  }
`;

type CreateWorkspaceMutationResult = Pick<Mutation, "createWorkspace">;

const isAuthenticationError = (error: ApolloError) => {
  return (
    !isNil(error.networkError) &&
    "result" in error.networkError &&
    error.networkError.result.errors[0].message ===
      "Couldn't create workspace: No user id"
  );
};

const useCreateWorkspaceMutationError = () => {
  const onError = useApolloError();
  const setSignInModalOpen = useQueryParam("modal-signin", BoolParam)[1];
  return useCallback(
    (error: ApolloError) => {
      if (isAuthenticationError(error)) {
        setSignInModalOpen(true, "replaceIn");
      } else {
        onError(error);
      }
    },
    [onError, setSignInModalOpen]
  );
};

const useCreateWorkspaceMutationCompleted = () => {
  const router = useRouter();
  return useCallback(
    ({ createWorkspace }: CreateWorkspaceMutationResult) => {
      if (!isNil(createWorkspace)) {
        router.push(`/${createWorkspace.slug}`);
      }
    },
    [router]
  );
};

export function useCreateWorkspace(
  workspaceName: string
): MutationTuple<
  CreateWorkspaceMutationResult,
  OperationVariables,
  DefaultContext,
  ApolloCache<unknown>
> {
  const onError = useCreateWorkspaceMutationError();
  const onCompleted = useCreateWorkspaceMutationCompleted();
  return useMutation<CreateWorkspaceMutationResult>(CREATE_WORKSPACE_MUTATION, {
    variables: { name: workspaceName },
    refetchQueries: ["getWorkspaces"],
    onCompleted,
    onError,
  });
}
