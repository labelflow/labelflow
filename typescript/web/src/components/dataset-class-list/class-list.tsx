import { useMemo, useState, useCallback } from "react";
import { useQuery, gql, useApolloClient } from "@apollo/client";
import { Box, Heading } from "@chakra-ui/react";

import { ClassTableActions } from "./table-actions";
import { ClassTableContent } from "./table-content";
import { DeleteLabelClassModal } from "./delete-class-modal";

type DatasetClassesQueryResult = {
  dataset: {
    id: string;
    name: string;
    labelClasses: {
      id: string;
      index: number;
      name: string;
      color: string;
      labelsAggregates: {
        totalCount: number;
      }
    }[];
  };
};

const datasetLabelClassesQuery = gql`
  query getDatasetLabelClasses($slug: String!, $workspaceSlug: String!) {
    dataset(where: { slugs: { slug: $slug, workspaceSlug: $workspaceSlug } }) {
      id
      name
      labelClasses {
        id
        index
        name
        color
        labelsAggregates {
          totalCount
        }
      }
    }
  }
`;
const reorderLabelClassMutation = gql`
  mutation reorderLabelClass($id: ID!, $index: Int!) {
    reorderLabelClass(where: { id: $id }, data: { index: $index }) {
      id
    }
  }
`;
const reorder = (list: any[], startIndex: number, endIndex: number) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
};

const addShortcutsToLabelClasses = (labelClasses: any[]) =>
  labelClasses.map((labelClass, index) => ({
    ...labelClass,
    shortcut: index > 9 ? null : `${(index + 1) % 10}`,
  }));

export const ClassesList = ({
  datasetSlug,
  workspaceSlug,
}: {
  datasetSlug: string;
  workspaceSlug: string;
}) => {
  const client = useApolloClient();
  const [deleteClassId, setDeleteClassId] = useState<string | null>(null);
  const [searchText, setSearchText] = useState("");

  const {
    data: datasetResult,
    loading,
    refetch,
    updateQuery,
  } = useQuery<DatasetClassesQueryResult>(datasetLabelClassesQuery, {
    variables: {
      slug: datasetSlug,
      workspaceSlug,
    },
    skip: !datasetSlug,
  });
  const labelClasses = datasetResult?.dataset.labelClasses ?? [];
  const datasetId = datasetResult?.dataset.id;

  const labelClassWithShortcut = useMemo(
    () => addShortcutsToLabelClasses(labelClasses),
    [labelClasses]
  );

  const onDragEnd = useCallback(
    async (result) => {
      // dropped outside the list
      if (!result.destination) {
        return;
      }
      updateQuery((prev) => {
        const labelClassesPrevious = prev?.dataset?.labelClasses;
        return {
          ...prev,
          dataset: {
            ...prev?.dataset,
            labelClasses: addShortcutsToLabelClasses(
              reorder(
                labelClassesPrevious,
                result.source.index,
                result.destination.index
              )
            ),
          },
        };
      });
      await client.mutate({
        mutation: reorderLabelClassMutation,
        variables: { id: result.draggableId, index: result.destination.index },
      });
      refetch();
    },
    [updateQuery]
  );

  return (
    <>
      <DeleteLabelClassModal
        isOpen={deleteClassId != null}
        datasetId={datasetId}
        labelClassId={deleteClassId}
        onClose={() => setDeleteClassId(null)}
      />
      {!loading && (
        <Box display="flex" flexDirection="column" w="full" p={8}>
          <Heading
            mb={5}
          >{`Classes (${labelClassWithShortcut.length})`}</Heading>
          <ClassTableActions
            searchText={searchText}
            setSearchText={setSearchText}
          />
          <ClassTableContent
            classes={labelClassWithShortcut}
            onDragEnd={onDragEnd}
          />
        </Box>
      )}
    </>
  );
};
