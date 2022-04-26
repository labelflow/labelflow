import { ComponentMeta, ComponentStory } from "@storybook/react";
import { DatasetClasses as DatasetClassesComponent } from ".";
import {
  BASIC_DATASET_DATA,
  BASIC_IMAGE_DATA,
  DEEP_DATASET_WITH_CLASSES_DATA,
  WORKSPACE_DATA,
} from "../../utils/fixtures";
import { createCommonDecorator, storybookTitle } from "../../utils/stories";
import { APOLLO_MOCKS } from "./dataset-classes.fixtures";

export default {
  title: storybookTitle("Dataset classes", DatasetClassesComponent),
  component: DatasetClassesComponent,
  decorators: [
    createCommonDecorator({
      auth: { withWorkspaces: true },
      apollo: { extraMocks: APOLLO_MOCKS },
      router: {
        query: {
          workspaceSlug: WORKSPACE_DATA.slug,
          datasetSlug: BASIC_DATASET_DATA.slug,
          imageId: BASIC_IMAGE_DATA.id,
        },
      },
    }),
  ],
} as ComponentMeta<typeof DatasetClassesComponent>;

const Template: ComponentStory<typeof DatasetClassesComponent> =
  DatasetClassesComponent;

export const DatasetClasses = Template.bind({});
DatasetClasses.args = {
  workspaceSlug: DEEP_DATASET_WITH_CLASSES_DATA.workspace.slug,
  datasetSlug: DEEP_DATASET_WITH_CLASSES_DATA.slug,
};
