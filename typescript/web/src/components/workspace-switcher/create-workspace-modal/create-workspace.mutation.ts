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
import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from "react";
import { useQueryParam } from "use-query-params";
import { BoolParam } from "../../../utils/query-param-bool";

export const CREATE_WORKSPACE_MUTATION = gql`
  mutation CreateWorkspaceMutation($name: String!) {
    createWorkspace(data: { name: $name }) {
      id
      slug
    }
  }
`;

export type CreateWorkspaceMutationResult = Pick<Mutation, "createWorkspace">;

const isAuthenticationError = (error: ApolloError) => {
  return (
    !isNil(error.networkError) &&
    "result" in error.networkError &&
    error.networkError.result.errors[0].message ===
      "Couldn't create workspace: No user id"
  );
};

type MutationErrorState = {
  showError: boolean;
  lastName?: string;
};

const useErrorState = (
  workspaceName: string
): [boolean, Dispatch<SetStateAction<MutationErrorState>>] => {
  const [{ showError, lastName }, setErrorState] = useState<MutationErrorState>(
    { showError: false }
  );
  useEffect(() => {
    if (showError && workspaceName !== lastName) {
      setErrorState({ showError: false });
    }
  }, [lastName, showError, workspaceName]);
  return [showError, setErrorState];
};

const useCreateWorkspaceMutationError = (
  workspaceName: string
): [(error: ApolloError) => void, boolean] => {
  const setSignInModalOpen = useQueryParam("modal-signin", BoolParam)[1];
  const [showError, setErrorState] = useErrorState(workspaceName);
  const onError = useCallback(
    (error: ApolloError) => {
      if (isAuthenticationError(error)) {
        setSignInModalOpen(true, "replaceIn");
      } else {
        setErrorState({ showError: true, lastName: workspaceName });
      }
    },
    [setSignInModalOpen, setErrorState, workspaceName]
  );
  return [onError, showError];
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

export function useCreateWorkspaceMutation(
  workspaceName: string
): MutationTuple<
  CreateWorkspaceMutationResult,
  OperationVariables,
  DefaultContext,
  ApolloCache<unknown>
> {
  const [onError, isUpToDate] = useCreateWorkspaceMutationError(workspaceName);
  const onCompleted = useCreateWorkspaceMutationCompleted();
  const [createWorkspace, result] = useMutation<CreateWorkspaceMutationResult>(
    CREATE_WORKSPACE_MUTATION,
    {
      variables: { name: workspaceName },
      refetchQueries: ["GetWorkspacesQuery"],
      onCompleted,
      onError,
    }
  );
  return [
    createWorkspace,
    {
      ...result,
      called: result.called && isUpToDate,
      error: isUpToDate ? result.error : undefined,
    },
  ];
}
