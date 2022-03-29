import {
  Avatar,
  chakra,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  Link,
  useColorModeValue,
  HStack,
} from "@chakra-ui/react";
import { RiGroupFill } from "react-icons/ri";
import { WorkspacePlan } from "@labelflow/graphql-types";
import { isEmpty } from "lodash/fp";
import { useWorkspace } from "./workspaces-context";
import { randomBackgroundGradient } from "../../utils/random-background-gradient";
import { WorkspacePlanBadge } from "./workspace-plan-badge";
import { UserWithWorkspacesQuery_user_memberships_workspace } from "../../graphql-types/UserWithWorkspacesQuery";

const TableHead = () => (
  <Thead bg={useColorModeValue("gray.50", "gray.800")}>
    <Tr>
      <Th>Workspace</Th>
      <Th>Plan</Th>
    </Tr>
  </Thead>
);

const TeamIcon = chakra(RiGroupFill);

type WorkspaceRowProps = {
  workspace: UserWithWorkspacesQuery_user_memberships_workspace;
};

const WorkspaceAvatar = ({ workspace }: WorkspaceRowProps) => {
  const avatarBackground = useColorModeValue("white", "gray.700");
  const avatarBorderColor = useColorModeValue("gray.200", "gray.700");
  return (
    <Avatar
      borderWidth="1px"
      borderColor={avatarBorderColor}
      size="md"
      color="white"
      borderRadius="md"
      name={workspace.name}
      src={workspace.image ?? ""}
      mr="2"
      bg={
        !isEmpty(workspace.image)
          ? avatarBackground
          : randomBackgroundGradient(workspace.name)
      }
      icon={<TeamIcon color="white" fontSize="1rem" />}
    />
  );
};

const WorkspacePlanCell = ({ plan }: { plan: WorkspacePlan }) => (
  <Td>
    <WorkspacePlanBadge plan={plan} />
  </Td>
);

const WorkspaceNameCell = ({ workspace }: WorkspaceRowProps) => {
  return (
    <Td>
      <Link href={`/${workspace.slug}`}>
        <HStack>
          <WorkspaceAvatar workspace={workspace} />
          <Text>{workspace.name}</Text>
        </HStack>
      </Link>
    </Td>
  );
};

const TableBody = () => {
  const { filteredWorkspaces } = useWorkspace();
  return (
    <Tbody bg={useColorModeValue("white", "gray.900")}>
      {filteredWorkspaces.map((workspace) => (
        <Tr key={workspace.id}>
          <WorkspaceNameCell workspace={workspace} />
          <WorkspacePlanCell plan={workspace.plan} />
        </Tr>
      ))}
    </Tbody>
  );
};

export const TableContent = () => (
  <Table maxWidth="5xl" my="8" borderWidth="1px">
    <TableHead />
    <TableBody />
  </Table>
);
