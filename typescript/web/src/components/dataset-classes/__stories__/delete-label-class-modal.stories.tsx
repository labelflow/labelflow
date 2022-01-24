import React from "react";
import { chakraDecorator } from "../../../utils/stories/chakra-decorator";
import { getApolloDecorator } from "../../../utils/stories/apollo-decorator";
import {
  APOLLO_MOCKS,
  TestComponent,
} from "../delete-label-class-modal.fixtures";

export default {
  title: "web/Dataset classes/Delete label class modal",
  decorators: [chakraDecorator, getApolloDecorator(APOLLO_MOCKS)],
};

export const Default = () => <TestComponent />;
