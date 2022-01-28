import { useRouter } from "next/router";
import { useQuery, gql } from "@apollo/client";
import {
  GetAllImagesOfADatasetQuery,
  GetAllImagesOfADatasetQueryVariables,
} from "../graphql-types/GetAllImagesOfADatasetQuery";

const GET_ALL_IMAGES_OF_A_DATASET_QUERY = gql`
  query GetAllImagesOfADatasetQuery($slug: String!, $workspaceSlug: String!) {
    dataset(where: { slugs: { slug: $slug, workspaceSlug: $workspaceSlug } }) {
      id
      images {
        id
        url
        thumbnail200Url
      }
    }
  }
`;

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
  const router = useRouter();
  const { datasetSlug, imageId: currentImageId, workspaceSlug } = router?.query;

  // Refetch images ?
  const { data } = useQuery<
    GetAllImagesOfADatasetQuery,
    GetAllImagesOfADatasetQueryVariables
  >(GET_ALL_IMAGES_OF_A_DATASET_QUERY, {
    variables: {
      slug: typeof datasetSlug === "string" ? datasetSlug : datasetSlug[0],
      workspaceSlug:
        typeof workspaceSlug === "string" ? workspaceSlug : workspaceSlug[0],
    },
    skip: !datasetSlug || !workspaceSlug,
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
