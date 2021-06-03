import gql from "graphql-tag";
import { useQuery } from "@apollo/client";
import { fromExtent } from "ol/geom/Polygon";

import { Label } from "../../../types.generated";

const getImageLabelsQuery = gql`
  query getImageLabels($imageId: ID!) {
    image(where: { id: $imageId }) {
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

export const Labels = ({ imageId }: { imageId: string }) => {
  const { data } = useQuery(getImageLabelsQuery, {
    variables: { imageId },
    onError: (e) => {
      throw e;
    },
    onCompleted: () => {},
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
