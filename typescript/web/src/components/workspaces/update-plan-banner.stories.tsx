import { createCommonDecorator, storybookTitle } from "../../utils/stories";
import { WORKSPACE_DATA } from "../../utils/fixtures";
import { UpdatePlanBanner } from "./update-plan-banner";

export default {
  title: storybookTitle("Workspaces", "UpdatePlanBanner"),
  decorators: [
    createCommonDecorator({
      auth: { withWorkspaces: true },
      apollo: true,
      router: { query: { workspaceSlug: WORKSPACE_DATA.slug } },
    }),
  ],
};

export const Open = () => <UpdatePlanBanner />;
