import { useRouter } from "next/router";
import { useQuery, gql } from "@apollo/client";

import { Project, Image } from "../graphql-types.generated";

const getAllImagesOfAProjectQuery = gql`
  query getAllImagesOfAProject($projectId: ID!) {
    project(where: { id: $projectId }) {
      id
      images {
        id
        url
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
  const { projectId, imageId: currentImageId } = router?.query;

  // Refetch images ?
  const { data } = useQuery<{
    project: Pick<Project, "id" | "images">;
  }>(getAllImagesOfAProjectQuery, { variables: { projectId } });

  // TODO: Investigate why you have to specify undefined states
  const images = data?.project?.images;
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

  const currentImageIndex = images.findIndex(
    (image: Partial<Image>) => image.id === currentImageId
  );

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
