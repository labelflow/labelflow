import { Button, useDisclosure } from "@chakra-ui/react";
import { useApolloClient } from "@apollo/client";
import gql from "graphql-tag";
import { ImportImagesModal } from "./import-images-modal";

const createImageMutation = gql`
  mutation createImageMutation($file: Upload!) {
    createImage(data: { file: $file }) {
      id
    }
  }
`;

export const ImportButton = () => {
  const { isOpen, onClose, onOpen } = useDisclosure();

  const apolloClient = useApolloClient();

  const onImportSucceed = (files: File[]) => {
    Promise.all(
      files.map((file) =>
        apolloClient.mutate({
          mutation: createImageMutation,
          variables: { file },
        })
      )
    );
  };

  return (
    <>
      <ImportImagesModal
        isOpen={isOpen}
        onClose={onClose}
        onImportSucceed={onImportSucceed}
      />
      <Button aria-label="import" onClick={onOpen}>
        Import
      </Button>
    </>
  );
};
