import { Spinner } from "..";
import { chakraDecorator } from "../../../utils/stories/chakra-decorator";

export default {
  title: `web/Spinner/${Spinner.name}`,
  decorators: [chakraDecorator],
};

export const Default = () => <Spinner />;

Default.parameters = {
  chromatic: { disableSnapshot: true },
};
