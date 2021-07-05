import {
  Box,
  Image,
  Text,
  VStack,
  HStack,
  Flex,
  Spacer,
  IconButton,
  AspectRatio,
  chakra,
} from "@chakra-ui/react";
import { HiTrash, HiPencilAlt } from "react-icons/hi";
import { EmptyStateImage } from "../empty-state";

const EditIcon = chakra(HiPencilAlt);
const TrashIcon = chakra(HiTrash);

export const ProjectCard = (props: {
  projectName: string;
  imageUrl?: string;
  imageAlt?: string;
  imagesCount: number;
  labelClassesCount: number;
  labelsCount: number;
  editProject: () => void;
  deleteProject: () => void;
}) => {
  const {
    projectName,
    imageUrl,
    imageAlt,
    imagesCount,
    labelClassesCount,
    labelsCount,
    editProject,
    deleteProject,
  } = props;

  // This card is flexible, so its width will depend on the width of its parent
  return (
    <Box
      w="100%"
      h="2xs"
      borderWidth="0px"
      borderRadius="16px"
      overflow="hidden"
      bg="white"
    >
      <AspectRatio maxH="36">
        {imageUrl ? (
          <Image src={imageUrl} alt={imageAlt} alignSelf="center" fit="cover" />
        ) : (
          <EmptyStateImage />
        )}
      </AspectRatio>
      <VStack pt="2" pl="5" pr="5" pb="5" align="left">
        <Flex alignItems="center">
          <Text fontWeight="semibold" fontSize="md" isTruncated>
            {projectName}
          </Text>
          <Spacer />
          <IconButton
            icon={<EditIcon />}
            aria-label="edit project"
            isRound
            size="sm"
            mr="2"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              editProject();
            }}
          />
          <IconButton
            icon={<TrashIcon />}
            aria-label="delete project"
            isRound
            size="sm"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              deleteProject();
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
  );
};
