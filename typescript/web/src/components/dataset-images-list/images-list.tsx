import {
  Box,
  Button,
  Center,
  Heading,
  HStack,
  SimpleGrid,
  Text,
} from "@chakra-ui/react";
import { isEmpty } from "lodash/fp";
import { HiOutlineTrash } from "react-icons/hi";
import {
  BiCheckboxChecked,
  BiCheckbox,
  BiCheckboxSquare,
} from "react-icons/bi";
import React, { useCallback, useState } from "react";
import { EmptyStateNoImages } from "../empty-state";
import { ImportButton } from "../import-button";
import { PaginationProvider } from "../pagination";
import { PaginationFooter } from "../pagination/pagination-footer";
import { LayoutSpinner } from "../spinner";
import { DeleteManyImagesModal } from "./delete-many-images-modal";
import { ImageCard } from "./image-card";
import {
  ImagesListProps,
  ImagesListProvider,
  useImagesList,
} from "./images-list.context";
import { DeleteImageModal } from "./delete-image-modal";

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

const Gallery = () => {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const handleDeleteModalClose = useCallback(() => {
    setIsDeleteModalOpen(false);
  }, []);
  const {
    workspaceSlug,
    datasetSlug,
    datasetId,
    images,
    imagesSelected,
    toDelete,
    setToDelete,
    setImagesSelected,
  } = useImagesList();
  const selectedLength = imagesSelected.length;
  const isSelectedEmpty = selectedLength === 0;
  const getButtonIcon = () => {
    if (isSelectedEmpty) {
      return <BiCheckbox size="22" />;
    }
    if (selectedLength === images.length) {
      return <BiCheckboxChecked size="22" />;
    }
    return <BiCheckboxSquare size="22" />;
  };
  const selectionButtonClick = () => {
    if (isSelectedEmpty) {
      const newSelectedArray = images.map((image) => image.id);
      setImagesSelected(newSelectedArray);
    } else {
      setImagesSelected([]);
    }
  };
  const handleDeleteManyClick = useCallback(() => {
    setIsDeleteModalOpen(true);
  }, []);
  return (
    <>
      <HStack
        d="flex"
        bg="white"
        h="48px"
        px={{ base: "2", md: "8" }}
        alignItems="center"
        borderTop="1px"
        borderColor="gray.100"
        boxShadow="sm"
      >
        <Button
          variant="ghost"
          size="sm"
          leftIcon={getButtonIcon()}
          onClick={selectionButtonClick}
        >
          {isSelectedEmpty ? "Select all" : "Deselect all"}
        </Button>
        <Button
          data-testid="delete-selected-images"
          variant="ghost"
          size="sm"
          leftIcon={<HiOutlineTrash />}
          disabled={isSelectedEmpty}
          onClick={handleDeleteManyClick}
        >
          Delete selected
        </Button>
      </HStack>
      <DeleteImageModal
        isOpen={!isEmpty(toDelete)}
        onClose={() => setToDelete(undefined)}
        imageId={toDelete}
        datasetId={datasetId!}
      />
      <DeleteManyImagesModal
        isOpen={isDeleteModalOpen}
        onClose={handleDeleteModalClose}
        datasetId={datasetId!}
      />
      <SimpleGrid
        minChildWidth="312px"
        spacing={{ base: "2", md: "8" }}
        padding={{ base: "2", md: "8" }}
        paddingBottom={{ base: "24", md: "16" }}
      >
        {images?.map(({ id, name, thumbnail500Url }) => (
          <ImageCard
            key={id}
            id={id}
            name={name}
            thumbnail={thumbnail500Url}
            href={`/${workspaceSlug}/datasets/${datasetSlug}/images/${id}`}
            onAskImageDelete={setToDelete}
          />
        ))}
      </SimpleGrid>
    </>
  );
};

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
        <PaginationFooter />
      </ImagesListProvider>
    </PaginationProvider>
  );
};
