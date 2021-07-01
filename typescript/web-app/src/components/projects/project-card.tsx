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
        <Image src={imageUrl} alt={imageAlt} alignSelf="center" fit="cover" />
      </AspectRatio>
      <VStack pt="2" pl="5" pr="5" pb="5" align="left">
        <Flex alignItems="center">
          <Text fontWeight="semibold" fontSize="16px" isTruncated maxW="25ch">
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
        {/* TODO: fix the overflow of the numbers displayed in the card */}
        <HStack lineHeight="base" spacing="5" pt="2">
          <Box>
            <Text fontWeight="semibold" fontSize="16px" as="span">
              {imagesCount}{" "}
            </Text>
            <Text fontWeight="semibold" color="gray.400" as="span">
              Images
            </Text>
          </Box>
          <Box>
            <Text fontWeight="semibold" fontSize="16px" as="span">
              {labelClassesCount}{" "}
            </Text>
            <Text fontWeight="semibold" color="gray.400" as="span">
              Classes
            </Text>
          </Box>
          <Box>
            <Text fontWeight="semibold" fontSize="16px" as="span">
              {labelsCount}{" "}
            </Text>
            <Text fontWeight="semibold" color="gray.400" as="span">
              Labels
            </Text>
          </Box>
        </HStack>
      </VStack>
    </Box>
  );
};
