import { createCommonDecorator, storybookTitle } from "../../utils/stories";
import { WORKSPACE_DATA } from "../../utils/fixtures";
import { UpgradePlanBanner as UpgradePlanBannerComponent } from "./upgrade-plan-banner";

export default {
  title: storybookTitle("Workspaces", UpgradePlanBannerComponent),
  component: UpgradePlanBannerComponent,
  decorators: [
    createCommonDecorator({
      auth: { withWorkspaces: true },
      apollo: true,
      router: { query: { workspaceSlug: WORKSPACE_DATA.slug } },
    }),
  ],
};
export const UpgradePlanBanner = () => <UpgradePlanBannerComponent />;
