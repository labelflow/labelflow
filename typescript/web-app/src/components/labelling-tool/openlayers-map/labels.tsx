import { useRouter } from "next/router";
import { useQuery } from "@apollo/client";
import gql from "graphql-tag";
import { fromExtent } from "ol/geom/Polygon";

import { Label } from "../../../graphql-types.generated";

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
      }
    }
  }
`;

export const Labels = () => {
  const imageId = useRouter().query?.id;
  const { data } = useQuery(getImageLabelsQuery, {
    skip: typeof imageId !== "string",
    variables: { imageId: imageId as string },
    onError: (e) => {
      throw e;
    },
  });

  const labels = data?.image?.labels ?? [];

  return (
    <olLayerVector>
      <olSourceVector>
        {labels.map(({ id, x, y, width, height }: Label) => {
          return (
            <olFeature
              key={id}
              geometry={fromExtent([x, y, x + width, y + height])}
            />
          );
        })}
      </olSourceVector>
    </olLayerVector>
  );
};
