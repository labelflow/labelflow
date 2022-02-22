import {
  chakraDecorator,
  queryParamsDecorator,
  storybookTitle,
} from "../../utils/stories";
import { UpdatePlanBanner } from "./update-plan-banner";

export default {
  title: storybookTitle("Workspaces", "UpdatePlanBanner"),
  decorators: [chakraDecorator, queryParamsDecorator],
};

export const Open = () => <UpdatePlanBanner />;
