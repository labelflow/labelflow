import {
  Box,
  Center,
  chakra,
  Flex,
  Heading,
  IconButton,
  SimpleGrid,
  Skeleton,
  Text,
  useColorModeValue as mode,
  VStack,
} from "@chakra-ui/react";
import type { Image as ImageType } from "@labelflow/graphql-types";
import { isEmpty } from "lodash/fp";
import NextLink from "next/link";
import React, { useState } from "react";
import { HiTrash } from "react-icons/hi";
import { EmptyStateImageNotFound, EmptyStateNoImages } from "../empty-state";
import { ImageWithFallback } from "../image";
import { ImportButton } from "../import-button";
import { LayoutSpinner } from "../spinner";
import { DeleteImageModal } from "./delete-image-modal";

const TrashIcon = chakra(HiTrash);

export const ImagesList = ({
  datasetSlug,
  workspaceSlug,
  images,
}: {
  datasetSlug: string;
  workspaceSlug: string;
  images: ImageType[] | undefined;
}) => {
  const [imageIdToDelete, setImageIdToDelete] = useState<string | null>(null);

  const cardBackground = mode("white", "gray.700");
  const imageBackground = mode("gray.100", "gray.800");
  return (
    <>
      {!images && <LayoutSpinner />}
      {isEmpty(images) && (
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
      )}

      {!isEmpty(images) && (
        <>
          <DeleteImageModal
            isOpen={imageIdToDelete != null}
            onClose={() => setImageIdToDelete(null)}
            imageId={imageIdToDelete}
          />
          <SimpleGrid
            minChildWidth="240px"
            spacing={{ base: "2", md: "8" }}
            padding={{ base: "2", md: "8" }}
          >
            {images?.map(({ id, name, thumbnail500Url }) => (
              <NextLink
                href={`/${workspaceSlug}/datasets/${datasetSlug}/images/${id}`}
                key={id}
              >
                <a
                  href={`/${workspaceSlug}/datasets/${datasetSlug}/images/${id}`}
                >
                  <VStack
                    maxW="486px"
                    p={4}
                    background={cardBackground}
                    rounded={8}
                    height="270px"
                    justifyContent="space-between"
                  >
                    <Flex
                      justifyContent="space-between"
                      w="100%"
                      alignItems="center"
                    >
                      <Heading
                        as="h3"
                        size="sm"
                        overflow="hidden"
                        textOverflow="ellipsis"
                        whiteSpace="nowrap"
                      >
                        {name}
                      </Heading>
                      <IconButton
                        icon={<TrashIcon />}
                        aria-label="delete image"
                        isRound
                        size="sm"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setImageIdToDelete(id);
                        }}
                      />
                    </Flex>
                    <ImageWithFallback
                      background={imageBackground}
                      alt={name}
                      src={thumbnail500Url ?? undefined}
                      loadingFallback={<Skeleton height="100%" width="100%" />}
                      errorFallback={<EmptyStateImageNotFound />}
                      objectFit="contain"
                      h="208px"
                      w="full"
                      flexGrow={0}
                      flexShrink={0}
                    />
                  </VStack>
                </a>
              </NextLink>
            ))}
          </SimpleGrid>
        </>
      )}
    </>
  );
};
