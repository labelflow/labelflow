import { ApolloClient, gql } from "@apollo/client";
import { Coordinate } from "ol/coordinate";

import { Effect } from "..";
import { LabelType } from "../../../graphql-types/globalTypes";
import { createLabelMutationUpdate } from "./cache-updates/create-label-mutation-update";
import { deleteLabelMutationUpdate } from "./cache-updates/delete-label-mutation-update";
import { DELETE_LABEL_MUTATION } from "./shared-queries";

const CREATE_IOG_LABEL_MUTATION = gql`
  mutation CreateIogLabelMutation(
    $id: ID!
    $imageId: String!
    $x: Float!
    $y: Float!
    $width: Float!
    $height: Float!
    $centerPoint: [Float!]!
    $labelClassId: ID
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
        labelClassId: $labelClassId
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
    labelClassId,
  }: {
    id: string;
    imageId: string;
    x: number;
    y: number;
    width: number;
    height: number;
    centerPoint: Coordinate;
    labelClassId?: string;
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
      labelClassId,
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
      mutation: CREATE_IOG_LABEL_MUTATION,
      variables: {
        id,
        imageId,
        x,
        y,
        width,
        height,
        centerPoint,
        labelClassId,
      },
      refetchQueries: ["CountLabelsOfDatasetQuery", "GetImageLabelsQuery"],
      optimisticResponse: {
        createIogLabel: { id, __typename: "Label" },
      },
      update: createLabelMutationUpdate(createLabelInputs),
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
      mutation: DELETE_LABEL_MUTATION,
      variables: { id: labelId },
      refetchQueries: ["CountLabelsOfDatasetQuery"],
      optimisticResponse: { deleteLabel: { id: labelId, __typename: "Label" } },
      update: deleteLabelMutationUpdate({ imageId, id: labelId, labelClassId }),
    });
  },
});
