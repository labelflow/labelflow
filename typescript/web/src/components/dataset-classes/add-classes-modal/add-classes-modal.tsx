import {
  Button,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  Heading,
  Modal,
  ModalBody as ChakraModalBody,
  ModalCloseButton,
  ModalContent as ChakraModalContent,
  ModalFooter as ChakraModalFooter,
  ModalHeader as ChakraModalHeader,
  ModalOverlay,
  Textarea,
} from "@chakra-ui/react";
import { isEmpty } from "lodash/fp";
import { FormEvent, KeyboardEvent, useCallback } from "react";
import {
  AddClassesModalProps,
  AddClassesModalProvider,
  useAddClassesModal,
} from "./add-classes-modal-context";

const Header = () => (
  <ChakraModalHeader textAlign="center" padding="6">
    <Heading as="h2" size="lg">
      Add New Classes
    </Heading>
  </ChakraModalHeader>
);

const NamesLabel = () => <FormLabel>Names</FormLabel>;

const useSubmitOnEnter = () => {
  const { submit } = useAddClassesModal();
  return useCallback(
    async (event: KeyboardEvent) => {
      if (event.key !== "Enter" || !event.ctrlKey) return;
      event.preventDefault();
      await submit();
    },
    [submit]
  );
};

const NamesInput = () => {
  const { value, setValue, loading } = useAddClassesModal();
  return (
    <Textarea
      data-testid="class-names-input"
      value={value}
      onChange={(event) => setValue(event.target.value)}
      onKeyDown={useSubmitOnEnter()}
      disabled={loading}
      size="md"
      minH="180"
      placeholder={"Dog\nCat\n..."}
      autoFocus
    />
  );
};

const HelperText = () => {
  const { count, duplicates } = useAddClassesModal();
  return (
    <FormHelperText color={duplicates > 0 ? "#EFAB22" : undefined}>
      {count} class{count !== 1 && "es"}{" "}
      {duplicates > 0 && "will be created. Duplicate class names are ignored."}
    </FormHelperText>
  );
};

const ErrorMessage = () => {
  const { error } = useAddClassesModal();
  return <FormErrorMessage>{error}</FormErrorMessage>;
};

const NamesFormControl = () => {
  const { error } = useAddClassesModal();
  return (
    <FormControl isInvalid={!isEmpty(error)} isRequired>
      <NamesLabel />
      <NamesInput />
      <HelperText />
      <ErrorMessage />
    </FormControl>
  );
};

const Body = () => (
  <ChakraModalBody pt="0">
    <NamesFormControl />
  </ChakraModalBody>
);

const Footer = () => {
  const { canSubmit } = useAddClassesModal();
  return (
    <ChakraModalFooter>
      <Button
        type="submit"
        colorScheme="brand"
        disabled={!canSubmit}
        aria-label="Create"
        data-testid="create-classes-button"
      >
        Create
      </Button>
    </ChakraModalFooter>
  );
};

const Content = () => {
  const { submit } = useAddClassesModal();
  const handleSubmit = useCallback(
    async (event: FormEvent) => {
      event.preventDefault();
      await submit();
    },
    [submit]
  );
  return (
    <ChakraModalContent as="form" onSubmit={handleSubmit}>
      <ModalCloseButton />
      <Header />
      <Body />
      <Footer />
    </ChakraModalContent>
  );
};

export const AddClassesModal = (props: AddClassesModalProps) => {
  const { isOpen, onClose } = props;
  return (
    <Modal
      scrollBehavior="inside"
      isOpen={isOpen}
      size="xl"
      onClose={onClose}
      isCentered
    >
      <ModalOverlay />
      <AddClassesModalProvider {...props}>
        <Content />
      </AddClassesModalProvider>
    </Modal>
  );
};
