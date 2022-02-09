import { useLazyQuery, useMutation, useQuery } from "@apollo/client";
import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/react";
import { getSlug } from "@labelflow/common-resolvers";
import { isEmpty } from "lodash/fp";
import debounce from "lodash/fp/debounce";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  GetDatasetByIdQuery,
  GetDatasetByIdQueryVariables,
} from "../../graphql-types/GetDatasetByIdQuery";
import { useWorkspace } from "../../hooks";
import { WORKSPACE_DATASETS_PAGE_DATASETS_QUERY } from "../../shared-queries/workspace-datasets-page.query";
import { CREATE_DATASET_MUTATION } from "./create-dataset.mutation";
import {
  GET_DATASET_BY_ID_QUERY,
  SEARCH_DATASET_BY_SLUG_QUERY,
} from "./datasets.query";
import { GET_DATASETS_IDS_QUERY } from "./get-datasets-ids.query";
import { UPDATE_DATASET_MUTATION } from "./update-dataset.mutation";

const debounceTime = 200;

export const UpsertDatasetModal = ({
  isOpen = false,
  onClose = () => {},
  datasetId = undefined,
}: {
  isOpen?: boolean;
  onClose?: () => void;
  datasetId?: string;
}) => {
  const { slug: workspaceSlug } = useWorkspace();

  const [datasetNameInputValue, setDatasetNameInputValue] =
    useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");

  const datasetName = datasetNameInputValue.trim();

  useQuery<GetDatasetByIdQuery, GetDatasetByIdQueryVariables>(
    GET_DATASET_BY_ID_QUERY,
    {
      skip: typeof datasetId !== "string" || isEmpty(datasetId),
      variables: { id: datasetId ?? "" },
      fetchPolicy: "cache-and-network",
      onError: (e) => {
        setErrorMessage(e.message);
      },
      onCompleted: ({ dataset }) => {
        setDatasetNameInputValue(dataset.name);
      },
    }
  );

  const [
    queryExistingDatasets,
    {
      data: existingDataset,
      loading: loadingExistingDatasets,
      variables: variablesExistingDatasets,
    },
  ] = useLazyQuery(SEARCH_DATASET_BY_SLUG_QUERY, {
    fetchPolicy: "network-only",
  });

  const [createDatasetMutate, { loading: createMutationLoading }] = useMutation(
    CREATE_DATASET_MUTATION,
    {
      variables: {
        name: datasetName,
        workspaceSlug,
      },
      refetchQueries: [
        GET_DATASETS_IDS_QUERY,
        WORKSPACE_DATASETS_PAGE_DATASETS_QUERY,
      ],
      awaitRefetchQueries: true,
    }
  );

  const [updateDatasetMutate, { loading: updateMutationLoading }] = useMutation(
    UPDATE_DATASET_MUTATION,
    {
      variables: {
        id: datasetId,
        name: datasetName,
      },
      refetchQueries: [
        GET_DATASETS_IDS_QUERY,
        WORKSPACE_DATASETS_PAGE_DATASETS_QUERY,
      ],
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
        variables: { slug: getSlug(nextName), workspaceSlug },
      });
    })
  ).current;

  useEffect(() => {
    if (datasetName === "" || workspaceSlug == null) return;
    debouncedQuery(datasetName, workspaceSlug);
  }, [datasetName, workspaceSlug]);

  useEffect(() => {
    if (
      existingDataset?.searchDataset?.id != null &&
      !loadingExistingDatasets &&
      existingDataset?.searchDataset?.id !== datasetId &&
      variablesExistingDatasets?.slug === getSlug(datasetName)
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
      } catch (error: any) {
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
            {datasetId ? "Update Dataset" : "Start Labeling"}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
