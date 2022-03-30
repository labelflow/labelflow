import { Button, useDisclosure } from "@chakra-ui/react";
import { BASIC_DATASET_DATA, WORKSPACE_DATA } from "../../../utils/fixtures";
import { createCommonDecorator, storybookTitle } from "../../../utils/stories";
import { ImportButton } from "../import-button";
import { IMPORT_BUTTON_MOCKS } from "../import-button.fixtures";
import { ImportImagesModal } from "./import-images-modal";

export default {
  title: storybookTitle(ImportButton, ImportImagesModal),
  parameters: {
    nextRouter: {
      path: "/images/[id]",
      asPath: "/images/mock-image-id",
      query: {
        id: "mock-image-id",
      },
    },
  },
  decorators: [
    createCommonDecorator({
      auth: { withWorkspaces: true },
      apollo: { extraMocks: IMPORT_BUTTON_MOCKS },
      router: {
        query: {
          workspaceSlug: WORKSPACE_DATA.slug,
          datasetSlug: BASIC_DATASET_DATA.slug,
        },
      },
    }),
  ],
};

export const Default = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <div>
      <Button onClick={onOpen}>Display</Button>
      <ImportImagesModal isOpen={isOpen} onClose={onClose} />
    </div>
  );
};

export const OpenedByDefault = () => {
  const { isOpen, onOpen, onClose } = useDisclosure({ defaultIsOpen: true });

  return (
    <div>
      <Button onClick={onOpen}>Display</Button>
      <ImportImagesModal isOpen={isOpen} onClose={onClose} />
    </div>
  );
};
