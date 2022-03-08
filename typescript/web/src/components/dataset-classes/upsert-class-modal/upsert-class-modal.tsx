import { ApolloError } from "@apollo/client";
import { Modal, ModalOverlay } from "@chakra-ui/react";
import { isEmpty, isNil } from "lodash/fp";
import React, {
  ChangeEvent,
  FormEvent,
  useCallback,
  useEffect,
  useState,
} from "react";
import { useDataset, useWorkspace } from "../../../hooks";
import { useDatasetClasses } from "../dataset-classes.context";
import { LabelClassWithShortcut } from "../types";
import { useCreateLabelClassMutation } from "./create-label-class.mutation";
import { useLabelClassExists } from "./label-class-exists.query";
import { ModalContent } from "./modal-content";
import { ModalContext } from "./modal-context";
import { useUpdateLabelClass } from "./update-label-class-name.mutation";

const useSubmit = (
  datasetId: string,
  classId: string | undefined,
  className: string,
  classColor: string | undefined,
  onClose: () => void,
  setErrorMessage: (message: string) => void
): [(event: FormEvent) => Promise<void>, boolean] => {
  const { slug: workspaceSlug } = useWorkspace();
  const { slug: datasetSlug } = useDataset();
  const [updateLabelClass, { loading: updating }] = useUpdateLabelClass(
    classId,
    className,
    classColor
  );
  const [createLabelClass, { loading: creating }] = useCreateLabelClassMutation(
    workspaceSlug,
    datasetSlug,
    className,
    datasetId
  );
  const onSubmit = useCallback(
    async (event: FormEvent) => {
      event.preventDefault();
      if (isEmpty(className)) return;
      try {
        if (!isNil(classId)) {
          await updateLabelClass();
        } else {
          await createLabelClass();
        }
        onClose();
      } catch (error) {
        if (error instanceof ApolloError) {
          setErrorMessage(error.message);
          throw error;
        } else {
          throw error;
        }
      }
    },
    [
      classId,
      className,
      createLabelClass,
      onClose,
      setErrorMessage,
      updateLabelClass,
    ]
  );
  return [onSubmit, creating || updating];
};

const useCheckName = (
  datasetId: string,
  className: string,
  setErrorMessage: (msg: string) => void
) => {
  const { editClass } = useDatasetClasses();
  const { data, variables } = useLabelClassExists(
    datasetId,
    className,
    editClass?.name === className
  );
  const exists =
    !isNil(data) && data.labelClassExists && variables?.name === className;
  useEffect(
    () => {
      const newErrorMessage = exists ? "This name is already taken" : "";
      setErrorMessage(newErrorMessage);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [datasetId, exists]
  );
};

const useModalObserver = (
  isOpen: boolean,
  setClassNameInputValue: React.Dispatch<React.SetStateAction<string>>,
  setErrorMessage: React.Dispatch<React.SetStateAction<string>>,
  item: LabelClassWithShortcut | null | undefined
) => {
  useEffect(
    () => {
      if (!isOpen) {
        setClassNameInputValue("");
        setErrorMessage("");
      } else if (item) {
        setClassNameInputValue(item.name);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [isOpen]
  );
};

export interface UpsertClassModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const useModalState = ({ isOpen, onClose }: UpsertClassModalProps) => {
  const { editClass, datasetId } = useDatasetClasses();
  const [classNameInputValue, setClassNameInputValue] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const handleInputValueChange = (event: ChangeEvent<HTMLInputElement>) => {
    setClassNameInputValue(event.target.value);
  };
  const classId = editClass?.id ?? undefined;
  const className = classNameInputValue?.trim() ?? "";
  useCheckName(datasetId ?? "", className, setErrorMessage);
  const [createClass, loading] = useSubmit(
    datasetId ?? "",
    classId,
    className,
    editClass?.color ?? undefined,
    onClose,
    setErrorMessage
  );
  useModalObserver(isOpen, setClassNameInputValue, setErrorMessage, editClass);
  return {
    classId,
    createClass,
    classNameInputValue,
    errorMessage,
    handleInputValueChange,
    loading,
  };
};

export const UpsertClassModal = (props: UpsertClassModalProps) => {
  const { isOpen, onClose } = props;
  const state = useModalState(props);
  return (
    <Modal
      scrollBehavior="inside"
      isOpen={isOpen}
      size="xl"
      onClose={onClose}
      isCentered
    >
      <ModalOverlay />
      <ModalContext.Provider value={state}>
        <ModalContent />
      </ModalContext.Provider>
    </Modal>
  );
};
