import { ExportModal } from ".";
import { WORKSPACE_DATA, BASIC_DATASET_DATA } from "../../../dev/fixtures";
import {
  createTestWrapperDecorator,
  storybookTitle,
} from "../../../dev/stories";
import { APOLLO_MOCKS } from "./export-modal.fixtures";

export default {
  title: storybookTitle("Export Button", ExportModal),
  decorators: [
    createTestWrapperDecorator({
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
