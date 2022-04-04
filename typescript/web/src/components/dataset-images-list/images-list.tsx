import {
  Box,
  Button,
  Center,
  Heading,
  HStack,
  SimpleGrid,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { isEmpty } from "lodash/fp";
import React, { useCallback, useMemo } from "react";
import { IconType } from "react-icons";
import {
  BiCheckbox,
  BiCheckboxChecked,
  BiCheckboxSquare,
} from "react-icons/bi";
import { HiOutlineTrash } from "react-icons/hi";
import { PaginatedImagesQuery_images } from "../../graphql-types";
import { PaginationFooter, PaginationProvider, LayoutSpinner } from "../core";
import { EmptyStateNoImages } from "../empty-state";
import { ImportButton } from "../import-button";
import { DeleteManyImagesModal } from "./delete-many-images-modal";
import { DeleteSingleImageModal } from "./delete-single-image-modal";
import { ImageCard } from "./image-card";
import {
  ImagesListProps,
  ImagesListProvider,
  useImagesList,
} from "./images-list.context";

const ImportImagesButton = () => {
  const { datasetId } = useImagesList();
  return (
    <ImportButton
      colorScheme="brand"
      variant="solid"
      mt="8"
      showModal={false}
      datasetId={datasetId}
    />
  );
};

const useSelectIcon = (): IconType => {
  const { images, selected } = useImagesList();
  if (isEmpty(selected)) return BiCheckbox;
  return selected.length === images.length
    ? BiCheckboxChecked
    : BiCheckboxSquare;
};

const SelectImageIcon = () => {
  const Icon = useSelectIcon();
  return <Icon size="22" />;
};

const SelectAllButton = () => {
  const { images, selected, toggleSelectAll } = useImagesList();
  return (
    <Button
      variant="ghost"
      size="sm"
      leftIcon={<SelectImageIcon />}
      onClick={toggleSelectAll}
      disabled={isEmpty(images)}
    >
      {isEmpty(selected) ? "Select all" : "Deselect all"}
    </Button>
  );
};

const DeleteSelectedButton = () => {
  const { images, selected, openDeleteSelectedModal } = useImagesList();
  return (
    <Button
      data-testid="delete-selected-images"
      variant="ghost"
      size="sm"
      leftIcon={<HiOutlineTrash />}
      disabled={isEmpty(images) || isEmpty(selected)}
      onClick={openDeleteSelectedModal}
    >
      Delete selected
    </Button>
  );
};

const Toolbar = () => (
  <HStack
    align="center"
    px={{ base: "2", md: "8" }}
    py={1}
    bg={useColorModeValue("white", "gray.800")}
    borderTop="1px"
    borderColor={useColorModeValue("gray.100", "gray.700")}
    boxShadow="sm"
  >
    <SelectAllButton />
    <DeleteSelectedButton />
  </HStack>
);

const NoImages = () => (
  <Center h="full">
    <Box as="section">
      <Box
        maxW="2xl"
        mx="auto"
        px={{ base: "6", lg: "8" }}
        py={{ base: "16", sm: "20" }}
        textAlign="center"
      >
        <EmptyStateNoImages w="full" />
        <Heading as="h2">You don&apos;t have any images.</Heading>
        <Text mt="4" fontSize="lg">
          Fortunately, it’s very easy to add some.
        </Text>
        <ImportImagesButton />
      </Box>
    </Box>
  </Center>
);

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
  id,
  name,
  thumbnail500Url,
}: PaginatedImagesQuery_images) => {
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

const ImageGrid = () => {
  const { images } = useImagesList();
  return (
    <SimpleGrid
      minChildWidth="312px"
      spacing={{ base: "2", md: "8" }}
      padding={{ base: "2", md: "8" }}
      paddingBottom={{ base: "24", md: "16" }}
    >
      {images?.map(({ id, ...image }) => (
        <ImageItem key={id} id={id} {...image} />
      ))}
    </SimpleGrid>
  );
};

const DeleteModals = () => {
  const {
    singleToDelete,
    setSingleToDelete,
    displayDeleteSelectedModal,
    closeDeleteSelectedModal,
  } = useImagesList();
  return (
    <>
      <DeleteSingleImageModal
        isOpen={!isEmpty(singleToDelete)}
        onClose={() => setSingleToDelete(undefined)}
      />
      <DeleteManyImagesModal
        isOpen={displayDeleteSelectedModal}
        onClose={closeDeleteSelectedModal}
      />
    </>
  );
};

const Gallery = () => (
  <>
    <Toolbar />
    <ImageGrid />
    <DeleteModals />
  </>
);

const Content = () => {
  const { images } = useImagesList();
  return <>{isEmpty(images) ? <NoImages /> : <Gallery />}</>;
};

const Body = () => {
  const { loading } = useImagesList();
  return <>{loading ? <LayoutSpinner /> : <Content />}</>;
};

const Footer = () => {
  const { selected } = useImagesList();
  const leftLabel = isEmpty(selected) ? "" : `${selected.length} selected`;
  return <PaginationFooter leftLabel={leftLabel} />;
};

export const ImagesList = (props: ImagesListProps) => {
  const { imagesTotalCount } = props;
  return (
    <PaginationProvider
      itemCount={imagesTotalCount ?? 0}
      perPageOptions={[50, 250, 1000]}
    >
      <ImagesListProvider {...props}>
        <Body />
        <Footer />
      </ImagesListProvider>
    </PaginationProvider>
  );
};
