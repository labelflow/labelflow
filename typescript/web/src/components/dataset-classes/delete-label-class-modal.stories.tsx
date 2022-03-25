import React from "react";
import {
  chakraDecorator,
  getApolloMockDecorator,
  modalDecorator,
  storybookTitle,
} from "../../utils/stories";
import { DeleteLabelClassModal } from "./delete-label-class-modal";
import {
  APOLLO_MOCKS,
  TestComponent,
} from "./delete-label-class-modal.fixtures";

export default {
  title: storybookTitle("Dataset classes", DeleteLabelClassModal),
  decorators: [
    chakraDecorator,
    modalDecorator,
    getApolloMockDecorator(APOLLO_MOCKS),
  ],
};

export const Default = () => <TestComponent />;
