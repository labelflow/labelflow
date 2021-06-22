import { useRouter } from "next/router";
import { useQuery } from "@apollo/client";
import gql from "graphql-tag";

import { Image as ImageType } from "../graphql-types.generated";

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
      images: Array<ImageType>;
    }>(allImagesQuery);

  let currentImageIndex = data?.images.findIndex(
    (image) => image.id === imageId
  );

  if (currentImageIndex === -1) {
    currentImageIndex = undefined;
  }

  const images = data?.images ?? [];

  return { images, currentImageIndex };
};
