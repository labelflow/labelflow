import { ApolloError, useMutation, useQuery } from "@apollo/client";
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
import { isEmpty, isNil } from "lodash/fp";
import {
  ChangeEvent,
  createContext,
  FormEvent,
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { useDebounce } from "use-debounce";
import {
  CreateDatasetMutation,
  CreateDatasetMutationVariables,
  DatasetExistsQuery,
  DatasetExistsQueryVariables,
  UpdateDatasetMutation,
  UpdateDatasetMutationVariables,
  GetDatasetByIdQuery,
  GetDatasetByIdQueryVariables,
} from "../../graphql-types";

import { useWorkspace } from "../../hooks";
import { WORKSPACE_DATASETS_PAGE_DATASETS_QUERY } from "../../shared-queries/workspace-datasets-page.query";
import { getApolloErrorMessage } from "../../utils/get-apollo-error-message";
import { CREATE_DATASET_MUTATION } from "./create-dataset.mutation";
import {
  DATASET_EXISTS_QUERY,
  GET_DATASET_BY_ID_QUERY,
} from "./datasets.query";
import { GET_DATASETS_IDS_QUERY } from "./get-datasets-ids.query";
import { UPDATE_DATASET_MUTATION } from "./update-dataset.mutation";

export type UpsertDatasetModalProps = {
  isOpen: boolean;
  onClose: () => void;
  datasetId?: string;
};

const PropsContext = createContext({} as UpsertDatasetModalProps);

const useProps = () => useContext(PropsContext);

type UpsertModalState = {
  onSubmit: (event: FormEvent) => void;
  name: string | undefined;
  onChangeName: (element: ChangeEvent<HTMLInputElement>) => void;
  error: string | undefined;
  loading: boolean;
  canSubmit: boolean;
};

const UpsertModalContext = createContext({} as UpsertModalState);

const useUpsertModal = () => useContext(UpsertModalContext);

const useSkipExists = (
  slug: string,
  defaultName: string,
  skip: boolean
): [boolean, boolean] => {
  const [debouncedSlug] = useDebounce(slug, 250, {
    leading: true,
    trailing: true,
  });
  const isDebouncing = slug !== debouncedSlug;
  const skipQuery =
    skip || isDebouncing || isEmpty(slug) || slug === getSlug(defaultName);
  return [skipQuery, isDebouncing];
};

const useDatasetNameQuery = () => {
  const { datasetId } = useProps();
  return useQuery<GetDatasetByIdQuery, GetDatasetByIdQueryVariables>(
    GET_DATASET_BY_ID_QUERY,
    {
      skip: isEmpty(datasetId),
      variables: { id: datasetId ?? "" },
      fetchPolicy: "cache-and-network",
    }
  );
};

type UseDatasetExistsProps = Pick<UpsertModalState, "name"> & {
  defaultName: string;
  nameLoading: boolean;
};

type UseDatasetExistsResult = { exists: boolean; error?: ApolloError };

const useDatasetExists = ({
  name,
  defaultName,
  nameLoading,
}: UseDatasetExistsProps): UseDatasetExistsResult => {
  const slug = getSlug(name ?? "");
  const { slug: workspaceSlug } = useWorkspace();
  const [skip, debouncing] = useSkipExists(slug, defaultName, nameLoading);
  const { data, loading, error } = useQuery<
    DatasetExistsQuery,
    DatasetExistsQueryVariables
  >(DATASET_EXISTS_QUERY, {
    variables: { slug, workspaceSlug },
    fetchPolicy: "network-only",
    skip,
  });
  const exists = !debouncing && !loading && !isNil(data) && data.datasetExists;
  return { exists, error };
};

type UseDatasetNameProps = {
  clearMutationError: () => void;
};

type UseDatasetNameResult = Pick<
  UpsertModalState,
  "name" | "loading" | "onChangeName"
> & {
  nameValue: string | undefined;
  error: ApolloError | undefined;
  exists: boolean;
};

const useDatasetName = ({
  clearMutationError,
}: UseDatasetNameProps): UseDatasetNameResult => {
  const { isOpen } = useProps();
  const [nameValue, setNameValue] = useState<string | undefined>(undefined);
  useEffect(
    () => () => {
      if (isOpen) return;
      setNameValue(undefined);
    },
    [isOpen]
  );
  const {
    error: nameError,
    loading: nameLoading,
    data: nameData,
  } = useDatasetNameQuery();
  const defaultName = nameData?.dataset.name ?? "";
  const name = nameValue ?? defaultName;
  const onChangeName = ({ target }: ChangeEvent<HTMLInputElement>) => {
    setNameValue(target.value);
    clearMutationError();
  };
  const { exists, error: existsError } = useDatasetExists({
    name,
    defaultName,
    nameLoading,
  });
  return {
    name,
    nameValue,
    onChangeName,
    loading: nameLoading,
    exists,
    error: nameError ?? existsError,
  };
};

type UseCreateDatasetProps = Pick<UpsertModalState, "name"> & {
  onError: (error: ApolloError | undefined) => void;
};

const useCreate = ({ name, onError }: UseCreateDatasetProps) => {
  const { slug: workspaceSlug } = useWorkspace();
  return useMutation<CreateDatasetMutation, CreateDatasetMutationVariables>(
    CREATE_DATASET_MUTATION,
    {
      variables: { name: name ?? "", workspaceSlug },
      refetchQueries: [
        GET_DATASETS_IDS_QUERY,
        WORKSPACE_DATASETS_PAGE_DATASETS_QUERY,
      ],
      awaitRefetchQueries: true,
      onError,
    }
  );
};

type UseUpdateDatasetProps = UseCreateDatasetProps;

const useUpdate = ({ name, onError }: UseUpdateDatasetProps) => {
  const { datasetId } = useProps();
  return useMutation<UpdateDatasetMutation, UpdateDatasetMutationVariables>(
    UPDATE_DATASET_MUTATION,
    {
      variables: { id: datasetId ?? "", name: name ?? "" },
      refetchQueries: [
        GET_DATASETS_IDS_QUERY,
        WORKSPACE_DATASETS_PAGE_DATASETS_QUERY,
      ],
      awaitRefetchQueries: true,
      onError,
    }
  );
};

type UseOnSubmitProps = Pick<UpsertModalState, "canSubmit" | "name"> &
  Pick<UseUpdateDatasetProps, "onError">;

type UseOnSubmitResult = Pick<UpsertModalState, "onSubmit" | "loading">;

const useOnSubmit = ({
  canSubmit,
  name,
  onError,
}: UseOnSubmitProps): UseOnSubmitResult => {
  const { datasetId, onClose } = useProps();
  const [create, { loading: createLoading }] = useCreate({ name, onError });
  const [update, { loading: updateLoading }] = useUpdate({ name, onError });
  const onSubmit = useCallback(
    async (event: FormEvent) => {
      event.preventDefault();
      if (!canSubmit) return;
      if (datasetId) {
        await update();
      } else {
        await create();
      }
      onClose?.();
    },
    [canSubmit, datasetId, onClose, update, create]
  );
  return { loading: createLoading || updateLoading, onSubmit };
};

type UseErrorMessageProps = Pick<UseDatasetExistsResult, "exists"> & {
  nameError: ApolloError | undefined;
  mutationError: ApolloError | undefined;
};

const useErrorMessage = ({
  nameError,
  mutationError,
  exists,
}: UseErrorMessageProps): string => {
  const apolloError = nameError ?? mutationError;
  const mutationErrorMessage = isNil(apolloError)
    ? undefined
    : getApolloErrorMessage(apolloError);
  return !isNil(mutationErrorMessage) || exists
    ? mutationErrorMessage ?? "This name is already taken"
    : "";
};

const useUpsertModalProps = (): UpsertModalState => {
  const [mutationError, setMutationError] =
    useState<ApolloError | undefined>(undefined);
  const clearMutationError = useCallback(() => {
    if (isNil(mutationError)) return;
    setMutationError(undefined);
  }, [mutationError]);
  const {
    name,
    nameValue,
    loading: loadingName,
    error: nameError,
    exists,
    onChangeName,
  } = useDatasetName({ clearMutationError });
  const canSubmit = !isEmpty(nameValue) && !exists;
  const { onSubmit, loading: loadingMutation } = useOnSubmit({
    name,
    canSubmit,
    onError: setMutationError,
  });
  return {
    name,
    onChangeName,
    loading: loadingName || loadingMutation,
    error: useErrorMessage({ exists, nameError, mutationError }),
    canSubmit,
    onSubmit,
  };
};

const UpsertModalProvider = ({ children }: PropsWithChildren<{}>) => (
  <UpsertModalContext.Provider value={useUpsertModalProps()}>
    {children}
  </UpsertModalContext.Provider>
);

function Header() {
  const { datasetId } = useProps();
  return (
    <ModalHeader textAlign="center" padding="6">
      <Heading as="h2" size="lg" pb="2">
        {datasetId ? "Edit dataset" : "New Dataset"}
      </Heading>
    </ModalHeader>
  );
}

const NameInput = () => {
  const { name, onChangeName } = useUpsertModal();
  return (
    <Input
      value={name}
      placeholder="Dataset name"
      size="md"
      onChange={onChangeName}
      aria-label="Dataset name input"
      autoFocus
    />
  );
};

const NameControl = () => {
  const { error } = useUpsertModal();
  return (
    <FormControl isInvalid={!isNil(error)} isRequired>
      <FormLabel>Name</FormLabel>
      <NameInput />
      <FormErrorMessage>{error}</FormErrorMessage>
    </FormControl>
  );
};

const Body = () => {
  return (
    <ModalBody pt="0" pb="6" pr="20" pl="20">
      <NameControl />
    </ModalBody>
  );
};

const SubmitButton = () => {
  const { datasetId } = useProps();
  const { loading, canSubmit } = useUpsertModal();
  return (
    <Button
      type="submit"
      colorScheme="brand"
      isLoading={loading}
      loadingText={datasetId ? "Updating..." : "Creating..."}
      disabled={!canSubmit}
      aria-label={datasetId ? "Update Dataset" : "Create Dataset"}
    >
      {datasetId ? "Update Dataset" : "Start Labeling"}
    </Button>
  );
};

const Footer = () => (
  <ModalFooter>
    <SubmitButton />
  </ModalFooter>
);

const Content = () => {
  const { onSubmit } = useUpsertModal();
  return (
    <ModalContent as="form" onSubmit={onSubmit}>
      <ModalCloseButton />
      <Header />
      <Body />
      <Footer />
    </ModalContent>
  );
};

export const UpsertModalComponent = () => {
  const { isOpen, onClose } = useProps();
  return (
    <Modal
      scrollBehavior="inside"
      isOpen={isOpen}
      size="xl"
      onClose={onClose}
      isCentered
    >
      <ModalOverlay />
      <Content />
    </Modal>
  );
};

export const UpsertDatasetModal = (props: UpsertDatasetModalProps) => (
  <PropsContext.Provider value={props}>
    <UpsertModalProvider>
      <UpsertModalComponent />
    </UpsertModalProvider>
  </PropsContext.Provider>
);
