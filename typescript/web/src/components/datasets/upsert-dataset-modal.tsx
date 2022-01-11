import { gql, useLazyQuery, useMutation, useQuery } from "@apollo/client";
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
import { Dataset, Query } from "@labelflow/graphql-types";
import debounce from "lodash/fp/debounce";
import { useRouter } from "next/router";
import { useCallback, useEffect, useRef, useState } from "react";
import slugify from "slugify";
import { getDatasetsQuery } from "./dataset-list";

const debounceTime = 200;

const createDatasetMutation = gql`
  mutation createDataset($name: String!, $workspaceSlug: String!) {
    createDataset(data: { name: $name, workspaceSlug: $workspaceSlug }) {
      id
      name
      slug
      images(first: 1) {
        id
        url
        thumbnail500Url
      }
      imagesAggregates {
        totalCount
      }
      labelsAggregates {
        totalCount
      }
      labelClassesAggregates {
        totalCount
      }
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
      where: { slugs: { slug: $slug, workspaceSlug: $workspaceSlug } }
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
  const workspaceSlug = useRouter()?.query?.workspaceSlug as string | undefined;

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

  const [createDatasetMutate, { loading: createMutationLoading }] = useMutation(
    createDatasetMutation,
    {
      variables: {
        name: datasetName,
        workspaceSlug,
      },
      update: (cache, { data }) => {
        if (data != null) {
          const { createDataset } = data;
          const datasetCacheResult = cache.readQuery<Pick<Query, "datasets">>({
            query: getDatasetsQuery,
            variables: { where: { workspaceSlug } },
          });
          if (datasetCacheResult?.datasets == null) {
            throw new Error(`Error retrieving datasets`);
          }

          const { datasets } = datasetCacheResult;
          const updatedDatasets = datasets.concat(createDataset);
          cache.writeQuery({
            query: getDatasetsQuery,
            variables: { where: { workspaceSlug } },
            data: { datasets: updatedDatasets },
          });
        } else {
          throw new Error("Received null data during dataset creation");
        }
      },
      refetchQueries: ["getPaginatedDatasets"],
      optimisticResponse: {
        createDataset: {
          id: "",
          __typename: "Dataset",
          name: datasetName,
          slug: slugify(datasetName),
          images: [],
          imagesAggregates: {
            __typename: "ImagesAggregates",
            totalCount: 0,
          },
          labelsAggregates: {
            __typename: "LabelsAggregates",
            totalCount: 0,
          },
          labelClassesAggregates: {
            __typename: "LabelClassesAggregates",
            totalCount: 0,
          },
        } as unknown as Dataset,
      },
    }
  );

  const [updateDatasetMutate, { loading: updateMutationLoading }] = useMutation(
    updateDatasetMutation,
    {
      variables: {
        id: datasetId,
        name: datasetName,
      },
      refetchQueries: ["getPaginatedDatasets"],
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
