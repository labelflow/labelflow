import { WORKSPACE_DATA } from "../../../../../utils/fixtures";
import { chakraDecorator, storybookTitle } from "../../../../../utils/stories";
import { WorkspaceListItem } from "./workspace-list-item";

export default {
  title: storybookTitle("Workspaces", "Workspace Switcher", WorkspaceListItem),
  decorators: [chakraDecorator],
};

export const Default = () => (
  <WorkspaceListItem
    highlight={false}
    index={0}
    item={{ ...WORKSPACE_DATA, slug: "default-workspace" }}
    itemProps={{}}
  />
);

export const Highlighted = () => (
  <WorkspaceListItem
    highlight
    index={0}
    item={{ ...WORKSPACE_DATA, slug: "default-workspace" }}
    itemProps={{}}
  />
);

export const Selected = () => (
  <WorkspaceListItem index={0} item={WORKSPACE_DATA} itemProps={{}} />
);

export const NoImage = () => (
  <WorkspaceListItem
    highlight={false}
    index={0}
    item={{ ...WORKSPACE_DATA, image: null }}
    itemProps={{}}
  />
);

export const NewWorkspace = () => (
  <WorkspaceListItem
    index={0}
    item={{
      type: "CreateWorkspaceItem",
      name: "nonExistingWorkspace",
    }}
    itemProps={{}}
    isCreateWorkspaceItem
  />
);

export const NewWorkspaceHighlighted = () => (
  <WorkspaceListItem
    highlight
    index={0}
    item={{
      type: "CreateWorkspaceItem",
      name: "nonExistingWorkspace",
    }}
    itemProps={{}}
    isCreateWorkspaceItem
  />
);

export const NewWorkspaceNoName = () => (
  <WorkspaceListItem
    index={0}
    item={{
      type: "CreateWorkspaceItem",
      name: "",
    }}
    itemProps={{}}
    isCreateWorkspaceItem
  />
);
