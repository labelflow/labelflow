import { gql, useQuery } from "@apollo/client";
import { useEffect, useState } from "react";
import { useImagesNavigation } from "./use-images-navigation";

const imageQuery = gql`
  query image($id: ID!) {
    image(where: { id: $id }) {
      id
      width
      height
      url
      thumbnail200Url
    }
  }
`;

const getImageLabelsQuery = gql`
  query getImageLabels($imageId: ID!) {
    image(where: { id: $imageId }) {
      id
      width
      height
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

export const useImagePreFetching = () => {
  const { nextImageId, previousImageId } = useImagesNavigation();
  const [canPreFetchPrevious, setCanPreFetchPrevious] = useState(false);
  const [canPreFetchNext, setCanPreFetchNext] = useState(false);
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
    if (previousImageUrl != null && canPreFetchPrevious) {
      fetch(previousImageUrl);
    }
    setCanPreFetchPrevious(false);
  }, [previousImageUrl, canPreFetchPrevious]);
  useEffect(() => {
    if (nextImageUrl != null && canPreFetchNext) {
      fetch(nextImageUrl);
    }
    setCanPreFetchNext(false);
  }, [nextImageUrl, canPreFetchNext]);
  return () => {
    setCanPreFetchPrevious(true);
    setCanPreFetchNext(true);
  };
};
