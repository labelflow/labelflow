import { DeleteLabelButton } from "./delete-label-button";
import { EditLabelClassMenu } from "./edit-label-class-menu";
import { EditSelectionMode } from "./edit-selection-mode";

export const OptionsToolBar = () => (
  <>
    <EditLabelClassMenu />
    <EditSelectionMode />
    <DeleteLabelButton />
  </>
);
