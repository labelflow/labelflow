import { Heading } from "@chakra-ui/react";
import { useWorkspaces } from "../../hooks";

export const WorkspacesHeader = () => {
  const { length } = useWorkspaces();
  return <Heading mb="5">{`Workspaces (${length})`}</Heading>;
};
