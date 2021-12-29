import { ModalHeader as ChakraModalHeader, Heading } from "@chakra-ui/react";
import { ModalContext } from "./modal-context";

export const ModalHeader = () => (
  <ModalContext.Consumer>
    {({ classId }) => (
      <ChakraModalHeader textAlign="center" padding="6">
        <Heading as="h2" size="lg" pb="2">
          {classId ? "Edit Class" : "New Class"}
        </Heading>
      </ChakraModalHeader>
    )}
  </ModalContext.Consumer>
);
