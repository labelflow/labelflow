import { Modal, ModalOverlay } from "@chakra-ui/react";
import { isNil } from "lodash/fp";
import { useRouter } from "next/router";
import React, { ChangeEvent, useCallback, useEffect, useState } from "react";
import { LabelClassWithShortcut } from "../types";
import { useCreateLabelClassMutation } from "./create-label-class.mutation";
import { useLabelClassExists } from "./label-class-exists.query";
import { ModalContent } from "./modal-content";
import { ModalContext } from "./modal-context";
import { useUpdateLabelClass } from "./update-label-class-name.mutation";

const useCreateClass = (
  datasetId: string | undefined,
  datasetSlug: string | undefined,
  classId: string | undefined,
  className: string,
  classColor: string | undefined,
  onClose: () => void,
  setErrorMessage: (message: string) => void
) => {
  const workspaceSlug = useRouter()?.query?.workspaceSlug as string | undefined;
  const updateLabelClass = useUpdateLabelClass(classId, className, classColor);
  const createLabelClass = useCreateLabelClassMutation(
    workspaceSlug,
    datasetSlug,
    className,
    datasetId
  );
  return useCallback(
    async (event) => {
      event.preventDefault();
      if (className === "") return;
      try {
        if (classId) {
          await updateLabelClass();
        } else {
          await createLabelClass();
        }
        onClose();
      } catch (error: any) {
        setErrorMessage(error.message);
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
};

const useCheckName = (
  datasetId: string | undefined,
  className: string,
  setErrorMessage: (msg: string) => void
) => {
  const { data, variables } = useLabelClassExists(datasetId, className);
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
  useEffect(() => {
    if (!isOpen) {
      setClassNameInputValue("");
      setErrorMessage("");
    } else if (item) {
      setClassNameInputValue(item.name);
    }
  }, [isOpen]);
};

const useModalState = (
  item: LabelClassWithShortcut | undefined,
  datasetId: string | undefined,
  datasetSlug: string | undefined,
  isOpen: boolean,
  onClose: () => void
) => {
  const [classNameInputValue, setClassNameInputValue] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const handleInputValueChange = (event: ChangeEvent<HTMLInputElement>) => {
    setClassNameInputValue(event.target.value);
  };
  const classId = item?.id ?? undefined;
  const className = classNameInputValue?.trim() ?? "";
  useCheckName(datasetId, className, setErrorMessage);
  const createClass = useCreateClass(
    datasetId,
    datasetSlug,
    classId,
    className,
    item?.color ?? undefined,
    onClose,
    setErrorMessage
  );
  useModalObserver(isOpen, setClassNameInputValue, setErrorMessage, item);
  return {
    classId,
    createClass,
    classNameInputValue,
    errorMessage,
    handleInputValueChange,
  };
};

export interface UpsertClassModalProps {
  isOpen?: boolean;
  onClose: () => void;
  item?: LabelClassWithShortcut | null;
  datasetId?: string | null;
  datasetSlug?: string;
}

export const UpsertClassModal = ({
  isOpen = false,
  onClose,
  item = undefined,
  datasetId,
  datasetSlug,
}: UpsertClassModalProps) => {
  const state = useModalState(
    item ?? undefined,
    datasetId ?? undefined,
    datasetSlug,
    isOpen,
    onClose
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
      <ModalContext.Provider value={state}>
        <ModalContent />
      </ModalContext.Provider>
    </Modal>
  );
};
