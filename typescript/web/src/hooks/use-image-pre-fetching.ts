import { gql, useQuery } from "@apollo/client";
import { useEffect, useReducer } from "react";
import { useImagesNavigation } from "./use-images-navigation";

const imageQuery = gql`
  query prefetchImage($id: ID!) {
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
  query getImageLabelsForPrefetch($imageId: ID!) {
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

type CanFetchState = {
  canFetchNext?: boolean;
  canFetchPrevious?: boolean;
};

const useCanFetch = (initState: Required<CanFetchState>) =>
  useReducer<
    (
      oldState: Required<CanFetchState>,
      newState: CanFetchState
    ) => Required<CanFetchState>
  >((oldState, newState) => ({ ...oldState, ...newState }), initState);

export const useImagePreFetching = () => {
  const { nextImageId, previousImageId } = useImagesNavigation();
  const [{ canFetchNext, canFetchPrevious }, setCanFetch] = useCanFetch({
    canFetchNext: false,
    canFetchPrevious: false,
  });
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
    if (previousImageUrl != null && canFetchPrevious) {
      fetch(previousImageUrl);
    }
    setCanFetch({ canFetchPrevious: false });
  }, [previousImageUrl, canFetchPrevious, setCanFetch]);
  useEffect(() => {
    if (nextImageUrl != null && canFetchNext) {
      fetch(nextImageUrl);
    }
    setCanFetch({ canFetchNext: false });
  }, [nextImageUrl, canFetchNext, setCanFetch]);
  return () => {
    setCanFetch({
      canFetchNext: true,
      canFetchPrevious: true,
    });
  };
};
