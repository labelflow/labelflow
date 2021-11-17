import { Reference } from "@apollo/client";
import { MutationBaseOptions } from "@apollo/client/core/watchQueryOptions";

export const deleteLabelClassMutationUpdate = (
  datasetId: string
): MutationBaseOptions["update"] => {
  return (cache, { data }) => {
    const deletedLabelClass = data?.deleteLabelClass;
    if (!deletedLabelClass) {
      return;
    }

    cache.modify({
      id: cache.identify({ __typename: "Dataset", id: datasetId }),
      fields: {
        labelClasses: (existingLabelClasses: Reference[], { readField }) => {
          return existingLabelClasses.filter(
            (labelClass) => readField("id", labelClass) !== deletedLabelClass.id
          );
        },
        // Apollo is smart and this is compatible with the optimistic response
        labelClassesAggregates({ totalCount = 0, ...aggregates } = {}) {
          return {
            ...aggregates,
            totalCount: Math.max(0, totalCount - 1),
          };
        },
      },
      optimistic: true,
    });
  };
};
