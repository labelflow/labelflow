import React from "react";
import { chakraDecorator } from "../../../utils/stories/chakra-decorator";
import { getApolloMockDecorator } from "../../../utils/stories/apollo-mock-decorator";
import {
  APOLLO_MOCKS,
  TestComponent,
} from "../delete-label-class-modal.fixtures";

export default {
  title: "web/Dataset classes/Delete label class modal",
  decorators: [chakraDecorator, getApolloMockDecorator(APOLLO_MOCKS)],
};

export const Default = () => <TestComponent />;
