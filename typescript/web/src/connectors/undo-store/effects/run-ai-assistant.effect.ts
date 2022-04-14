import { ApolloClient, ApolloError, gql } from "@apollo/client";
import { addTypenames } from "@labelflow/common-resolvers";
import { isNil } from "lodash/fp";
import {
  GET_IMAGE_LABELS_QUERY,
  GET_LABEL_CLASSES_OF_DATASET_QUERY,
} from "../../../components/labeling-tool/openlayers-map/queries";
import {
  DeleteManyLabelsByIdMutation,
  DeleteManyLabelsByIdMutationVariables,
  RunAiAssistantMutation,
  RunAiAssistantMutationVariables,
  RunAiAssistantMutation_runAiAssistant,
  RunAiAssistantMutation_runAiAssistant_labels,
} from "../../../graphql-types";
import { Effect } from "../create-undo-store";
import { deleteManyLabelsMutationUpdate } from "./cache-updates/delete-label-mutation-update";

export const RUN_AI_ASSISTANT_MUTATION = gql`
  mutation RunAiAssistantMutation(
    $aiAssistantId: ID!
    $imageId: ID!
    $useAutoPolygon: Boolean
  ) {
    runAiAssistant(
      data: {
        aiAssistantId: $aiAssistantId
        imageId: $imageId
        useAutoPolygon: $useAutoPolygon
      }
    ) {
      labels {
        id
        imageId
        labelClass {
          id
        }
      }
      labelClasses
    }
  }
`;

export const DELETE_MANY_LABELS_BY_ID_MUTATION = gql`
  mutation DeleteManyLabelsByIdMutation($id: [ID!]!) {
    deleteManyLabels(where: { id: { in: $id } }) {
      id
      imageId
      labelClass {
        id
      }
    }
  }
`;

export type RunAiAssistantOptions = {
  client: ApolloClient<object>;
  onSuccess?: (result: RunAiAssistantMutation_runAiAssistant) => void;
  onError?: (error: ApolloError) => void;
};

const runAiAssistant = async (
  variables: RunAiAssistantMutationVariables,
  { client, onSuccess }: RunAiAssistantOptions
) => {
  const { imageId } = variables;
  const { data } = await client.mutate<
    RunAiAssistantMutation,
    RunAiAssistantMutationVariables
  >({
    mutation: RUN_AI_ASSISTANT_MUTATION,
    variables,
    refetchQueries: [
      GET_IMAGE_LABELS_QUERY,
      GET_LABEL_CLASSES_OF_DATASET_QUERY,
    ],
    update: (cache) => cache.evict({ id: `Image:${imageId}` }),
  });
  if (isNil(data)) {
    throw new Error("AI Assistant returned an empty response");
  }
  onSuccess?.(data.runAiAssistant);
  return data.runAiAssistant;
};

const tryRunningAiAssistant = async (
  variables: RunAiAssistantMutationVariables,
  { onError, ...options }: RunAiAssistantOptions
): Promise<RunAiAssistantMutation_runAiAssistant> => {
  try {
    return await runAiAssistant(variables, options);
  } catch (error) {
    if (isNil(onError) || !(error instanceof ApolloError)) {
      throw error;
    }
    onError(error);
    return { labels: [], labelClasses: [] };
  }
};

export type SetSelectedLabelIdFn = (labelId: string | null) => void;

export type DeleteManyLabelsOptions = {
  client: ApolloClient<object>;
  setSelectedLabelId: SetSelectedLabelIdFn;
};

const deleteManyLabels = async (
  labels: RunAiAssistantMutation_runAiAssistant_labels[],
  { client, setSelectedLabelId }: DeleteManyLabelsOptions
): Promise<void> => {
  setSelectedLabelId(null);
  await client.mutate<
    DeleteManyLabelsByIdMutation,
    DeleteManyLabelsByIdMutationVariables
  >({
    mutation: DELETE_MANY_LABELS_BY_ID_MUTATION,
    variables: { id: labels.map((label) => label.id) },
    refetchQueries: [GET_IMAGE_LABELS_QUERY],
    optimisticResponse: { deleteManyLabels: addTypenames(labels, "Label") },
    update: deleteManyLabelsMutationUpdate,
  });
};

export type CreateRunAiAssistantEffectOptions = RunAiAssistantOptions &
  DeleteManyLabelsOptions;

export type CreateRunAiAssistantEffectState = {
  variables: RunAiAssistantMutationVariables;
  result: RunAiAssistantMutation_runAiAssistant;
};

export const createRunAiAssistantEffect = (
  variables: RunAiAssistantMutationVariables,
  options: CreateRunAiAssistantEffectOptions
): Effect<CreateRunAiAssistantEffectState> => {
  const doRun = async () => ({
    variables,
    result: await tryRunningAiAssistant(variables, options),
  });
  return {
    do: doRun,
    redo: doRun,
    undo: async ({ result }) => {
      await deleteManyLabels(result.labels, options);
      return { variables, result };
    },
  };
};
