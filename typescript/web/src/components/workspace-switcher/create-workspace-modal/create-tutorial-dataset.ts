import { gql, useMutation } from "@apollo/client";
import {
  tutorialImages,
  tutorialLabelClasses,
  tutorialLabels,
} from "@labelflow/common-resolvers/src/data/dataset-tutorial";
import { omit } from "lodash/fp";
import { useCallback } from "react";
import {
  CreateTutorialDatasetMutation,
  CreateTutorialDatasetMutationVariables,
} from "../../../graphql-types/CreateTutorialDatasetMutation";
import { useTutorialLoadingStore } from "../../../utils/use-loading-store";

const CREATE_TUTORIAL_DATASET_MUTATION = gql`
  mutation CreateTutorialDatasetMutation(
    $name: String!
    $workspaceSlug: String!
    $labelClass: TutorialLabelClassCreateInput!
    $images: [ImageCreateManySingleInput!]!
    $labels: [TutorialLabelCreateManySingleInput!]!
  ) {
    createTutorialDataset(
      data: {
        name: $name
        workspaceSlug: $workspaceSlug
        labelClass: $labelClass
        images: $images
        labels: $labels
      }
    ) {
      id
    }
  }
`;

export const useCreateTutorialDataset = () => {
  const [createTutorialDatasetMutate] = useMutation<
    CreateTutorialDatasetMutation,
    CreateTutorialDatasetMutationVariables
  >(CREATE_TUTORIAL_DATASET_MUTATION);
  const setTutorialDatasetLoading = useTutorialLoadingStore(
    (state) => state.setTutorialDatasetLoading
  );
  const labelClass = tutorialLabelClasses[0];
  const now = new Date();
  const imagesToCreate = tutorialImages.map(({ name, url }, urlIndex) => {
    const createdAt = new Date();
    createdAt.setTime(now.getTime() + urlIndex);

    return {
      externalUrl: url,
      name,
      createdAt: createdAt.toISOString(),
      noThumbnails: true,
    };
  });
  const labels = tutorialLabels.map((label) => ({
    ...omit(["id", "imageId"], label),
  }));

  return useCallback(
    async (workspaceSlug: string) => {
      setTutorialDatasetLoading(true);
      await createTutorialDatasetMutate({
        variables: {
          name: "Tutorial Dataset",
          workspaceSlug,
          labelClass: {
            name: labelClass.name,
            color: labelClass.color,
          },
          images: imagesToCreate,
          labels,
        },
      });
      setTutorialDatasetLoading(false);
    },
    [
      createTutorialDatasetMutate,
      imagesToCreate,
      labelClass.color,
      labelClass.name,
      labels,
      setTutorialDatasetLoading,
    ]
  );
};
