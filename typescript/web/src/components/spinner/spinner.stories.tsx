import { Spinner } from ".";
import { storybookTitle } from "../../dev/stories";

export default {
  title: storybookTitle("Spinner", Spinner),
};

export const Default = () => <Spinner />;

Default.parameters = {
  chromatic: { disableSnapshot: true },
};
