import { gql, useQuery, useLazyQuery, useApolloClient } from "@apollo/client";
import { v4 as uuid } from "uuid";
import { useRouter } from "next/router";
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
import debounce from "lodash/fp/debounce";
import {
  getNextClassColor,
  hexColorSequence,
} from "../../utils/class-color-generator";
import { LabelClassWithShortcut } from "./types";

type DatasetClassesQueryResult = {
  dataset: {
    id: string;
    name: string;
    labelClasses: {
      id: string;
      index: number;
      name: string;
      color: string;
    }[];
  };
};

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
      color
    }
  }
`;

const createLabelClassMutation = gql`
  mutation createLabelClass(
    $id: ID!
    $name: String!
    $color: ColorHex
    $datasetId: ID!
  ) {
    createLabelClass(
      data: { name: $name, id: $id, color: $color, datasetId: $datasetId }
    ) {
      id
      name
      color
    }
  }
`;

export const UpsertClassModal = ({
  isOpen = false,
  onClose = () => {},
  item = undefined,
  datasetId = undefined,
  datasetSlug,
}: {
  isOpen?: boolean;
  onClose?: () => void;
  item?: LabelClassWithShortcut | null;
  datasetId?: string | null;
  datasetSlug?: string;
}) => {
  const classId = item?.id ?? undefined;
  const classColor = item?.color ?? undefined;
  const client = useApolloClient();
  const [classNameInputValue, setClassNameInputValue] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const handleInputValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setClassNameInputValue(e.target.value);
  };
  const className = classNameInputValue.trim();

  const workspaceSlug = useRouter()?.query?.workspaceSlug as string | undefined;

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
          color
        }
      }
    }
  `;

  const { data: queryData } = useQuery(datasetLabelClassesQuery, {
    variables: { slug: datasetSlug, workspaceSlug },
    skip: !datasetSlug || !workspaceSlug,
  });

  const updateLabelClassWithOptimistic = useCallback(async () => {
    await client.mutate({
      mutation: updateLabelClassNameMutation,
      variables: { id: classId, name: className },
      optimisticResponse: {
        updateLabelClass: {
          id: classId,
          name: className,
          color: classColor,
          __typeName: "LabelClass",
        },
      },
    });
  }, [classId, className]);

  const createLabelClassWithOptimistic = useCallback(async () => {
    const newClassId = uuid();
    const labelClasses = queryData?.dataset?.labelClasses ?? [];
    const color =
      labelClasses.length < 1
        ? hexColorSequence[0]
        : getNextClassColor(labelClasses[labelClasses.length - 1].color);

    await client.mutate({
      mutation: createLabelClassMutation,
      variables: { id: newClassId, name: className, color, datasetId },
      optimisticResponse: {
        createLabelClass: {
          id: newClassId,
          name: className,
          color,
          datasetId,
          __typeName: "LabelClass",
        },
      },
      update: (cache, { data }) => {
        if (data != null) {
          const { createLabelClass } = data;
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
          const newLabelClass = {
            ...createLabelClass,
            index: dataset.labelClasses.length,
          };
          const updatedLabelClasses = dataset.labelClasses.concat({
            ...newLabelClass,
          });
          const updatedDataset = {
            ...dataset,
            labelClasses: updatedLabelClasses,
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
  }, [datasetId, queryData, className]);

  const [
    queryExistingLabelClass,
    {
      data: existingLabelClass,
      loading: loadingExistingLabelClass,
      variables: variablesExistingLabelClass,
    },
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
      !loadingExistingLabelClass &&
      variablesExistingLabelClass?.name === className
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
          await updateLabelClassWithOptimistic();
        } else {
          await createLabelClassWithOptimistic();
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
