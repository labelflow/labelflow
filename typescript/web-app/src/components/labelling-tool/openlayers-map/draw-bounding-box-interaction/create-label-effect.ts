import { ApolloCache, ApolloClient, Reference } from "@apollo/client";
import gql from "graphql-tag";

import { Effect } from "../../../../connectors/undo-store";
import { projectsQuery } from "../../../../pages/projects";

type CreateLabelInputs = {
  imageId: string;
  id?: string;
  x: number;
  y: number;
  width: number;
  height: number;
  labelClassId: string | null | undefined;
};

const createLabelMutation = gql`
  mutation createLabel(
    $id: ID
    $imageId: ID!
    $x: Float!
    $y: Float!
    $width: Float!
    $height: Float!
    $labelClassId: ID
  ) {
    createLabel(
      data: {
        id: $id
        imageId: $imageId
        x: $x
        y: $y
        width: $width
        height: $height
        labelClassId: $labelClassId
      }
    ) {
      id
    }
  }
`;

const deleteLabelMutation = gql`
  mutation deleteLabel($id: ID!) {
    deleteLabel(where: { id: $id }) {
      id
    }
  }
`;

const createdLabelFragment = gql`
  fragment NewLabel on Label {
    id
    x
    y
    width
    height
    labelClass {
      id
    }
  }
`;

export function addLabelToImageInCache(
  cache: ApolloCache<{
    createLabel: {
      id: string;
      __typename: string;
    };
  }>,
  {
    imageId,
    id,
    x,
    y,
    width,
    height,
    labelClassId,
  }: CreateLabelInputs & { id: string }
) {
  const createdLabel = {
    id,
    x,
    y,
    width,
    height,
    labelClass:
      labelClassId != null
        ? {
            id: labelClassId,
            __typename: "LabelClass",
          }
        : null,
    __typename: "Label",
  };

  cache.modify({
    id: cache.identify({ id: imageId, __typename: "Image" }),
    fields: {
      labels: (existingLabelsRefs = []) => {
        const newLabelRef = cache.writeFragment({
          data: createdLabel,
          fragment: createdLabelFragment,
        });

        return [...existingLabelsRefs, newLabelRef];
      },
    },
  });
}

export function removeLabelFromImageCache(
  cache: ApolloCache<{ deleteLabel: { id: string; __typename: string } }>,
  { imageId, id }: { imageId: string; id: string }
) {
  cache.modify({
    id: cache.identify({ id: imageId, __typename: "Image" }),
    fields: {
      labels: (existingLabelsRefs: Reference[] = [], { readField }) => {
        return existingLabelsRefs.filter(
          (labelRef) => readField("id", labelRef) !== id
        );
      },
    },
  });
}

export const createLabelEffect = (
  {
    imageId,
    x,
    y,
    width,
    height,
    selectedLabelClassId,
  }: {
    imageId: string;
    x: number;
    y: number;
    width: number;
    height: number;
    selectedLabelClassId: string | null;
  },
  {
    setSelectedLabelId,
    client,
  }: {
    setSelectedLabelId: (labelId: string | null) => void;
    client: ApolloClient<object>;
  }
): Effect => ({
  do: async () => {
    const createLabelInputs = {
      x,
      y,
      width,
      height,
      imageId,
      labelClassId: selectedLabelClassId,
    };

    const { data } = await client.mutate({
      mutation: createLabelMutation,
      variables: createLabelInputs,
      refetchQueries: ["countLabels", { query: projectsQuery }],
      optimisticResponse: {
        createLabel: { id: `temp-${Date.now()}`, __typename: "Label" },
      },
      update(cache, { data: mutationPayloadData }) {
        const id = mutationPayloadData?.createLabel?.id;
        if (typeof id !== "string") {
          return;
        }

        addLabelToImageInCache(cache, { ...createLabelInputs, id });
      },
    });

    if (typeof data?.createLabel?.id !== "string") {
      throw new Error("Couldn't get the id of the newly created label");
    }

    setSelectedLabelId(data.createLabel.id);
    return data.createLabel.id;
  },
  undo: async (id: string): Promise<string> => {
    await client.mutate({
      mutation: deleteLabelMutation,
      variables: { id },
      refetchQueries: ["countLabels", { query: projectsQuery }],
      optimisticResponse: { deleteLabel: { id, __typename: "Label" } },
      update(cache) {
        removeLabelFromImageCache(cache, { imageId, id });
      },
    });

    setSelectedLabelId(null);
    return id;
  },
  redo: async (id: string) => {
    const createLabelInputs = {
      id,
      x,
      y,
      width,
      height,
      imageId,
      labelClassId: selectedLabelClassId,
    };
    const { data } = await client.mutate({
      mutation: createLabelMutation,
      variables: createLabelInputs,
      refetchQueries: ["countLabels", { query: projectsQuery }],
      optimisticResponse: {
        createLabel: { id: `temp-${Date.now()}`, __typename: "Label" },
      },
      update(cache) {
        addLabelToImageInCache(cache, createLabelInputs);
      },
    });

    if (typeof data?.createLabel?.id !== "string") {
      throw new Error("Couldn't get the id of the newly created label");
    }

    setSelectedLabelId(data.createLabel.id);
    return data.createLabel.id;
  },
});
