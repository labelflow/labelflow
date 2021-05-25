import { IconButton, useDisclosure } from "@chakra-ui/react";
import { useMutation } from "@apollo/client";
import gql from "graphql-tag";
import { ImportImagesModal } from "./import-images-modal";

const createImageMutation = gql`
  mutation createImageMutation($file: Upload!) {
    createImage(file: $file) {
      id
    }
  }
`;

export const ImportButton = () => {
  const { isOpen, onClose, onOpen } = useDisclosure();

  // @ts-ignore
  const [createImage, { data }] = useMutation(createImageMutation);

  const onImportSucceed = (files: any) => {
    files.forEach(console.log);
  };

  return (
    <>
      <ImportImagesModal
        isOpen={isOpen}
        onClose={onClose}
        onImportSucceed={onImportSucceed}
      />
      <IconButton aria-label="import" onClick={onOpen}>
        Import
      </IconButton>
    </>
  );
};
