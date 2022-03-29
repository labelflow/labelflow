import React from "react";
import { AddClassesModal as AddClassesModalComponent } from ".";
import {
  chakraDecorator,
  getApolloMockDecorator,
  modalDecorator,
  storybookTitle,
} from "../../../utils/stories";

export default {
  title: storybookTitle(AddClassesModalComponent),
  decorators: [chakraDecorator, modalDecorator, getApolloMockDecorator()],
};

export const AddClassesModal = () => (
  <AddClassesModalComponent isOpen onClose={() => {}} />
);
