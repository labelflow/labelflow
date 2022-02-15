import { Button, useDisclosure } from "@chakra-ui/react";
import { SessionProvider } from "next-auth/react";
import { BASIC_DATASET_DATA, WORKSPACE_DATA } from "../../dev/fixtures";
import { createTestWrapperDecorator, storybookTitle } from "../../dev/stories";
import { NewMemberModal } from "./new-member-modal";

export default {
  title: storybookTitle(NewMemberModal),
  decorators: [
    createTestWrapperDecorator({
      auth: { withWorkspaces: true },
      apollo: true,
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
    <SessionProvider session={undefined}>
      <div>
        <Button onClick={onOpen}>Display</Button>
        <NewMemberModal isOpen={isOpen} onClose={onClose} />
      </div>
    </SessionProvider>
  );
};

export const OpenedByDefault = () => {
  const { isOpen, onOpen, onClose } = useDisclosure({ defaultIsOpen: true });

  return (
    <SessionProvider session={undefined}>
      <div>
        <Button onClick={onOpen}>Display</Button>
        <NewMemberModal isOpen={isOpen} onClose={onClose} />
      </div>
    </SessionProvider>
  );
};
