import {
  Box,
  Image,
  Text,
  VStack,
  useColorModeValue as mode,
  HStack,
  Flex,
  Spacer,
  IconButton,
  AspectRatio,
  chakra,
} from "@chakra-ui/react";
import NextLink from "next/link";
import { HiTrash, HiPencilAlt } from "react-icons/hi";
import { EmptyStateNoImages } from "../empty-state";

const EditIcon = chakra(HiPencilAlt);
const TrashIcon = chakra(HiTrash);

export const DatasetCard = (props: {
  url: string;
  datasetName: string;
  imageUrl?: string;
  imageAlt?: string;
  imagesCount: number;
  labelClassesCount: number;
  labelsCount: number;
  editDataset: () => void;
  deleteDataset: () => void;
}) => {
  const {
    url,
    datasetName,
    imageUrl,
    imageAlt,
    imagesCount,
    labelClassesCount,
    labelsCount,
    editDataset,
    deleteDataset,
  } = props;

  // This card is flexible, so its width will depend on the width of its parent
  return (
    <Box
      w="100%"
      maxWidth={["100%", "100%", "50%", "33%", "25%"]}
      p={4}
      boxSizing="border-box"
    >
      <NextLink href={url}>
        <Box
          as="a"
          w="100%"
          h="2xs"
          borderWidth="0px"
          borderRadius="16px"
          overflow="hidden"
          bg={mode("white", "gray.700")}
          display="block"
          cursor="pointer"
        >
          <AspectRatio maxH="36">
            {imageUrl ? (
              <Image
                src={imageUrl}
                alt={imageAlt}
                alignSelf="center"
                fit="cover"
              />
            ) : (
              <EmptyStateNoImages />
            )}
          </AspectRatio>
          <VStack pt="2" pl="5" pr="5" pb="5" align="left">
            <Flex alignItems="center">
              <Text fontWeight="semibold" fontSize="md" isTruncated>
                {datasetName}
              </Text>
              <Spacer />
              <IconButton
                icon={<EditIcon />}
                aria-label="edit dataset"
                isRound
                size="sm"
                mr="2"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  editDataset();
                }}
              />
              <IconButton
                icon={<TrashIcon />}
                aria-label="delete dataset"
                isRound
                size="sm"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  deleteDataset();
                }}
              />
            </Flex>

            <HStack lineHeight="base" spacing="5" pt="2">
              <Text fontWeight="semibold" isTruncated>
                <Text as="span">{imagesCount} </Text>
                <Text color="gray.400" as="span">
                  Images
                </Text>
              </Text>
              <Text fontWeight="semibold" isTruncated>
                <Text as="span">{labelClassesCount} </Text>
                <Text color="gray.400" as="span">
                  Classes
                </Text>
              </Text>
              <Text fontWeight="semibold" isTruncated>
                <Text as="span">{labelsCount} </Text>
                <Text color="gray.400" as="span">
                  Labels
                </Text>
              </Text>
            </HStack>
          </VStack>
        </Box>
      </NextLink>
    </Box>
  );
};
