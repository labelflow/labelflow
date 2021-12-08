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
import { useState, useCallback, useEffect } from "react";

export const UpsertClassModal = ({
  isOpen = false,
  onClose = () => {},
  classId = undefined,
}: {
  isOpen?: boolean;
  onClose?: () => void;
  classId?: string | null;
}) => {
  const [classNameInputValue, setClassNameInputValue] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const handleInputValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setClassNameInputValue(e.target.value);
  };
  const className = classNameInputValue.trim();

  const createClass = useCallback(
    async (event) => {
      event.preventDefault();
      if (className === "") return;

      try {
        if (classId) {
          // TODO: perform update
          console.log("update");
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
          {/* TODO: change isInvalid */}
          <FormControl isInvalid={false} isRequired>
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
            // TODO: change disabled
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
