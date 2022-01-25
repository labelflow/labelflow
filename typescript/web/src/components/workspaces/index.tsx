import { Link, ListItem, UnorderedList } from "@chakra-ui/react";
import { Workspace } from "@labelflow/graphql-types";

type GqlWorkspace = Pick<Workspace, "id" | "name" | "slug">;

const WorkspaceItem = ({ workspace }: { workspace: GqlWorkspace }) => (
  <ListItem>
    <Link href={`/${workspace.slug}`}>{workspace.name}</Link>
  </ListItem>
);

export const Workspaces = ({ workspaces }: { workspaces: GqlWorkspace[] }) => (
  <UnorderedList>
    {workspaces.map((workspace) => (
      <WorkspaceItem key={workspace.id} workspace={workspace} />
    ))}
  </UnorderedList>
);
