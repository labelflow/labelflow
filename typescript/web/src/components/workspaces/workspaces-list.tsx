import { Box, Center } from "@chakra-ui/react";
import { TableContent } from "./workspace-table-content";
import { WorkspacesHeader } from "./workspaces-header";
import { WorkspaceTableActions } from "./workspaces-table-actions";

export const WorkspacesList = () => (
  <Center>
    <Box
      display="flex"
      flexDirection="column"
      w="full"
      p={8}
      maxWidth="5xl"
      flexGrow={1}
    >
      <WorkspacesHeader />
      <WorkspaceTableActions />
      <TableContent />
    </Box>
  </Center>
);
