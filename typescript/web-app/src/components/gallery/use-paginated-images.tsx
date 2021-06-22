import { useQuery } from "@apollo/client";
import gql from "graphql-tag";

import { Image as ImageType } from "../../graphql-types.generated";

const paginatedImagesQuery = gql`
  query paginatedImages {
    images {
      id
      # name
      url
    }
  }
`;

export const usePaginatedImages = () => {
  return useQuery<{
    images: Array<ImageType | null>;
  }>(paginatedImagesQuery);
};
