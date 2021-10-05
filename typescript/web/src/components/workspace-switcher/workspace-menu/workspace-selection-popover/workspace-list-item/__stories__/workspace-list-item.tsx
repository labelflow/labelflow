import { WorkspaceListItem } from "../workspace-list-item";
import { chakraDecorator } from "../../../../../../utils/chakra-decorator";

export default {
  title: "web/Workspace list item",
  decorators: [chakraDecorator],
};

export const Default = () => {
  return (
    <WorkspaceListItem
      highlight={false}
      index={0}
      item={{
        src: "https://labelflow.ai/static/icon-512x512.png",
        name: "My Workspace",
      }}
      itemProps={{}}
    />
  );
};

export const Highlighted = () => {
  return (
    <WorkspaceListItem
      highlight
      index={0}
      item={{
        src: "https://labelflow.ai/static/icon-512x512.png",
        name: "My Workspace",
      }}
      itemProps={{}}
    />
  );
};

export const Selected = () => {
  return (
    <WorkspaceListItem
      selected
      index={0}
      item={{
        src: "https://labelflow.ai/static/icon-512x512.png",
        name: "My Workspace",
      }}
      itemProps={{}}
    />
  );
};

export const NoImage = () => {
  return (
    <WorkspaceListItem
      highlight={false}
      index={0}
      item={{ name: "My Workspace" }}
      itemProps={{}}
    />
  );
};

export const NoName = () => {
  return (
    <WorkspaceListItem
      highlight={false}
      index={0}
      // @ts-ignore
      item={{
        src: "https://labelflow.ai/static/icon-512x512.png",
      }}
      itemProps={{}}
    />
  );
};

export const NoImageNoName = () => {
  return (
    <WorkspaceListItem
      highlight={false}
      index={0}
      // @ts-ignore
      item={{}}
      itemProps={{}}
    />
  );
};

export const NewWorkspace = () => {
  return (
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
};

export const NewWorkspaceHighlighted = () => {
  return (
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
};

export const NewWorkspaceNoName = () => {
  return (
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
};
