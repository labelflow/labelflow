import {
  chakra,
  IconButton,
  Skeleton,
  Text,
  Box,
  HStack,
  VStack,
  Tooltip,
} from "@chakra-ui/react";
import NextLink from "next/link";
import { createContext, MouseEvent, useCallback, useContext } from "react";
import { HiTrash } from "react-icons/hi";
import { EmptyStateImageNotFound } from "../empty-state";
import { ImageWithFallback } from "../image";

const TrashIcon = chakra(HiTrash);

// Props are actually used with the context
/* eslint-disable react/no-unused-prop-types */
type ImageCardProps = {
  id: string;
  name: string;
  thumbnail?: string | null;
  href: string;
  onAskImageDelete: (imageId: string) => void;
};

const ImageCardContext = createContext({} as ImageCardProps);

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
      _hover={{ bgColor: "gray.700" }}
      color="white"
      icon={<TrashIcon />}
      aria-label="delete image"
      isRound
      size="sm"
      onClick={handleClick}
      variant="ghost"
    />
  );
};

const ImageContent = () => {
  const { name, thumbnail } = useImageCard();
  return (
    <ImageWithFallback
      borderRadius={8}
      alt={name}
      src={thumbnail ?? undefined}
      loadingFallback={<Skeleton height="100%" width="100%" />}
      errorFallback={<EmptyStateImageNotFound />}
      objectFit="cover"
      h="208px"
      w="full"
    />
  );
};

const OverlayTopRow = () => (
  <HStack
    visibility="hidden"
    justifyContent="flex-end"
    w="100%"
    sx={{
      ".imageCard:hover &": {
        visibility: "visible",
      },
    }}
  >
    <DeleteButton />
  </HStack>
);

const OverlayBottomRow = () => {
  const { name } = useImageCard();
  return (
    <HStack justifyContent="flex-start" w="full" maxW="full">
      <Tooltip label={name}>
        <Text isTruncated fontWeight={700}>
          {name}
        </Text>
      </Tooltip>
    </HStack>
  );
};

const ImageOverlay = () => (
  <Box
    className="imageOverlay"
    borderRadius={8}
    p={2}
    display="flex"
    position="absolute"
    w="full"
    h="full"
    background="linear-gradient(to top, rgba(0, 0, 0, 1), rgba(0, 0, 0, 0) 33%);"
  >
    <VStack color="white" flexGrow={1} justify="space-between" maxW="full">
      <OverlayTopRow />
      <OverlayBottomRow />
    </VStack>
  </Box>
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
  <Box
    className="imageCard"
    position="relative"
    cursor="pointer"
    sx={{
      ".imageCard:hover .imageOverlay, .imageOverlay:hover": {
        display: "flex",
        background: "none",
        backgroundColor: "rgba(0, 0, 0, 0.4)",
      },
    }}
  >
    <ClickableOverlay />
    <ImageContent />
  </Box>
);

export const ImageCard = (props: ImageCardProps) => (
  <ImageCardContext.Provider value={props}>
    <ImageCardContent />
  </ImageCardContext.Provider>
);
