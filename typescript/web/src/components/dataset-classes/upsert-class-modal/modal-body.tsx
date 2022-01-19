import {
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  ModalBody as ChakraModalBody,
} from "@chakra-ui/react";
import { useContext } from "react";
import { ModalContext } from "./modal-context";

export const ModalBody = () => {
  const { classNameInputValue, handleInputValueChange, errorMessage, loading } =
    useContext(ModalContext);
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
          disabled={loading}
        />
        <FormErrorMessage>{errorMessage}</FormErrorMessage>
      </FormControl>
    </ChakraModalBody>
  );
};
