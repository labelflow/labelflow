import { AiAssistantToolbar } from "./ai-assistant-toolbar";
import { DeleteLabelButton } from "./delete-label-button";
import { EditLabelClassMenu } from "./edit-label-class-menu";
import { EditSelectionMode } from "./edit-selection-mode";

export const OptionsToolBar = () => (
  <>
    <AiAssistantToolbar />
    <EditLabelClassMenu />
    <EditSelectionMode />
    <DeleteLabelButton />
  </>
);
