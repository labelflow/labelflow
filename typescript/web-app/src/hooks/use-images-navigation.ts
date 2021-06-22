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

export const useImagesNavigation = () => {
  const router = useRouter();
  const currentImageId = router.query.id as string | undefined;

  const { data } =
    useQuery<{
      images: Array<Image>;
    }>(allImagesQuery);

  const images = data?.images;

  if (images === undefined) {
    return {
      images,
      currentImageIndex: undefined,
      previousImageIndex: undefined,
      previousImageId: undefined,
      nextImageIndex: undefined,
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
      previousImageIndex: null,
      previousImageId: null,
      nextImageIndex: null,
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
    previousImageIndex,
    previousImageId,
    nextImageIndex,
    nextImageId,
  };
};
