import { Button, useDisclosure } from "@chakra-ui/react";
import {
  apolloMockDecorator,
  chakraDecorator,
  queryParamsDecorator,
  storybookTitle,
} from "../../../utils/stories";
import { UpsertDatasetModal } from "../upsert-dataset-modal";

export default {
  title: storybookTitle(UpsertDatasetModal),
  decorators: [chakraDecorator, apolloMockDecorator, queryParamsDecorator],
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
