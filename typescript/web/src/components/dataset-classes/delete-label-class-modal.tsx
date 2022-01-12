import {
  gql,
  makeReference,
  Reference,
  useApolloClient,
  useQuery,
} from "@apollo/client";
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
} from "@chakra-ui/react";
import { isEmpty, isNil } from "lodash/fp";
import { useCallback, useRef } from "react";
import { useDatasetClasses } from "./dataset-classes.context";
import { getLabelClassByIdQuery } from "./dataset-classes.query";

const deleteLabelClassMutation = gql`
  mutation deleteLabelClass($id: ID!) {
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
  const { data } = useQuery(getLabelClassByIdQuery, {
    variables: { id: deleteClassId },
    skip: isEmpty(deleteClassId),
  });
  const client = useApolloClient();

  const deleteLabelClass = useCallback(() => {
    client.mutate({
      mutation: deleteLabelClassMutation,
      variables: { id: deleteClassId },
      refetchQueries: ["getDatasetLabelClasses", "getImageLabels"],
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
                labels.forEach((labelRef) => {
                  const labelClassRef: Reference | undefined = readField(
                    "labelClass",
                    labelRef
                  );
                  if (deleteClassId === readField("id", labelClassRef)) {
                    cache.modify({
                      /* eslint-disable-next-line no-underscore-dangle */
                      id: labelRef.__ref,
                      fields: {
                        labelClass: () => {
                          return null;
                        },
                      },
                    });
                  }
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
            Are you sure? Labels linked to this class will be set to the class
            None. This action can not be undone.
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
