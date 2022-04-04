import { useCallback } from "react";
import { DeleteModal } from "../core";
import { useImagesList } from "./images-list.context";

export type DeleteManyImagesModalProps = {
  isOpen: boolean;
  onClose?: () => void;
};

export const DeleteManyImagesModal = ({
  isOpen,
  onClose = () => {},
}: DeleteManyImagesModalProps) => {
  const { selected, deleteSelected, deletingSelected } = useImagesList();
  const handleDelete = useCallback(async () => {
    await deleteSelected();
    onClose();
  }, [deleteSelected, onClose]);
  const plural = selected.length > 1 ? "s" : "";
  const header = `Delete ${selected.length} image${plural}`;
  return (
    <DeleteModal
      isOpen={isOpen}
      onClose={onClose}
      deleting={deletingSelected}
      onDelete={handleDelete}
      header={header}
      body="Are you sure? Every labels will also be deleted. This action cannot be undone"
    />
  );
};
