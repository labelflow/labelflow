import { useRef } from "react";
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
} from "@chakra-ui/react";

export const IogAlertDialog = ({
  isOpen = false,
  onClose = () => {},
  onAccept = () => {},
}: {
  isOpen?: boolean;
  onClose?: () => void;
  onAccept?: () => void;
}) => {
  const cancelRef = useRef<HTMLButtonElement>(null);

  return (
    <AlertDialog
      isOpen={isOpen}
      leastDestructiveRef={cancelRef}
      onClose={onClose}
      isCentered
    >
      <AlertDialogOverlay>
        <AlertDialogContent>
          <AlertDialogHeader>
            Auto Polygon automatically converts a bounding box into a polygon
          </AlertDialogHeader>

          <AlertDialogBody>
            Images annotated with the Auto Polygon tool are processed on our
            secured servers.
          </AlertDialogBody>

          <AlertDialogFooter>
            <Button
              ref={cancelRef}
              onClick={onClose}
              aria-label="Cancel using auto polygon"
            >
              Cancel
            </Button>
            <Button
              colorScheme="brand"
              onClick={() => {
                onAccept();
                onClose();
              }}
              aria-label="Confirm using auto polygon tool"
              ml={3}
            >
              Continue
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  );
};
