import { gql, ApolloClient, Reference } from "@apollo/client";

import { v4 as uuid } from "uuid";
import { MutationBaseOptions } from "@apollo/client/core/watchQueryOptions";
import { useLabelingStore } from "../../labeling-state";

import { Effect } from "..";
import { getDatasetsQuery } from "../../../pages/[workspaceSlug]/datasets";
import { datasetLabelClassesQuery } from "../../../components/dataset-class-list/class-item";

const getLabelQuery = gql`
  query getLabel($id: ID!) {
    label(where: { id: $id }) {
      id
      labelClass {
        id
      }
    }
  }
`;

const createLabelClassQuery = gql`
  mutation createLabelClass($data: LabelClassCreateInput!) {
    createLabelClass(data: $data) {
      id
      name
      color
    }
  }
`;

const deleteLabelClassQuery = gql`
  mutation deleteLabelClass($where: LabelClassWhereUniqueInput!) {
    deleteLabelClass(where: $where) {
      id
    }
  }
`;

const updateLabelQuery = gql`
  mutation updateLabelClass(
    $where: LabelWhereUniqueInput!
    $data: LabelUpdateInput!
  ) {
    updateLabel(where: $where, data: $data) {
      id
      labelClass {
        id
      }
    }
  }
`;

const createLabelClassMutationUpdate: (
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

export const createCreateLabelClassAndUpdateLabelEffect = (
  {
    name,
    color,
    datasetId,
    selectedLabelId,
  }: {
    name: string;
    color: string;
    datasetId: string;
    selectedLabelId: string;
  },
  {
    client,
  }: {
    client: ApolloClient<object>;
  }
): Effect => ({
  do: async () => {
    // We create the labelClassId on the client to be able to return its correct value during the optimistic response
    const labelClassId = uuid();

    const labelPreviousDetailsPromise = client.query({
      query: getLabelQuery,
      variables: { id: selectedLabelId },
    });

    /** There is room for enhancement here.
     * We await the mutation that create the label class before triggering the mutation which updates the label with the new label class.
     * This makes the optimistic less useful.
     * We still need to wait for the first mutation to answer before doing the update and optimistic response of the second one.
     *
     * Technically, it is not needed to wait for the first mutation as we already now the id of the label class we will create, however,
     * we have a check in the backend to ensure that the new label class exist before updating a label. This would add a race condition.
     *
     * It would be better if we could create the label class and update the label in the same mutation.
     */
    await client.mutate<{
      createLabelClass: {
        id: string;
        name: string;
        color: string;
        __typename: "LabelClass";
      };
    }>({
      mutation: createLabelClassQuery,
      variables: { data: { name, color, datasetId, id: labelClassId } },
      optimisticResponse: {
        createLabelClass: {
          id: labelClassId,
          name,
          color,
          __typename: "LabelClass",
        },
      },
      update: createLabelClassMutationUpdate(datasetId),
    });

    useLabelingStore.setState({ selectedLabelClassId: labelClassId });

    const labelClassIdPrevious =
      (await labelPreviousDetailsPromise)?.data?.label?.labelClass?.id ?? null;

    await client.mutate<{
      updateLabel: {
        id: string;
        labelClass: {
          id: string;
          __typename: "LabelClass";
        };
        __typename: "Label";
      };
    }>({
      mutation: updateLabelQuery,
      variables: {
        where: { id: selectedLabelId },
        data: { labelClassId: labelClassId ?? null },
      },
      optimisticResponse: {
        updateLabel: {
          id: selectedLabelId,
          labelClass: { id: labelClassId, __typename: "LabelClass" },
          __typename: "Label",
        },
      },
      // no need to write an update as apollo automatically does it if we query the labelClass id
    });

    return {
      labelClassId,
      labelClassIdPrevious,
    };
  },
  undo: async ({
    labelClassId,
    labelClassIdPrevious,
  }: {
    labelClassId: string;
    labelClassIdPrevious: string;
  }) => {
    await client.mutate({
      mutation: updateLabelQuery,
      variables: {
        where: { id: selectedLabelId },
        data: { labelClassId: labelClassIdPrevious ?? null },
      },
      optimisticResponse: {
        updateLabel: {
          id: selectedLabelId,
          labelClass: labelClassIdPrevious
            ? { id: labelClassIdPrevious, __typename: "LabelClass" }
            : null,
          __typename: "Label",
        },
      },
      // no need to write an update as apollo automatically does it if we query the labelClass id
    });

    useLabelingStore.setState({ selectedLabelClassId: labelClassIdPrevious });

    await client.mutate({
      mutation: deleteLabelClassQuery,
      variables: {
        where: { id: labelClassId },
      },
      optimisticResponse: {
        deleteLabelClass: { __typename: "LabelClass", id: labelClassId },
      },
      update: (cache, { data }) => {
        const deletedLabelClass = data?.deleteLabelClass;
        if (!deletedLabelClass) {
          return;
        }

        cache.modify({
          id: cache.identify({ __typename: "Dataset", id: datasetId }),
          fields: {
            labelClasses: (
              existingLabelClasses: Reference[],
              { readField }
            ) => {
              return existingLabelClasses.filter(
                (labelClass) =>
                  readField("id", labelClass) !== deletedLabelClass.id
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
      },
    });

    return {
      labelClassId,
      labelClassIdPrevious,
    };
  },
  redo: async ({
    labelClassId,
    labelClassIdPrevious,
  }: {
    labelClassId: string;
    labelClassIdPrevious: string;
  }) => {
    await client.mutate({
      mutation: createLabelClassQuery,
      variables: { data: { name, color, id: labelClassId, datasetId } },
      update: createLabelClassMutationUpdate(datasetId),
      optimisticResponse: {
        createLabelClass: {
          id: labelClassId,
          name,
          color,
          __typename: "LabelClass",
        },
      },
    });

    useLabelingStore.setState({ selectedLabelClassId: labelClassId });

    await client.mutate({
      mutation: updateLabelQuery,
      variables: {
        where: { id: selectedLabelId },
        data: { labelClassId },
      },
      optimisticResponse: {
        updateLabel: {
          id: selectedLabelId,
          labelClass: { id: labelClassId, __typename: "LabelClass" },
          __typename: "Label",
        },
      },
      // no need to write an update as apollo automatically does it if we query the labelClass id
    });

    return {
      labelClassId,
      labelClassIdPrevious,
    };
  },
});
