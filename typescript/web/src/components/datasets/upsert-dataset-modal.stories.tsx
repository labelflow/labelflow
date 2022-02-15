import { Button, useDisclosure } from "@chakra-ui/react";
import { WORKSPACE_DATA, BASIC_DATASET_DATA } from "../../utils/fixtures";
import { createCommonDecorator, storybookTitle } from "../../utils/stories";
import { UpsertDatasetModal } from "./upsert-dataset-modal";
import { APOLLO_MOCKS } from "./upsert-dataset-modal.fixtures";

export default {
  title: storybookTitle(UpsertDatasetModal),
  decorators: [
    createCommonDecorator({
      auth: { withWorkspaces: true },
      apollo: { extraMocks: APOLLO_MOCKS },
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
      <UpsertDatasetModal isOpen={isOpen} onClose={onClose} />
    </div>
  );
};

export const OpenedByDefault = () => {
  const { isOpen, onOpen, onClose } = useDisclosure({ defaultIsOpen: true });
  return (
    <div>
      <Button onClick={onOpen}>Display</Button>
      <UpsertDatasetModal isOpen={isOpen} onClose={onClose} />
    </div>
  );
};
