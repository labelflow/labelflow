import React from "react";
import { AddClassesModal as AddClassesModalComponent } from ".";
import { storybookTitle } from "../../../utils/stories";
import { getApolloMockDecorator } from "../../../utils/stories/apollo-mock-decorator";
import { chakraDecorator } from "../../../utils/stories/chakra-decorator";

export default {
  title: storybookTitle(AddClassesModalComponent),
  decorators: [chakraDecorator, getApolloMockDecorator()],
};

export const AddClassesModal = () => (
  <AddClassesModalComponent isOpen onClose={() => {}} />
);
