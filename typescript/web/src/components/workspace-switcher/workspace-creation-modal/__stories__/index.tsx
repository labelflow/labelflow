import { WorkspaceCreationModal } from "..";
import { chakraDecorator } from "../../../../utils/chakra-decorator";
import { apolloDecorator } from "../../../../utils/apollo-decorator";

export default {
  title: "web/Workspace Switcher/Workspace creation modal",
  decorators: [chakraDecorator, apolloDecorator],
};

export const Basic = () => (
  <WorkspaceCreationModal isOpen onClose={console.log} />
);
