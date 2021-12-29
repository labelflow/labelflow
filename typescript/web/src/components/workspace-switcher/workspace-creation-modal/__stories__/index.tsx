import { WorkspaceCreationModal } from "..";
import { chakraDecorator } from "../../../../utils/chakra-decorator";
import { apolloDecorator } from "../../../../utils/apollo-decorator";
import { queryParamsDecorator } from "../../../../utils/query-params-decorator";

export default {
  title: "web/Workspace Switcher/Workspace creation modal",
  decorators: [chakraDecorator, apolloDecorator, queryParamsDecorator],
};

export const Open = () => (
  <WorkspaceCreationModal isOpen onClose={console.log} />
);

export const WithPreFilledText = () => (
  <WorkspaceCreationModal isOpen onClose={console.log} />
);

WithPreFilledText.parameters = {
  nextRouter: {
    asPath: "/?workspace-name=Hello",
  },
};

export const WithPreFilledTextAlreadyTaken = () => (
  <WorkspaceCreationModal isOpen onClose={console.log} />
);

WithPreFilledTextAlreadyTaken.parameters = {
  nextRouter: {
    asPath: "/?workspace-name=local",
  },
};

export const WithPreFilledTextReservedWord = () => (
  <WorkspaceCreationModal isOpen onClose={console.log} />
);

WithPreFilledTextReservedWord.parameters = {
  nextRouter: {
    asPath: "/?workspace-name=Pricing",
  },
};

export const WithPreFilledTextInvalidCharacters = () => (
  <WorkspaceCreationModal isOpen onClose={console.log} />
);

WithPreFilledTextInvalidCharacters.parameters = {
  nextRouter: {
    asPath: "/?workspace-name=hello!",
  },
};
