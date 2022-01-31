import { Heading } from "@chakra-ui/react";
import { useWorkspace } from "./workspaces-context";

export const WorkspacesHeader = () => {
  const { workspaces } = useWorkspace();
  return <Heading mb="5">{`Workspaces (${workspaces?.length ?? ""})`}</Heading>;
};
