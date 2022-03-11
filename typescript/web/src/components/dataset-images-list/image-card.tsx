import {
  chakra,
  Flex,
  HStack,
  IconButton,
  Skeleton,
  Text,
  Tooltip,
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
    <IconButton
      data-testid="delete-image-button"
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
  );
};

const ImageContent = () => {
  const { name, thumbnail } = useImageCard();
  return (
    <ImageWithFallback
      borderRadius="md"
      alt={name}
      src={thumbnail ?? undefined}
      loadingFallback={<Skeleton />}
      errorFallback={<EmptyStateImageNotFound />}
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
    <HStack justify="flex-start" p={3}>
      <Tooltip label={name} openDelay={500}>
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
  >
    <VStack
      minW={0}
      color="white"
      flexGrow={1}
      justify="space-between"
      align="stretch"
    >
      <OverlayTopRow />
      <OverlayBottomRow />
    </VStack>
  </Flex>
);

const ClickableOverlay = () => {
  const { href } = useImageCard();
  return (
    <NextLink href={href}>
      <a title="Open image" href={href}>
        <ImageOverlay />
      </a>
    </NextLink>
  );
};

const ImageCardContent = () => (
  <Flex
    direction="column"
    align="stretch"
    data-testid="image-card"
    position="relative"
    role="group"
    borderRadius="md"
    borderWidth={1}
    borderColor={useColorModeValue("gray.200", "gray.800")}
  >
    <ClickableOverlay />
    <ImageContent />
  </Flex>
);

export const ImageCard = (props: ImageCardProps) => (
  <ImageCardProvider {...props}>
    <ImageCardContent />
  </ImageCardProvider>
);
