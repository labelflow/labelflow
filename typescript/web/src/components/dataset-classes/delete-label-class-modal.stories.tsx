import React from "react";
import { storybookTitle } from "../../dev/stories";
import { getApolloMockDecorator } from "../../dev/stories/apollo-mock-decorator";
import { DeleteLabelClassModal } from "./delete-label-class-modal";
import {
  APOLLO_MOCKS,
  TestComponent,
} from "./delete-label-class-modal.fixtures";

export default {
  title: storybookTitle("Dataset classes", DeleteLabelClassModal),
  decorators: [getApolloMockDecorator(APOLLO_MOCKS)],
};

export const Default = () => <TestComponent />;
