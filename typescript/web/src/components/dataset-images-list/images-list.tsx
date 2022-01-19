import { Box, Center, Heading, SimpleGrid, Text } from "@chakra-ui/react";
import { isEmpty } from "lodash/fp";
import React from "react";
import { EmptyStateNoImages } from "../empty-state";
import { ImportButton } from "../import-button";
import { PaginationProvider } from "../pagination";
import { PaginationFooter } from "../pagination/pagination-footer";
import { LayoutSpinner } from "../spinner";
import { DeleteImageModal } from "./delete-image-modal";
import { ImageCard } from "./image-card";
import {
  ImagesListProps,
  ImagesListProvider,
  useImagesList,
} from "./images-list.context";

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

        <ImportButton
          colorScheme="brand"
          variant="solid"
          mt="8"
          showModal={false}
        />
      </Box>
    </Box>
  </Center>
);

const Gallery = () => {
  const {
    workspaceSlug,
    datasetSlug,
    datasetId,
    toDelete,
    setToDelete,
    images,
  } = useImagesList();
  return (
    <>
      <DeleteImageModal
        isOpen={!isEmpty(toDelete)}
        onClose={() => setToDelete(undefined)}
        imageId={toDelete}
        datasetId={datasetId!}
      />
      <SimpleGrid
        minChildWidth="240px"
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
