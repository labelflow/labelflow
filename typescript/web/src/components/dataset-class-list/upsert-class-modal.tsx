import { gql, useLazyQuery, useApolloClient } from "@apollo/client";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalCloseButton,
  ModalFooter,
  Button,
  ModalHeader,
  Heading,
  ModalBody,
  Input,
  FormControl,
  FormErrorMessage,
  FormLabel,
} from "@chakra-ui/react";
import { useState, useCallback, useEffect, useRef } from "react";
import { debounce } from "lodash/fp";
import { DatasetClassesQueryResult } from "./types";

const debounceTime = 200;

const isLabelClassAlreadyTakenQuery = gql`
  query isLabelClassNameAlreadyTaken($datasetId: ID!, $name: String!) {
    isLabelClassNameAlreadyTaken(where: { datasetId: $datasetId, name: $name })
  }
`;

const updateLabelClassNameMutation = gql`
  mutation updateLabelClassName($id: ID!, $name: String!) {
    updateLabelClass(where: { id: $id }, data: { name: $name }) {
      id
      name
    }
  }
`;

export const UpsertClassModal = ({
  isOpen = false,
  onClose = () => {},
  classId = undefined,
  datasetId = undefined,
  datasetSlug,
  workspaceSlug,
}: {
  isOpen?: boolean;
  onClose?: () => void;
  classId?: string | null;
  datasetId?: string | null;
  datasetSlug: string;
  workspaceSlug: string;
}) => {
  const client = useApolloClient();
  const [classNameInputValue, setClassNameInputValue] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const handleInputValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setClassNameInputValue(e.target.value);
  };
  const className = classNameInputValue.trim();

  const datasetLabelClassesQuery = gql`
    query getDatasetLabelClasses($slug: String!, $workspaceSlug: String!) {
      dataset(
        where: { slugs: { slug: $slug, workspaceSlug: $workspaceSlug } }
      ) {
        id
        name
        labelClasses {
          id
          name
        }
      }
    }
  `;

  const updateLabelClassNameWithOptimistic = useCallback(() => {
    client.mutate({
      mutation: updateLabelClassNameMutation,
      variables: { id: classId, name: className },
      optimisticResponse: {
        updateLabelClass: {
          id: classId,
          name: className,
          __typeName: "LabelClass",
        },
      },
      update: (cache, { data }) => {
        if (data != null) {
          const { updateLabelClass } = data;
          const datasetCacheResult = cache.readQuery<DatasetClassesQueryResult>(
            {
              query: datasetLabelClassesQuery,
              variables: { slug: datasetSlug, workspaceSlug },
            }
          );
          if (datasetCacheResult?.dataset == null) {
            throw new Error(`Missing dataset with slug ${datasetSlug}`);
          }
          const { dataset } = datasetCacheResult;
          const updatedDataset = {
            ...dataset,
            labelClasses: dataset.labelClasses.map((labelClass) =>
              labelClass.id !== classId ? labelClass : { ...updateLabelClass }
            ),
          };
          cache.writeQuery({
            query: datasetLabelClassesQuery,
            variables: { slug: datasetSlug, workspaceSlug },
            data: { dataset: updatedDataset },
          });
        } else {
          throw new Error(
            "Received null data in update label class name function"
          );
        }
      },
    });
  }, [className, classId, datasetSlug]);

  const [
    queryExistingLabelClass,
    { data: existingLabelClass, loading: loadingExistingLabelClass },
  ] = useLazyQuery(isLabelClassAlreadyTakenQuery, {
    fetchPolicy: "network-only",
  });

  const debouncedQuery = useRef(
    debounce(
      debounceTime,
      (newClassName: string, id: string | null | undefined) => {
        return queryExistingLabelClass({
          variables: { datasetId: id, name: newClassName },
        });
      }
    )
  ).current;

  useEffect(() => {
    if (className === "") return;
    debouncedQuery(className, datasetId);
  }, [className]);

  useEffect(() => {
    if (
      existingLabelClass?.isLabelClassNameAlreadyTaken &&
      !loadingExistingLabelClass
    ) {
      setErrorMessage("This name is already taken");
    } else {
      setErrorMessage("");
    }
  }, [className, datasetId, loadingExistingLabelClass, existingLabelClass]);

  const createClass = useCallback(
    async (event) => {
      event.preventDefault();
      if (className === "") return;

      try {
        if (classId) {
          updateLabelClassNameWithOptimistic();
        } else {
          // TODO: perform create
          console.log("create");
        }

        onClose();
      } catch (error: any) {
        setErrorMessage(error.message);
      }
    },
    [className, onClose]
  );

  const isInputValid = () => errorMessage === "";

  const canCreateClass = () => className !== "" && isInputValid();

  useEffect(() => {
    if (!isOpen) {
      setClassNameInputValue("");
      setErrorMessage("");
    }
  }, [isOpen]);

  return (
    <Modal
      scrollBehavior="inside"
      isOpen={isOpen}
      size="xl"
      onClose={onClose}
      isCentered
    >
      <ModalOverlay />
      <ModalContent as="form" onSubmit={createClass}>
        <ModalCloseButton />

        <ModalHeader textAlign="center" padding="6">
          <Heading as="h2" size="lg" pb="2">
            {classId ? "Edit Class" : "New Class"}
          </Heading>
        </ModalHeader>

        <ModalBody pt="0" pb="6" pr="20" pl="20">
          <FormControl isInvalid={!isInputValid()} isRequired>
            <FormLabel>Name</FormLabel>
            <Input
              value={classNameInputValue}
              placeholder="Class name"
              size="md"
              onChange={handleInputValueChange}
              aria-label="Class name input"
              autoFocus
            />
            <FormErrorMessage>{errorMessage}</FormErrorMessage>
          </FormControl>
        </ModalBody>

        <ModalFooter>
          <Button
            type="submit"
            colorScheme="brand"
            // TODO: change is loading
            isLoading={false}
            loadingText={classId ? "Updating..." : "Creating..."}
            disabled={!canCreateClass()}
            aria-label={classId ? "Update" : "Create"}
          >
            {classId ? "Update" : "Create"}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
