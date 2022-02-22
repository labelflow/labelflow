import { useQuery } from "@apollo/client";
import { isEmpty } from "lodash/fp";
import {
  GetAllImagesOfADatasetQuery,
  GetAllImagesOfADatasetQueryVariables,
} from "../graphql-types/GetAllImagesOfADatasetQuery";
import { useDataset } from "./use-dataset";
import { useDatasetImage } from "./use-dataset-image";
import { GET_ALL_IMAGES_OF_A_DATASET_QUERY } from "./use-images-navigation.query";
import { useOptionalWorkspace } from "./use-user";

/**
 * A Hook to handle image navigation.
 *
 * Beware, this hook does a single request fetching all the images.
 *
 * @returns An object containing `images`, `currentImageIndex`, `previousImageId`
 * and `nextImageId`. They all are undefined while images are loading.
 * `currentImageIndex`, `previousImageId` and `nextImageId` can be null if they can't
 * be found in images or they don't exist (ie: `nextImageId` doesn't exist if `currentImageIndex`
 * is already the last index of the array).
 */
export const useImagesNavigation = () => {
  const workspace = useOptionalWorkspace();
  const workspaceSlug = workspace?.slug ?? "";
  const { slug: datasetSlug } = useDataset();
  const { id: currentImageId } = useDatasetImage();

  const { data } = useQuery<
    GetAllImagesOfADatasetQuery,
    GetAllImagesOfADatasetQueryVariables
  >(GET_ALL_IMAGES_OF_A_DATASET_QUERY, {
    variables: { slug: datasetSlug, workspaceSlug },
    skip: isEmpty(workspaceSlug) || isEmpty(datasetSlug),
  });

  // TODO: Investigate why you have to specify undefined states
  const images = data?.dataset?.images;
  const imagesCount = images?.length ?? 0;

  if (images === undefined) {
    return {
      images,
      imagesCount,
      currentImageIndex: undefined,
      previousImageId: undefined,
      nextImageId: undefined,
    };
  }

  const currentImageIndex = images.findIndex(({ id }) => id === currentImageId);

  if (currentImageIndex === -1) {
    return {
      images,
      imagesCount,
      currentImageIndex: null,
      previousImageId: null,
      nextImageId: null,
    };
  }

  const previousImageIndex =
    currentImageIndex >= 1 ? currentImageIndex - 1 : null;
  const previousImageId =
    previousImageIndex !== null ? images[previousImageIndex].id : null;

  const nextImageIndex =
    currentImageIndex < imagesCount - 1 ? currentImageIndex + 1 : null;
  const nextImageId =
    nextImageIndex !== null ? images[nextImageIndex].id : null;

  return {
    images,
    imagesCount,
    currentImageIndex,
    previousImageId,
    nextImageId,
  };
};
