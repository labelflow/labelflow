import { ApolloClient, gql } from "@apollo/client";
import { Coordinate } from "ol/coordinate";

import { LabelType } from "@labelflow/graphql-types";
import { Effect } from "..";
import { addLabelToImageInCache } from "./cache-updates/add-label-to-image-in-cache";
import { removeLabelFromImageCache } from "./cache-updates/remove-label-from-image-cache";
import { deleteLabelMutation } from "./shared-queries";

const createIogLabelMutation = gql`
  mutation createIogLabel(
    $id: String!
    $imageId: String!
    $x: Float!
    $y: Float!
    $width: Float!
    $height: Float!
    $centerPoint: [Float!]!
  ) {
    createIogLabel(
      data: {
        id: $id
        imageId: $imageId
        x: $x
        y: $y
        width: $width
        height: $height
        centerPoint: $centerPoint
      }
    ) {
      id
    }
  }
`;

export const createCreateIogLabelEffect = (
  {
    id: idInput,
    imageId,
    x,
    y,
    width,
    height,
    centerPoint,
  }: {
    id: string;
    imageId: string;
    x: number;
    y: number;
    width: number;
    height: number;
    centerPoint: Coordinate;
  },
  {
    setSelectedLabelId,
    client,
  }: {
    setSelectedLabelId: (labelId: string | null) => void;
    client: ApolloClient<object>;
  }
): Effect => ({
  do: async (id = idInput) => {
    const createLabelInputs = {
      id,
      imageId,
      labelClassId: null,
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [x, y],
            [x + width, y],
            [x + width, y + height],
            [x, y + height],
            [x, y],
          ],
        ],
      },
      type: LabelType.Polygon,
    };

    const createLabelPromise = client.mutate({
      mutation: createIogLabelMutation,
      variables: {
        id,
        imageId,
        x,
        y,
        width,
        height,
        centerPoint,
      },
      refetchQueries: ["countLabelsOfDataset", "getImageLabels"],
      optimisticResponse: {
        createIogLabel: { id, __typename: "Label" },
      },
      update(cache, { data: mutationPayloadData }) {
        if (typeof mutationPayloadData?.createIogLabel?.id !== "string") {
          return;
        }

        addLabelToImageInCache(cache, createLabelInputs);
      },
    });

    // TODO: Ideally we could select the label before awaiting for the mutation to complete
    // because the optimistic response is run synchronously.
    // However it makes some query fails. It would be nice to try to reverse those 2 lines
    // and make the other "cache-first"
    await createLabelPromise;
    setSelectedLabelId(id);
    return id;
  },
  undo: async (labelId: string): Promise<void> => {
    setSelectedLabelId(null);
    await client.mutate({
      mutation: deleteLabelMutation,
      variables: { id: labelId },
      refetchQueries: ["countLabelsOfDataset"],
      optimisticResponse: { deleteLabel: { id: labelId, __typename: "Label" } },
      update(cache) {
        removeLabelFromImageCache(cache, { imageId, id: labelId });
      },
    });
  },
});
