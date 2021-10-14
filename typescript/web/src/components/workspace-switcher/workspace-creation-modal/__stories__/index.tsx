import { WorkspaceCreationModal } from "..";
import { chakraDecorator } from "../../../../utils/chakra-decorator";
import { apolloDecorator } from "../../../../utils/apollo-decorator";

export default {
  title: "web/Workspace Switcher/Workspace creation modal",
  decorators: [chakraDecorator, apolloDecorator],
};

export const Open = () => (
  <WorkspaceCreationModal isOpen onClose={console.log} />
);

export const WithPreFilledText = () => (
  <WorkspaceCreationModal
    isOpen
    onClose={console.log}
    initialWorkspaceName="Hello"
  />
);

export const WithPreFilledTextAlreadyTaken = () => (
  <WorkspaceCreationModal
    isOpen
    onClose={console.log}
    initialWorkspaceName="local"
  />
);
