import { ModalFooter as ChakraModalFooter, Button } from "@chakra-ui/react";
import { ModalContext } from "./modal-context";

export const ModalFooter = () => (
  <ModalContext.Consumer>
    {({
      errorMessage,
      classNameInputValue,
      classId,
      isClassCreationPending,
    }) => (
      <ChakraModalFooter>
        <Button
          type="submit"
          colorScheme="brand"
          disabled={
            classNameInputValue === "" ||
            errorMessage !== "" ||
            isClassCreationPending
          }
          aria-label={classId ? "Update" : "Create"}
        >
          {classId ? "Update" : "Create"}
        </Button>
      </ChakraModalFooter>
    )}
  </ModalContext.Consumer>
);
