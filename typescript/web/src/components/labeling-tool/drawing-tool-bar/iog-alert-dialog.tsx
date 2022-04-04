import { useRef } from "react";
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
  Link,
} from "@chakra-ui/react";
import { DOCUMENTATION_URL } from "../../../constants";

export const IogAlertDialog = ({
  isOpen = false,
  onClose = () => {},
  onAccept = () => {},
  onCancel = () => {},
}: {
  isOpen?: boolean;
  onClose?: () => void;
  onAccept?: () => void;
  onCancel?: () => void;
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
            Auto-Polygon automatically converts a bounding box into a polygon
          </AlertDialogHeader>

          <AlertDialogBody>
            Images annotated with the Auto-Polygon tool are processed on our
            secured servers. <br />
            Check the documentation{" "}
            <Link
              href={`${DOCUMENTATION_URL}/labelflow/labelling-interface/label-types/auto-polygons`}
              color="brand.600"
              target="_blank"
            >
              here
            </Link>
            .
          </AlertDialogBody>

          <AlertDialogFooter>
            <Button
              ref={cancelRef}
              onClick={() => {
                onCancel();
                onClose();
              }}
              aria-label="Cancel using Auto-Polygon"
            >
              Cancel
            </Button>
            <Button
              colorScheme="brand"
              onClick={() => {
                onAccept();
                onClose();
              }}
              aria-label="Confirm using Auto-Polygon tool"
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
