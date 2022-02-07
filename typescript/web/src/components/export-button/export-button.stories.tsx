import { ExportButton } from ".";
import {
  apolloMockDecorator,
  chakraDecorator,
  queryParamsDecorator,
  storybookTitle,
} from "../../utils/stories";

export default {
  title: storybookTitle(ExportButton),
  decorators: [chakraDecorator, apolloMockDecorator, queryParamsDecorator],
};

export const WithButton = () => {
  return <ExportButton />;
};

WithButton.parameters = {
  nextRouter: {
    path: "/",
    asPath: "/?modal-export",
  },
};
