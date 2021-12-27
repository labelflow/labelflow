import { CreateWorkspaceModal } from "..";
import { chakraDecorator } from "../../../../utils/chakra-decorator";
import { apolloDecorator } from "../../../../utils/apollo-decorator";
import { queryParamsDecorator } from "../../../../utils/query-params-decorator";

export default {
  title: "web/Workspace Switcher/Workspace creation modal",
  decorators: [chakraDecorator, apolloDecorator, queryParamsDecorator],
};

export const Open = () => <CreateWorkspaceModal isOpen onClose={console.log} />;

export const WithPreFilledText = () => (
  <CreateWorkspaceModal isOpen onClose={console.log} />
);

WithPreFilledText.parameters = {
  nextRouter: {
    asPath: "/?workspace-name=Hello",
  },
};

export const WithPreFilledTextAlreadyTaken = () => (
  <CreateWorkspaceModal isOpen onClose={console.log} />
);

WithPreFilledTextAlreadyTaken.parameters = {
  nextRouter: {
    asPath: "/?workspace-name=local",
  },
};

export const WithPreFilledTextReservedWord = () => (
  <CreateWorkspaceModal isOpen onClose={console.log} />
);

WithPreFilledTextReservedWord.parameters = {
  nextRouter: {
    asPath: "/?workspace-name=Pricing",
  },
};

export const WithPreFilledTextInvalidCharacters = () => (
  <CreateWorkspaceModal isOpen onClose={console.log} />
);

WithPreFilledTextInvalidCharacters.parameters = {
  nextRouter: {
    asPath: "/?workspace-name=hello!",
  },
};
