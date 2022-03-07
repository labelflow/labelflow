import { ModalFooter as ChakraModalFooter, Button } from "@chakra-ui/react";
import { useDatasetClasses } from "../dataset-classes.context";
import { ModalContext } from "./modal-context";

export const ModalFooter = () => {
  const { editClass } = useDatasetClasses();
  return (
    <ModalContext.Consumer>
      {({ errorMessage, classNameInputValue, classId, loading }) => (
        <ChakraModalFooter>
          <Button
            type="submit"
            colorScheme="brand"
            disabled={
              (classId ? editClass?.name === classNameInputValue : false) ||
              classNameInputValue === "" ||
              errorMessage !== "" ||
              loading
            }
            aria-label={classId ? "Update" : "Create"}
          >
            {classId ? "Update" : "Create"}
          </Button>
        </ChakraModalFooter>
      )}
    </ModalContext.Consumer>
  );
};
