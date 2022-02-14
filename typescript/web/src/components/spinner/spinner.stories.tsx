import { Spinner } from ".";
import { storybookTitle } from "../../utils/stories";
import { chakraDecorator } from "../../utils/stories/chakra-decorator";

export default {
  title: storybookTitle("Spinner", Spinner),
  decorators: [chakraDecorator],
};

export const Default = () => <Spinner />;

Default.parameters = {
  chromatic: { disableSnapshot: true },
};
