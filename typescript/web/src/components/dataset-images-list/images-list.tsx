import {
  Box,
  Button,
  Center,
  Flex,
  Heading,
  HStack,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { isEmpty } from "lodash/fp";
import React from "react";
import { IconType } from "react-icons";
import {
  BiCheckbox,
  BiCheckboxChecked,
  BiCheckboxSquare,
} from "react-icons/bi";
import { HiOutlineTrash } from "react-icons/hi";
import { LayoutSpinner, PaginationProvider, PaginationToolbar } from "../core";
import { EmptyStateNoImages } from "../empty-state";
import { ImportButton } from "../import-button";
import { DeleteManyImagesModal } from "./delete-many-images-modal";
import { DeleteSingleImageModal } from "./delete-single-image-modal";
import { ImageGrid } from "./image-grid";
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
    boxShadow="md"
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
        <Heading as="h2">You don&apos;t have any images</Heading>
        <Text mt="4" fontSize="lg">
          Fortunately, it&apos;s very easy to add some!
        </Text>
        <ImportImagesButton />
      </Box>
    </Box>
  </Center>
);

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

const Footer = () => {
  const { selected } = useImagesList();
  const leftLabel = isEmpty(selected) ? "" : `${selected.length} selected`;
  // Chakra UI shadow md but reversed
  const shadow = [
    "0 -4px 6px -1px rgba(0, 0, 0, 0.1)",
    "0 -2px 4px -1px rgba(0, 0, 0, 0.06)",
  ].join(",");
  return (
    <Box boxShadow={shadow}>
      <PaginationToolbar leftLabel={leftLabel} />
    </Box>
  );
};

const GalleryBody = () => (
  <Flex grow={1} direction="column" minH="0">
    <Toolbar />
    <ImageGrid />
    <Footer />
  </Flex>
);

const Gallery = () => (
  <>
    <GalleryBody />
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

export const ImagesList = (props: ImagesListProps) => {
  const { imagesTotalCount } = props;
  return (
    <PaginationProvider
      itemCount={imagesTotalCount ?? 0}
      perPageOptions={[50, 250, 1000]}
    >
      <ImagesListProvider {...props}>
        <Body />
      </ImagesListProvider>
    </PaginationProvider>
  );
};
