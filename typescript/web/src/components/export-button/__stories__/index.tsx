import { ExportButton } from "..";
import {
  apolloDecorator,
  chakraDecorator,
  queryParamsDecorator,
  storybookTitle,
} from "../../../utils/stories";

export default {
  title: storybookTitle(ExportButton),
  decorators: [chakraDecorator, apolloDecorator, queryParamsDecorator],
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
