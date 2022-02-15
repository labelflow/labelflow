import { ApolloCache, gql, useMutation } from "@apollo/client";
import { useRouter } from "next/router";
import { useCallback } from "react";
import {
  DeleteWorkspaceMutation,
  DeleteWorkspaceMutationVariables,
} from "../../../../graphql-types/DeleteWorkspaceMutation";
import { USER_WITH_WORKSPACES_QUERY } from "../../../../shared-queries/user.query";
import { useApolloErrorToast } from "../../../toast";
import { useWorkspaceSettings } from "../context";

const DELETE_WORKSPACE_MUTATION = gql`
  mutation DeleteWorkspaceMutation($slug: String!) {
    deleteWorkspace(where: { slug: $slug }) {
      id
    }
  }
`;

const useDeleteWorkspaceMutationUpdate = (workspaceId: string) => {
  return useCallback(
    (cache: ApolloCache<unknown>) => {
      cache.evict({ id: `Workspace:${workspaceId}` });
    },
    [workspaceId]
  );
};

const useDeleteWorkspaceMutationComplete = () => {
  const router = useRouter();
  return useCallback(() => {
    router.push(`/`);
  }, [router]);
};

export const useDeleteWorkspaceMutation = () => {
  const { id, slug } = useWorkspaceSettings();
  const update = useDeleteWorkspaceMutationUpdate(id);
  const onCompleted = useDeleteWorkspaceMutationComplete();
  const onError = useApolloErrorToast();
  return useMutation<DeleteWorkspaceMutation, DeleteWorkspaceMutationVariables>(
    DELETE_WORKSPACE_MUTATION,
    {
      variables: { slug },
      update,
      onCompleted,
      onError,
      refetchQueries: [USER_WITH_WORKSPACES_QUERY],
    }
  );
};
