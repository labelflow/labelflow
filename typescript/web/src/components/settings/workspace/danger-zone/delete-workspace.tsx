import { Button, Flex, Text } from "@chakra-ui/react";
import { Card } from "../../card";
import {
  DeleteWorkspaceProvider,
  useDeleteWorkspace,
} from "./delete-workspace.state";
import { DeleteWorkspaceModal } from "./delete-workspace-modal";

const Description = () => (
  <>
    <Text fontWeight="bold">Delete workspace and all data</Text>
    <Text fontSize="sm" mt="1" mb="3">
      Once you delete your workspace, there is no going back. Please be certain.
    </Text>
  </>
);

const DeleteButton = () => {
  const { open } = useDeleteWorkspace();
  return (
    <Flex direction="row" justifyContent="flex-end">
      <Button size="sm" colorScheme="red" onClick={open}>
        Delete workspace
      </Button>
    </Flex>
  );
};

export const DeleteWorkspace = () => (
  <DeleteWorkspaceProvider>
    <Card>
      <Description />
      <DeleteButton />
    </Card>
    <DeleteWorkspaceModal />
  </DeleteWorkspaceProvider>
);
