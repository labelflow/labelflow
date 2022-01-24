import React from "react";
import { DatasetClasses } from "..";
import { chakraDecorator } from "../../../utils/stories/chakra-decorator";
import { getApolloDecorator } from "../../../utils/stories/apollo-decorator";
import { APOLLO_MOCKS } from "../dataset-classes.fixtures";
import { MOCK_DATASET_WITH_CLASSES } from "../../../utils/tests/data.fixtures";

export default {
  title: "web/Dataset classes/Classes",
  decorators: [chakraDecorator, getApolloDecorator(APOLLO_MOCKS)],
};

export const Default = () => (
  <DatasetClasses
    workspaceSlug={MOCK_DATASET_WITH_CLASSES.workspace.slug}
    datasetSlug={MOCK_DATASET_WITH_CLASSES.slug}
  />
);
