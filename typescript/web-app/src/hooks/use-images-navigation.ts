import { useRouter } from "next/router";
import { useQuery } from "@apollo/client";
import gql from "graphql-tag";

import { Image } from "../graphql-types.generated";

const allImagesQuery = gql`
  query allImages {
    images {
      id
      url
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
  const currentImageId = router.query.id as string | undefined;

  const { data } =
    useQuery<{
      images: Array<Pick<Image, "id" | "url">>;
    }>(allImagesQuery);

  const images = data?.images;

  if (images === undefined) {
    return {
      images,
      currentImageIndex: undefined,
      previousImageId: undefined,
      nextImageId: undefined,
    };
  }

  const currentImageIndex: number | null = images.findIndex(
    (image) => image.id === currentImageId
  );

  if (currentImageIndex === -1) {
    return {
      images,
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
    currentImageIndex < images.length - 1 ? currentImageIndex + 1 : null;
  const nextImageId =
    nextImageIndex !== null ? images[nextImageIndex].id : null;

  return {
    images,
    currentImageIndex,
    previousImageId,
    nextImageId,
  };
};
