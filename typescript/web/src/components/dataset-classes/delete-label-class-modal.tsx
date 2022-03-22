import {
  gql,
  makeReference,
  Reference,
  useApolloClient,
  useQuery,
} from "@apollo/client";
import { getOperationName } from "@apollo/client/utilities";
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
} from "@chakra-ui/react";
import { isEmpty, isNil, partition } from "lodash/fp";
import { useCallback, useRef } from "react";
import {
  GetLabelClassByIdQuery,
  GetLabelClassByIdQueryVariables,
} from "../../graphql-types/GetLabelClassByIdQuery";
import { useDatasetClasses } from "./dataset-classes.context";
import {
  DATASET_LABEL_CLASSES_QUERY_WITH_COUNT,
  GET_LABEL_CLASS_BY_ID_QUERY,
} from "./dataset-classes.query";

export const DELETE_LABEL_CLASS_MUTATION = gql`
  mutation DeleteLabelClassMutation($id: ID!) {
    deleteLabelClass(where: { id: $id }) {
      id
    }
  }
`;

export const DeleteLabelClassModal = () => {
  const { datasetId, deleteClassId, setDeleteClassId } = useDatasetClasses();

  const isOpen = !isNil(deleteClassId);
  const onClose = useCallback(
    () => setDeleteClassId(undefined),
    [setDeleteClassId]
  );

  const cancelRef = useRef<HTMLButtonElement>(null);
  const { data } = useQuery<
    GetLabelClassByIdQuery,
    GetLabelClassByIdQueryVariables
  >(GET_LABEL_CLASS_BY_ID_QUERY, {
    variables: { id: deleteClassId ?? "" },
    skip: isEmpty(deleteClassId),
  });
  const client = useApolloClient();

  const deleteLabelClass = useCallback(() => {
    client.mutate({
      mutation: DELETE_LABEL_CLASS_MUTATION,
      variables: { id: deleteClassId },
      refetchQueries: [
        getOperationName(DATASET_LABEL_CLASSES_QUERY_WITH_COUNT)!,
      ],
      update(cache) {
        cache.modify({
          id: cache.identify({ id: datasetId, __typename: "Dataset" }),
          fields: {
            labelClassesAggregates: (existingAggregates) => {
              return {
                ...existingAggregates,
                totalCount: existingAggregates.totalCount - 1,
              };
            },
            images: (existingImageRefs, { readField }) => {
              existingImageRefs.forEach((imageRef: Reference) => {
                const labels = readField(
                  "labels",
                  imageRef
                ) as unknown as Reference[];
                if (!labels) return;
                const [labelsToDelete, labelsToKeep] = partition((labelRef) => {
                  const labelClassRef: Reference | undefined = readField(
                    "labelClass",
                    labelRef
                  );
                  return deleteClassId === readField("id", labelClassRef);
                }, labels);
                cache.modify({
                  // eslint-disable-next-line no-underscore-dangle
                  id: imageRef.__ref,
                  fields: {
                    labels: () => labelsToKeep,
                  },
                });
                labelsToDelete.forEach((labelRef) => {
                  cache.evict({
                    /* eslint-disable-next-line no-underscore-dangle */
                    id: labelRef.__ref,
                  });
                });
              });
              return existingImageRefs;
            },
          },
        });
        cache.modify({
          id: cache.identify(makeReference("ROOT_QUERY")),
          fields: {
            labelClasses: (existingLabelClassesRefs, { readField }) => {
              return existingLabelClassesRefs.filter(
                (labelClassRef: Reference) =>
                  deleteClassId !== readField("id", labelClassRef)
              );
            },
          },
        });
      },
    });
    onClose();
  }, [client, deleteClassId, onClose, datasetId]);

  return (
    <AlertDialog
      isOpen={isOpen}
      leastDestructiveRef={cancelRef}
      onClose={onClose}
      isCentered
    >
      <AlertDialogOverlay>
        <AlertDialogContent>
          <AlertDialogHeader>
            Delete Class {data?.labelClass?.name}
          </AlertDialogHeader>

          <AlertDialogBody>
            Are you sure? Labels linked to this class will be deleted. This
            action cannot be undone.
          </AlertDialogBody>

          <AlertDialogFooter>
            <Button
              ref={cancelRef}
              onClick={onClose}
              aria-label="Cancel delete label class"
            >
              Cancel
            </Button>
            <Button
              colorScheme="red"
              onClick={deleteLabelClass}
              aria-label="Confirm delete label class"
              ml={3}
            >
              Delete
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  );
};
