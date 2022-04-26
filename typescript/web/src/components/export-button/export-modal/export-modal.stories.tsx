import { ExportModal } from ".";
import { WORKSPACE_DATA, BASIC_DATASET_DATA } from "../../../utils/fixtures";
import { createCommonDecorator, storybookTitle } from "../../../utils/stories";
import { APOLLO_MOCKS } from "./export-modal.fixtures";

export default {
  title: storybookTitle("Export Button", ExportModal),
  decorators: [
    createCommonDecorator({
      auth: { withWorkspaces: true },
      apollo: { extraMocks: APOLLO_MOCKS },
      router: {
        query: {
          workspaceSlug: WORKSPACE_DATA.slug,
          datasetSlug: BASIC_DATASET_DATA.slug,
        },
      },
    }),
  ],
};

export const Opened = () => {
  return <ExportModal isOpen onClose={() => {}} />;
};
