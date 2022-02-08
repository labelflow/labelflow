import React from "react";
import { storybookTitle } from "../../utils/stories";
import { getApolloMockDecorator } from "../../utils/stories/apollo-mock-decorator";
import { chakraDecorator } from "../../utils/stories/chakra-decorator";
import { DeleteLabelClassModal } from "./delete-label-class-modal";
import {
  APOLLO_MOCKS,
  TestComponent,
} from "./delete-label-class-modal.fixtures";

export default {
  title: storybookTitle("Dataset classes", DeleteLabelClassModal),
  decorators: [chakraDecorator, getApolloMockDecorator(APOLLO_MOCKS)],
};

export const Default = () => <TestComponent />;
