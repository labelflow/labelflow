import { Spinner as SpinnerComponent } from ".";
import { chakraDecorator, storybookTitle } from "../../../utils/stories";

export default {
  title: storybookTitle("Core", "Spinner", SpinnerComponent),
  component: SpinnerComponent,
  decorators: [chakraDecorator],
};

export const Spinner = () => <SpinnerComponent />;

Spinner.parameters = {
  chromatic: { disableSnapshot: true },
};
