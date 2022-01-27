import React from "react";
import { DatasetClasses } from "..";
import { chakraDecorator } from "../../../utils/stories/chakra-decorator";
import { getApolloMockDecorator } from "../../../utils/stories/apollo-mock-decorator";
import { APOLLO_MOCKS } from "../dataset-classes.fixtures";
import { DEEP_DATASET_MOCK_WITH_CLASSES } from "../../../utils/tests/data.fixtures";

export default {
  title: "web/Dataset classes/Classes",
  decorators: [chakraDecorator, getApolloMockDecorator(APOLLO_MOCKS)],
};

export const Default = () => (
  <DatasetClasses
    workspaceSlug={DEEP_DATASET_MOCK_WITH_CLASSES.workspace.slug}
    datasetSlug={DEEP_DATASET_MOCK_WITH_CLASSES.slug}
  />
);
