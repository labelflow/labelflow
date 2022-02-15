import { DatasetClasses } from ".";
import { DEEP_DATASET_WITH_CLASSES_DATA } from "../../dev/fixtures";
import { storybookTitle, getApolloMockDecorator } from "../../dev/stories";

import { APOLLO_MOCKS } from "./dataset-classes.fixtures";

export default {
  title: storybookTitle("Dataset classes", DatasetClasses),
  decorators: [getApolloMockDecorator(APOLLO_MOCKS)],
};

export const Default = () => (
  <DatasetClasses
    workspaceSlug={DEEP_DATASET_WITH_CLASSES_DATA.workspace.slug}
    datasetSlug={DEEP_DATASET_WITH_CLASSES_DATA.slug}
  />
);
