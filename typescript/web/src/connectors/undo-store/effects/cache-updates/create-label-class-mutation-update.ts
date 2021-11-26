import { gql, Reference } from "@apollo/client";
import { MutationBaseOptions } from "@apollo/client/core/watchQueryOptions";

export const createLabelClassMutationUpdate: (
  datasetId: string
) => MutationBaseOptions["update"] =
  (datasetId) =>
  (cache, { data }) => {
    const createdLabelClass = data?.createLabelClass;
    if (!createdLabelClass) {
      return;
    }

    cache.modify({
      id: cache.identify({ __typename: "Dataset", id: datasetId }),
      fields: {
        labelClasses: (existingLabelClasses: Reference[], { readField }) => {
          const newLabelClassRef = cache.writeFragment({
            data: createdLabelClass,
            fragment: gql`
              fragment NewLabelClass on LabelClass {
                id
                name
                color
              }
            `,
          });

          if (
            existingLabelClasses.find(
              (labelClass) =>
                readField("id", labelClass) === createdLabelClass.id
            ) !== undefined
          ) {
            return existingLabelClasses;
          }

          return [...existingLabelClasses, newLabelClassRef];
        },
        // Apollo is smart and this is compatible with the optimistic response
        labelClassesAggregates({ totalCount = 0, ...aggregates } = {}) {
          return {
            ...aggregates,
            totalCount: totalCount + 1,
          };
        },
      },
      optimistic: true,
    });
  };
