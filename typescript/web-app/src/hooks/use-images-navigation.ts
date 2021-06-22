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
  const imageId = router.query.id as string;

  const { data } =
    useQuery<{
      images: Array<Image>;
    }>(allImagesQuery);

  let currentImageIndex: number | undefined | null = data?.images.findIndex(
    (image) => image.id === imageId
  );

  if (currentImageIndex === -1) {
    currentImageIndex = null;
  }

  const images = data?.images;

  return { images, currentImageIndex };
};
