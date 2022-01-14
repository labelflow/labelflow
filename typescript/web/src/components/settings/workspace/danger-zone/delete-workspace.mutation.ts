import { ApolloCache, gql, useMutation } from "@apollo/client";
import { Mutation } from "@labelflow/graphql-types";
import { useRouter } from "next/router";
import { useCallback } from "react";
import { useApolloErrorToast } from "../../../toast";
import { useWorkspaceSettings } from "../context";

const DELETE_WORKSPACE_MUTATION = gql`
  mutation deleteWorkspace($slug: String!) {
    deleteWorkspace(where: { slug: $slug }) {
      deletedAt
    }
  }
`;

const useDeleteWorkspaceMutationUpdate = (workspaceId: string | undefined) => {
  return useCallback(
    (cache: ApolloCache<unknown>) => {
      if (!workspaceId) return;
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
  const workspace = useWorkspaceSettings();
  const update = useDeleteWorkspaceMutationUpdate(workspace?.id);
  const onCompleted = useDeleteWorkspaceMutationComplete();
  const onError = useApolloErrorToast();
  return useMutation<Pick<Mutation, "deleteWorkspace">>(
    DELETE_WORKSPACE_MUTATION,
    { variables: { slug: workspace?.slug }, update, onCompleted, onError }
  );
};
