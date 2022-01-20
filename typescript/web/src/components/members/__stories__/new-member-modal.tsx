import { Button, useDisclosure } from "@chakra-ui/react";
import { SessionProvider } from "next-auth/react";
import {
  apolloDecorator,
  chakraDecorator,
  queryParamsDecorator,
  storybookTitle,
} from "../../../utils/stories";
import { NewMemberModal } from "../new-member-modal";

export default {
  title: storybookTitle(NewMemberModal),
  parameters: {
    nextRouter: {
      path: "/images/[id]",
      asPath: "/images/mock-image-id",
      query: {
        id: "mock-image-id",
      },
    },
  },
  decorators: [chakraDecorator, apolloDecorator, queryParamsDecorator],
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
