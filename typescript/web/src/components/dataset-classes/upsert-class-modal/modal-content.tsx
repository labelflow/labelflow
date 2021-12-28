import {
  ModalContent as ChakraModalContent,
  ModalCloseButton,
} from "@chakra-ui/react";
import { ModalContext } from "./modal-context";
import { ModalHeader } from "./modal-header";
import { ModalBody } from "./modal-body";
import { ModalFooter } from "./modal-footer";

export const ModalContent = () => (
  <ModalContext.Consumer>
    {({ createClass }) => (
      <ChakraModalContent as="form" onSubmit={createClass}>
        <ModalCloseButton />
        <ModalHeader />
        <ModalBody />
        <ModalFooter />
      </ChakraModalContent>
    )}
  </ModalContext.Consumer>
);
