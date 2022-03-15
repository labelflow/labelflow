import {
  Flex,
  HStack,
  IconButton,
  Skeleton,
  Text,
  useColorModeValue,
  VStack,
} from "@chakra-ui/react";
import NextLink from "next/link";
import {
  createContext,
  MouseEvent,
  PropsWithChildren,
  useCallback,
  useContext,
} from "react";
import { HiTrash } from "react-icons/hi";
import { EmptyStateImageNotFound } from "../empty-state";
import { ImageWithFallback } from "../image";
import { Tooltip } from "../tooltip";

export type ImageCardProps = {
  id: string;
  name: string;
  thumbnail?: string | null;
  href: string;
  onAskImageDelete: (imageId: string) => void;
};

const ImageCardContext = createContext({} as ImageCardProps);

const ImageCardProvider = ({
  children,
  ...props
}: PropsWithChildren<ImageCardProps>) => (
  <ImageCardContext.Provider value={props}>
    {children}
  </ImageCardContext.Provider>
);

const useImageCard = () => useContext(ImageCardContext);

const DeleteButton = () => {
  const { id, onAskImageDelete } = useImageCard();
  const handleClick = useCallback(
    (event: MouseEvent<HTMLButtonElement>) => {
      // Prevent parent onClick event from being fired too
      event.preventDefault();
      event.stopPropagation();
      onAskImageDelete(id);
    },
    [onAskImageDelete, id]
  );
  return (
    <Tooltip label="Delete image">
      <IconButton
        _hover={{ bgColor: "rgba(0, 0, 0, .2)" }}
        _active={{ bgColor: "gray.600" }}
        color="white"
        aria-label="delete image"
        isRound
        size="md"
        onClick={handleClick}
        variant="ghost"
      >
        <HiTrash />
      </IconButton>
    </Tooltip>
  );
};

const ImageErrorFallback = () => (
  <Flex
    align="center"
    justify="center"
    h="208px"
    bg={useColorModeValue("gray.400", "gray.600")}
    borderRadius="md"
  >
    <EmptyStateImageNotFound h="150px" />
  </Flex>
);

const ImageContent = () => {
  const { name, thumbnail } = useImageCard();
  return (
    <ImageWithFallback
      borderRadius="md"
      alt={name}
      src={thumbnail ?? undefined}
      loadingFallback={<Skeleton h="208px" borderRadius="md" />}
      errorFallback={<ImageErrorFallback />}
      objectFit="cover"
      h="208px"
    />
  );
};

const OverlayTopRow = () => (
  <HStack
    alignSelf="stretch"
    justify="flex-end"
    visibility="hidden"
    _groupHover={{ visibility: "visible" }}
    p={1}
  >
    <DeleteButton />
  </HStack>
);

const OverlayBottomRow = () => {
  const { name } = useImageCard();
  return (
    <HStack justify="flex-start" p={2}>
      <Tooltip label={name}>
        <Text isTruncated fontWeight="semibold">
          {name}
        </Text>
      </Tooltip>
    </HStack>
  );
};

const ImageOverlay = () => (
  <Flex
    position="absolute"
    borderRadius="md"
    top={0}
    bottom={0}
    left={0}
    right={0}
    background="linear-gradient(to top, rgba(0, 0, 0, .65), rgba(26, 32, 44, 0) 33%);"
    _groupHover={{
      backgroundColor: "rgba(0, 0, 0, 0.65)",
      transition: "background-color .125s",
    }}
    minW={0}
  >
    <VStack
      flexGrow={1}
      minW={0}
      justify="space-between"
      align="stretch"
      color="white"
    >
      <OverlayTopRow />
      <OverlayBottomRow />
    </VStack>
  </Flex>
);

const ClickableOverlay = () => {
  const { href, name } = useImageCard();
  return (
    <NextLink href={href}>
      <a title="Open image" href={href} data-testid={name}>
        <ImageOverlay />
      </a>
    </NextLink>
  );
};

const ImageCardContent = () => {
  const { name } = useImageCard();
  return (
    <Flex
      direction="column"
      align="stretch"
      data-testid={`image-card-${name}`}
      position="relative"
      role="group"
      borderRadius="md"
      borderWidth={1}
      borderColor={useColorModeValue("gray.200", "gray.800")}
      maxW="350px"
    >
      <ClickableOverlay />
      <ImageContent />
    </Flex>
  );
};

export const ImageCard = (props: ImageCardProps) => (
  <ImageCardProvider {...props}>
    <ImageCardContent />
  </ImageCardProvider>
);
