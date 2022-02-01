import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Box,
} from "@chakra-ui/react";
import { InvitationResult } from "@labelflow/graphql-types";
import { useState } from "react";
import { useWorkspace } from "../../hooks";
import { TableActions } from "../table-actions";
import { NewMemberModal } from "./new-member-modal";
import { InviteMember } from "./types";

const tableActionsForLocalWorkspace = (
  <Alert status="info" variant="subtle">
    <AlertIcon />
    <Box flex={1}>
      <AlertTitle>This workspace is private.</AlertTitle>
      <AlertDescription>
        Images are stored locally on your device. To collaborate and invite
        people, switch to an online workspace.
      </AlertDescription>
    </Box>
  </Alert>
);

export const MembersTableActions = ({
  searchText,
  setSearchText,
  inviteMember = async () => InvitationResult.Sent,
}: {
  searchText: string;
  setSearchText: (text: string) => void;
  inviteMember?: InviteMember;
}) => {
  const [isNewMemberModalOpen, setIsNewMemberModalOpen] = useState(false);
  const { slug: workspaceSlug } = useWorkspace();

  const tableActionsForOnlineWorkspace = (
    <>
      <NewMemberModal
        isOpen={isNewMemberModalOpen}
        onClose={() => setIsNewMemberModalOpen(false)}
        inviteMember={inviteMember}
      />
      <TableActions
        searchText={searchText}
        setSearchText={setSearchText}
        onNewItem={() => setIsNewMemberModalOpen(true)}
        searchBarLabel="Find a member"
        newButtonLabel="New member"
      />
    </>
  );

  return workspaceSlug === "local"
    ? tableActionsForLocalWorkspace
    : tableActionsForOnlineWorkspace;
};
