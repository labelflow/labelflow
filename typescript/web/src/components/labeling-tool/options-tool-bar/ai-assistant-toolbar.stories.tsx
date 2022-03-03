import { ComponentMeta, ComponentStory } from "@storybook/react";
import { BASIC_DATASET_DATA, WORKSPACE_DATA } from "../../../utils/fixtures";
import { createCommonDecorator, storybookTitle } from "../../../utils/stories";
import {
  AiAssistantComboBox as AiAssistantComboBoxComponent,
  AiAssistantAnnotateButtonGroup as AiAssistantAnnotateButtonGroupComponent,
  AiAssistantProvider,
  AiAssistantToolbar as AiAssistantToolbarTopComponent,
  AiAssistantToolbarComponent,
} from "./ai-assistant-toolbar";

export default {
  title: storybookTitle("Labeling tool", AiAssistantToolbarTopComponent),
  component: AiAssistantToolbarTopComponent,
  decorators: [
    createCommonDecorator({
      auth: { withWorkspaces: true },
      apollo: true,
      router: {
        query: {
          workspaceSlug: WORKSPACE_DATA.slug,
          datasetSlug: BASIC_DATASET_DATA.slug,
          imageId: "558bc709-9ba4-4cde-9c0d-3e1715e42998",
        },
      },
    }),
  ],
} as ComponentMeta<typeof AiAssistantToolbarTopComponent>;

const AiAssistantToolbarTemplate: ComponentStory<
  typeof AiAssistantToolbarComponent
> = () => (
  <AiAssistantProvider>
    <AiAssistantToolbarComponent />
  </AiAssistantProvider>
);

export const AiAssistantToolbar = AiAssistantToolbarTemplate.bind({});
AiAssistantToolbar.args = {};

const AiAssistantComboBoxTemplate: ComponentStory<
  typeof AiAssistantComboBoxComponent
> = (args) => <AiAssistantComboBoxComponent {...args} />;

export const AiAssistantComboBoxOpened = AiAssistantComboBoxTemplate.bind({});
AiAssistantComboBoxOpened.args = { isOpen: true };

const OptionsMenuTemplate: ComponentStory<
  typeof AiAssistantAnnotateButtonGroupComponent
> = (args) => (
  <AiAssistantProvider>
    <AiAssistantAnnotateButtonGroupComponent {...args} />
  </AiAssistantProvider>
);

export const OptionsMenuOpened = OptionsMenuTemplate.bind({});
OptionsMenuOpened.args = { isOpen: true };
