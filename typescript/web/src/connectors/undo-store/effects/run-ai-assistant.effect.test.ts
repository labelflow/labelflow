import { DETR_COCO_AI_ASSISTANT } from "@labelflow/common-resolvers/src/ai-assistant";
import { waitFor } from "@testing-library/dom";
import { MATCH_ANY_PARAMETERS } from "wildcard-mock-link";
import { useUndoStore } from "..";
import {
  DeleteManyLabelsByIdMutation,
  DeleteManyLabelsByIdMutationVariables,
  RunAiAssistantMutation,
  RunAiAssistantMutationVariables,
} from "../../../graphql-types";
import {
  ApolloMockResponse,
  ApolloMockResponses,
  getApolloMockClient,
} from "../../../utils/tests/apollo-mock";
import {
  createRunAiAssistantEffect,
  DELETE_MANY_LABELS_BY_ID_MUTATION,
  RUN_AI_ASSISTANT_MUTATION,
} from "./run-ai-assistant.effect";

const { perform } = useUndoStore.getState();

const UPDATE_LABEL_CLASS_ACTION_MOCK: ApolloMockResponse<
  RunAiAssistantMutation,
  RunAiAssistantMutationVariables
> = {
  request: {
    query: RUN_AI_ASSISTANT_MUTATION,
    variables: MATCH_ANY_PARAMETERS,
  },
  nMatches: 2,
  result: { data: { runAiAssistant: { labels: [], labelClasses: [] } } },
};

const DELETE_MANY_LABEL_CLASSES_ACTION_MOCK: ApolloMockResponse<
  DeleteManyLabelsByIdMutation,
  DeleteManyLabelsByIdMutationVariables
> = {
  request: {
    query: DELETE_MANY_LABELS_BY_ID_MUTATION,
    variables: MATCH_ANY_PARAMETERS,
  },
  nMatches: 1,
  result: jest.fn(() => ({
    data: {
      deleteManyLabels: [],
    },
  })),
};

const APOLLO_MOCKS: ApolloMockResponses = [
  UPDATE_LABEL_CLASS_ACTION_MOCK,
  DELETE_MANY_LABEL_CLASSES_ACTION_MOCK,
];

describe("RunAiAssistantEffect", () => {
  let effectId!: string;

  beforeAll(async () => {
    jest.clearAllMocks();
    const { client } = getApolloMockClient(APOLLO_MOCKS);
    const effect = createRunAiAssistantEffect(
      {
        aiAssistantId: DETR_COCO_AI_ASSISTANT.id,
        imageId: "b3ca1416-b85d-4b5d-98c6-892f1a2b26da",
      },
      { client, setSelectedLabelId: jest.fn() }
    );
    effectId = await perform(effect);
  });

  it("creates the run ai assistant effect", async () => {
    const { pastEffects } = useUndoStore.getState();
    expect(pastEffects).toHaveLength(1);
  });

  it("performs the undo run ai assistant effect", async () => {
    await useUndoStore.getState().undo();
    await waitFor(() =>
      expect(DELETE_MANY_LABEL_CLASSES_ACTION_MOCK.result).toHaveBeenCalled()
    );
    const { pastEffects, futureEffects } = useUndoStore.getState();
    expect(pastEffects).toHaveLength(0);
    expect(futureEffects).toHaveLength(1);
    const [actualEffect] = futureEffects;
    expect(actualEffect.id).toBe(effectId);
  });

  it("performs the redo run ai assistant effect", async () => {
    await useUndoStore.getState().redo();
    const { pastEffects, futureEffects } = useUndoStore.getState();
    expect(pastEffects).toHaveLength(1);
    expect(futureEffects).toHaveLength(0);
    const [actualEffect] = pastEffects;
    expect(actualEffect.id).toBe(effectId);
  });
});
