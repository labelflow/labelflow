import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
  HStack,
} from "@chakra-ui/react";
import {
  createContext,
  PropsWithChildren,
  RefObject,
  useContext,
  useRef,
} from "react";

export type DeleteModalProps = {
  isOpen: boolean;
  onClose: () => void;
  deleting: boolean;
  onDelete: () => Promise<void>;
  header: string;
  body: string;
};

type DeleteModalState = DeleteModalProps & {
  cancelRef: RefObject<HTMLButtonElement>;
};

const DeleteModalContext = createContext({} as DeleteModalState);

const useDeleteModal = () => useContext(DeleteModalContext);

const useProvider = (props: DeleteModalProps): DeleteModalState => {
  const cancelRef = useRef<HTMLButtonElement>(null);
  return { ...props, cancelRef };
};

type DeleteModalProviderProps = PropsWithChildren<DeleteModalProps>;

const DeleteModalProvider = ({
  children,
  ...props
}: DeleteModalProviderProps) => (
  <DeleteModalContext.Provider value={useProvider(props)}>
    {children}
  </DeleteModalContext.Provider>
);

const Header = () => {
  const { header } = useDeleteModal();
  return <AlertDialogHeader>{header}</AlertDialogHeader>;
};

const Body = () => {
  const { body } = useDeleteModal();
  return <AlertDialogBody>{body}</AlertDialogBody>;
};

const CancelButton = () => {
  const { deleting, onClose, cancelRef } = useDeleteModal();
  return (
    <Button
      ref={cancelRef}
      disabled={deleting}
      onClick={onClose}
      aria-label="Cancel delete"
    >
      Cancel
    </Button>
  );
};

const DeleteButton = () => {
  const { deleting, onDelete } = useDeleteModal();
  return (
    <Button
      data-testid="confirm-delete-button"
      disabled={deleting}
      isLoading={deleting}
      loadingText="Deleting..."
      onClick={onDelete}
      colorScheme="red"
      aria-label="Confirm delete"
    >
      Delete
    </Button>
  );
};

const Footer = () => (
  <AlertDialogFooter as={HStack}>
    <CancelButton />
    <DeleteButton />
  </AlertDialogFooter>
);

const Content = () => (
  <AlertDialogContent>
    <Header />
    <Body />
    <Footer />
  </AlertDialogContent>
);

const DeleteModalComponent = () => {
  const { isOpen, cancelRef, onClose } = useDeleteModal();
  return (
    <AlertDialog
      isOpen={isOpen}
      leastDestructiveRef={cancelRef}
      onClose={onClose}
      isCentered
    >
      <AlertDialogOverlay>
        <Content />
      </AlertDialogOverlay>
    </AlertDialog>
  );
};

export const DeleteModal = (props: DeleteModalProps) => (
  <DeleteModalProvider {...props}>
    <DeleteModalComponent />
  </DeleteModalProvider>
);
