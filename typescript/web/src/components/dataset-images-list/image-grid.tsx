import React, { useCallback, useMemo } from "react";
import { PaginatedImagesQuery_images } from "../../graphql-types";
import { VirtualGrid, VirtualGridItemProps } from "../core";
import { ImageCard, IMAGE_CARD_HEIGHT } from "./image-card";
import { useImagesList } from "./images-list.context";

export const MIN_IMAGE_CARD_WIDTH = 312;

const useUpsertSelectedItem = (id: string): ((value: boolean) => void) => {
  const { selected, setSelected } = useImagesList();
  return useCallback(
    (value: boolean) =>
      setSelected(
        value
          ? [...selected, id]
          : selected.filter((selectedId) => selectedId !== id)
      ),
    [id, selected, setSelected]
  );
};

const useSelectedItem = (id: string): [boolean, (value: boolean) => void] => {
  const { selected } = useImagesList();
  const itemSelected = useMemo(() => selected.includes(id), [selected, id]);
  const upsertSelectedItem = useUpsertSelectedItem(id);
  const handleChangeSelected = useCallback(
    (value: boolean) => {
      if (itemSelected === value) return;
      upsertSelectedItem(value);
    },
    [itemSelected, upsertSelectedItem]
  );
  return [itemSelected, handleChangeSelected];
};

const ImageItem = ({
  item: { id, name, thumbnail500Url },
}: VirtualGridItemProps<PaginatedImagesQuery_images>) => {
  const { workspaceSlug, datasetSlug, setSingleToDelete } = useImagesList();
  const [itemSelected, onChangeSelected] = useSelectedItem(id);
  return (
    <ImageCard
      key={id}
      id={id}
      name={name}
      thumbnail={thumbnail500Url}
      href={`/${workspaceSlug}/datasets/${datasetSlug}/images/${id}`}
      onDelete={setSingleToDelete}
      selected={itemSelected}
      onChangeSelected={onChangeSelected}
    />
  );
};

export const ImageGrid = () => {
  const { images } = useImagesList();
  return (
    <VirtualGrid
      items={images}
      itemHeight={IMAGE_CARD_HEIGHT}
      minItemWidth={MIN_IMAGE_CARD_WIDTH}
      renderItem={ImageItem}
      flexGrow={1}
    />
  );
};
