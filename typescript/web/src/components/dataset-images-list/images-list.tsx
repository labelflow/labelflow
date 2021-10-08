import React, { useState } from "react";
import NextLink from "next/link";
import {
  Box,
  VStack,
  Flex,
  useColorModeValue as mode,
  Image,
  Center,
  Spinner,
  Text,
  Heading,
  SimpleGrid,
  IconButton,
  chakra,
} from "@chakra-ui/react";
import { isEmpty } from "lodash/fp";
import { HiTrash } from "react-icons/hi";
import type { Image as ImageType } from "@labelflow/graphql-types";
import { ImportButton } from "../import-button";
import { EmptyStateNoImages } from "../empty-state";
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
      {!images && (
        <Center h="full">
          <Spinner size="xl" />
        </Center>
      )}
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
            {images?.map(({ id, name, url }) => (
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
                    <Image
                      background={imageBackground}
                      alt={name}
                      src={url}
                      ignoreFallback
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
