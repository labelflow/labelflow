import {
  ApolloCache,
  ApolloError,
  DefaultContext,
  gql,
  MutationTuple,
  useMutation,
} from "@apollo/client";
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
import { WorkspacePlan } from "../../../graphql-types";
import {
  CreateWorkspaceMutation,
  CreateWorkspaceMutationVariables,
} from "../../../graphql-types/CreateWorkspaceMutation";
import { USER_WITH_WORKSPACES_QUERY } from "../../../shared-queries/user.query";
import { BoolParam } from "../../../utils/query-param-bool";

const CREATE_WORKSPACE_MUTATION = gql`
  mutation CreateWorkspaceMutation($name: String!, $plan: WorkspacePlan) {
    createWorkspace(
      data: { name: $name, plan: $plan }
      options: { createTutorial: true }
    ) {
      id
      slug
    }
  }
`;

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
    ({ createWorkspace }: CreateWorkspaceMutation) => {
      if (!isNil(createWorkspace)) {
        router.push(`/${createWorkspace.slug}`);
      }
    },
    [router]
  );
};

export function useCreateWorkspaceMutation(
  workspaceName: string,
  plan: string
): MutationTuple<
  CreateWorkspaceMutation,
  CreateWorkspaceMutationVariables,
  DefaultContext,
  ApolloCache<unknown>
> {
  const [onError, isUpToDate] = useCreateWorkspaceMutationError(workspaceName);
  const onCompleted = useCreateWorkspaceMutationCompleted();
  const capitalizePlan = plan[0].toUpperCase() + plan.slice(1);
  const workspacePlan =
    capitalizePlan in WorkspacePlan
      ? WorkspacePlan[capitalizePlan as keyof typeof WorkspacePlan]
      : WorkspacePlan.Pro;
  const [createWorkspace, result] = useMutation<
    CreateWorkspaceMutation,
    CreateWorkspaceMutationVariables
  >(CREATE_WORKSPACE_MUTATION, {
    variables: { name: workspaceName, plan: workspacePlan },
    refetchQueries: [USER_WITH_WORKSPACES_QUERY],
    awaitRefetchQueries: true,
    onCompleted,
    onError,
  });
  return [
    createWorkspace,
    {
      ...result,
      called: result.called && isUpToDate,
      error: isUpToDate ? result.error : undefined,
    },
  ];
}
