import { ExportButton } from "..";
import { chakraDecorator } from "../../../utils/chakra-decorator";
import { apolloDecorator } from "../../../utils/apollo-decorator";

export default {
  title: "web-app/Export Button",
  decorators: [chakraDecorator, apolloDecorator],
};

export const WithButton = () => {
  return <ExportButton />;
};
