import {
  ModalBody as ChakraModalBody,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
} from "@chakra-ui/react";
import { ModalContext } from "./modal-context";

export const ModalBody = () => {
  return (
    <ModalContext.Consumer>
      {({ classNameInputValue, handleInputValueChange, errorMessage }) => {
        return (
          <ChakraModalBody pt="0" pb="6" pr="20" pl="20">
            <FormControl isInvalid={errorMessage !== ""} isRequired>
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
          </ChakraModalBody>
        );
      }}
    </ModalContext.Consumer>
  );
};
