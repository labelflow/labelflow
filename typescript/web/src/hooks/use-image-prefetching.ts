import { gql, useQuery } from "@apollo/client";
import { useEffect } from "react";
import { useImagesNavigation } from "./use-images-navigation";

const imageQuery = gql`
  query image($id: ID!) {
    image(where: { id: $id }) {
      id
      width
      height
      url
    }
  }
`;

const getImageLabelsQuery = gql`
  query getImageLabels($imageId: ID!) {
    image(where: { id: $imageId }) {
      id
      labels {
        id
        x
        y
        width
        height
        labelClass {
          id
          color
        }
        geometry {
          type
          coordinates
        }
      }
    }
  }
`;

export const useImagePrefecthing = () => {
  const { nextImageId, previousImageId } = useImagesNavigation();
  // Fetch previous and next image details
  const { data: previousImageData } = useQuery(imageQuery, {
    variables: { id: previousImageId },
    skip: previousImageId == null,
  });
  const { data: nextImageData } = useQuery(imageQuery, {
    variables: { id: nextImageId },
    skip: nextImageId == null,
  });
  // Fetch previous and next image labels
  useQuery(getImageLabelsQuery, {
    variables: { imageId: previousImageId },
    skip: previousImageId == null,
  });
  useQuery(getImageLabelsQuery, {
    variables: { imageId: nextImageId },
    skip: nextImageId == null,
  });
  // Fetch previous and next image
  const previousImageUrl = previousImageData?.image?.url;
  const nextImageUrl = nextImageData?.image?.url;
  useEffect(() => {
    if (previousImageUrl != null) {
      fetch(previousImageUrl);
    }
  }, [previousImageUrl]);
  useEffect(() => {
    if (nextImageUrl != null) {
      fetch(nextImageUrl);
    }
  }, [nextImageUrl]);
};
