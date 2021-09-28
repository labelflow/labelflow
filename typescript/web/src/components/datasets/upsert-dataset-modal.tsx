import { gql, useMutation, useLazyQuery, useQuery } from "@apollo/client";
import slugify from "slugify";
import { useEffect, useState, useCallback, useRef } from "react";
import debounce from "lodash/fp/debounce";

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
import { useRouter } from "next/router";

const debounceTime = 200;

const createDatasetMutation = gql`
  mutation createDataset($name: String!, $workspaceSlug: String!) {
    createDataset(data: { name: $name, workspaceSlug: $workspaceSlug }) {
      id
    }
  }
`;

const updateDatasetMutation = gql`
  mutation updateDataset($id: ID!, $name: String!) {
    updateDataset(where: { id: $id }, data: { name: $name }) {
      id
    }
  }
`;

const getDatasetBySlugQuery = gql`
  query getDatasetBySlug($slug: String!, $workspaceSlug: String!) {
    searchDataset(
      where: { slugs: { datasetSlug: $slug, workspaceSlug: $workspaceSlug } }
    ) {
      id
      slug
    }
  }
`;

const getDatasetByIdQuery = gql`
  query getDatasetById($id: ID) {
    dataset(where: { id: $id }) {
      id
      name
    }
  }
`;

export const UpsertDatasetModal = ({
  isOpen = false,
  onClose = () => {},
  datasetId = undefined,
}: {
  isOpen?: boolean;
  onClose?: () => void;
  datasetId?: string;
}) => {
  const workspaceSlug = useRouter().query?.workspaceSlug as string | undefined;
  // console.log(workspaceSlug);

  const [datasetNameInputValue, setDatasetNameInputValue] =
    useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");

  const datasetName = datasetNameInputValue.trim();

  useQuery(getDatasetByIdQuery, {
    skip: typeof datasetId !== "string",
    variables: { id: datasetId },
    fetchPolicy: "cache-and-network",
    onError: (e) => {
      setErrorMessage(e.message);
    },
    onCompleted: ({ dataset }) => {
      setDatasetNameInputValue(dataset.name);
    },
  });

  const [
    queryExistingDatasets,
    {
      data: existingDataset,
      loading: loadingExistingDatasets,
      variables: variablesExistingDatasets,
    },
  ] = useLazyQuery(getDatasetBySlugQuery, { fetchPolicy: "network-only" });

  console.log(existingDataset);

  const [createDatasetMutate, { loading: createMutationLoading }] = useMutation(
    createDatasetMutation,
    {
      variables: {
        name: datasetName,
        workspaceSlug,
      },
      refetchQueries: ["getDatasets"],
      awaitRefetchQueries: true,
    }
  );

  const [updateDatasetMutate, { loading: updateMutationLoading }] = useMutation(
    updateDatasetMutation,
    {
      variables: {
        id: datasetId,
        name: datasetName,
      },
      refetchQueries: ["getDatasets"],
      awaitRefetchQueries: true,
    }
  );

  const handleInputValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDatasetNameInputValue(e.target.value);
  };

  const debouncedQuery = useRef(
    // eslint-disable-next-line @typescript-eslint/no-shadow
    debounce(debounceTime, (nextName: string, workspaceSlug: string) => {
      return queryExistingDatasets({
        variables: { slug: slugify(nextName, { lower: true }), workspaceSlug },
      });
    })
  ).current;

  useEffect(() => {
    if (datasetName === "" || workspaceSlug == null) return;

    console.log("Query", datasetName, workspaceSlug);
    debouncedQuery(datasetName, workspaceSlug);
  }, [datasetName, workspaceSlug]);

  useEffect(() => {
    if (
      existingDataset != null &&
      !loadingExistingDatasets &&
      existingDataset?.searchDataset?.id !== datasetId &&
      variablesExistingDatasets?.slug === slugify(datasetName, { lower: true })
    ) {
      setErrorMessage("This name is already taken");
    } else {
      setErrorMessage("");
    }
  }, [existingDataset, datasetId, loadingExistingDatasets, datasetName]);

  const createDataset = useCallback(
    async (event) => {
      event.preventDefault();
      if (datasetName === "") return;

      try {
        if (datasetId) {
          await updateDatasetMutate();
        } else {
          await createDatasetMutate();
        }

        onClose();
      } catch (error) {
        setErrorMessage(error.message);
      }
    },
    [datasetName, onClose]
  );

  const isInputValid = () => errorMessage === "";

  const canCreateDataset = () => datasetName !== "" && isInputValid();

  useEffect(
    () => () => {
      if (!isOpen) {
        setDatasetNameInputValue("");
        setErrorMessage("");
      }
    },
    [isOpen]
  );

  return (
    <Modal
      scrollBehavior="inside"
      isOpen={isOpen}
      size="xl"
      onClose={onClose}
      isCentered
    >
      <ModalOverlay />
      <ModalContent as="form" onSubmit={createDataset}>
        <ModalCloseButton />

        <ModalHeader textAlign="center" padding="6">
          <Heading as="h2" size="lg" pb="2">
            {datasetId ? "Edit dataset" : "New Dataset"}
          </Heading>
        </ModalHeader>

        <ModalBody pt="0" pb="6" pr="20" pl="20">
          <FormControl isInvalid={!isInputValid()} isRequired>
            <FormLabel>Name</FormLabel>
            <Input
              value={datasetNameInputValue}
              placeholder="Dataset name"
              size="md"
              onChange={handleInputValueChange}
              aria-label="Dataset name input"
              autoFocus
            />
            <FormErrorMessage>{errorMessage}</FormErrorMessage>
          </FormControl>
        </ModalBody>

        <ModalFooter>
          <Button
            type="submit"
            colorScheme="brand"
            isLoading={createMutationLoading || updateMutationLoading}
            loadingText={datasetId ? "Updating..." : "Creating..."}
            disabled={!canCreateDataset()}
            aria-label={datasetId ? "Update Dataset" : "Create Dataset"}
          >
            {datasetId ? "Update Dataset" : "Start Labelling"}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
