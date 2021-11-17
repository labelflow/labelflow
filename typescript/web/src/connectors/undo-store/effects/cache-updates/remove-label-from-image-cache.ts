import { ApolloCache, Reference } from "@apollo/client";

export function removeLabelFromImageCache(
  cache: ApolloCache<{ deleteLabel: { id: string; __typename: string } }>,
  { imageId, id }: { imageId: string; id: string }
) {
  cache.modify({
    id: cache.identify({ id: imageId, __typename: "Image" }),
    fields: {
      labels: (existingLabelsRefs: Reference[] = [], { readField }) => {
        return existingLabelsRefs.filter(
          (labelRef) => readField("id", labelRef) !== id
        );
      },
    },
  });
}
