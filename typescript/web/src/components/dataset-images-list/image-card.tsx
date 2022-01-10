import {
  chakra,
  Flex,
  Heading,
  IconButton,
  Skeleton,
  useColorModeValue as mode,
  VStack,
} from "@chakra-ui/react";
import { Maybe } from "@labelflow/graphql-types";
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
  thumbnail?: Maybe<string>;
  href: string;
  onAskImageDelete: (imageId: string) => void;
};
/* eslint-enable react/no-unused-prop-types */

const ImageCardContext = createContext({} as ImageCardProps);

const useImageCard = () => useContext(ImageCardContext);

const NameHeading = () => {
  const { name } = useImageCard();
  return (
    <Heading
      as="h3"
      size="sm"
      overflow="hidden"
      textOverflow="ellipsis"
      whiteSpace="nowrap"
    >
      {name}
    </Heading>
  );
};

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
      icon={<TrashIcon />}
      aria-label="delete image"
      isRound
      size="sm"
      onClick={handleClick}
    />
  );
};

const Header = () => (
  <Flex justifyContent="space-between" w="100%" alignItems="center">
    <NameHeading />
    <DeleteButton />
  </Flex>
);

const Thumbnail = () => {
  const { name, thumbnail } = useImageCard();
  return (
    <ImageWithFallback
      background={mode("gray.100", "gray.800")}
      alt={name}
      src={thumbnail ?? undefined}
      loadingFallback={<Skeleton height="100%" width="100%" />}
      errorFallback={<EmptyStateImageNotFound />}
      objectFit="contain"
      h="208px"
      w="full"
      flexGrow={0}
      flexShrink={0}
    />
  );
};

const Body = () => (
  <VStack
    maxW="486px"
    p={4}
    background={mode("white", "gray.700")}
    rounded={8}
    height="270px"
    justifyContent="space-between"
  >
    <Header />
    <Thumbnail />
  </VStack>
);

export const ImageCardContent = () => {
  const { href } = useImageCard();
  return (
    <NextLink href={href}>
      <a title="Open image" href={href}>
        <Body />
      </a>
    </NextLink>
  );
};

export const ImageCard = (props: ImageCardProps) => (
  <ImageCardContext.Provider value={props}>
    <ImageCardContent />
  </ImageCardContext.Provider>
);
