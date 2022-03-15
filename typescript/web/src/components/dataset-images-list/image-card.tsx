import {
  Checkbox,
  Flex,
  FlexProps,
  HStack,
  Skeleton,
  Text,
  useBoolean,
  useColorModeValue,
  VStack,
} from "@chakra-ui/react";
import NextLink from "next/link";
import {
  ChangeEvent,
  createContext,
  PropsWithChildren,
  useContext,
} from "react";
import { EmptyStateImageNotFound } from "../empty-state";
import { ImageWithFallback } from "../image";
import { Tooltip } from "../tooltip";
import { useImagesList } from "./images-list.context";

export type ImageCardProps = {
  id: string;
  name: string;
  thumbnail?: string | null;
  href: string;
};

type ImageCardState = ImageCardProps & {
  displayOverlay: boolean;
  showOverlay: () => void;
  hideOverlay: () => void;
};

const ImageCardContext = createContext({} as ImageCardState);

const useProvider = (props: ImageCardProps): ImageCardState => {
  const { imagesSelected } = useImagesList();
  const [displayOverlay, { on: showOverlay, off: hideOverlay }] =
    useBoolean(false);
  return {
    ...props,
    displayOverlay: imagesSelected.length !== 0 || displayOverlay,
    showOverlay,
    hideOverlay,
  };
};

const ImageCardProvider = ({
  children,
  ...props
}: PropsWithChildren<ImageCardProps>) => (
  <ImageCardContext.Provider value={useProvider(props)}>
    {children}
  </ImageCardContext.Provider>
);

const useImageCard = () => useContext(ImageCardContext);

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
      w="full"
    />
  );
};

const OverlayTopRow = () => {
  const { displayOverlay, id } = useImageCard();
  const { imagesSelected, setImagesSelected } = useImagesList();
  const handleChecked = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked === true) {
      setImagesSelected([...imagesSelected, id]);
    } else {
      const newArray = imagesSelected.filter((imageId) => imageId !== id);
      setImagesSelected(newArray);
    }
  };
  return (
    <HStack
      alignSelf="stretch"
      justify="flex-start"
      visibility={displayOverlay ? "visible" : "hidden"}
      p={4}
      pointerEvents="all"
    >
      <Checkbox
        colorScheme="unset"
        size="lg"
        onChange={handleChecked}
        isChecked={imagesSelected.includes(id)}
        borderColor="white"
      />
    </HStack>
  );
};

const OverlayBottomRow = () => {
  const { name } = useImageCard();
  return (
    <HStack justify="flex-start" p={2} pointerEvents="all">
      <Tooltip label={name}>
        <Text isTruncated fontWeight="semibold">
          {name}
        </Text>
      </Tooltip>
    </HStack>
  );
};

const useOverlayBackground = (): FlexProps | undefined => {
  const { displayOverlay } = useImageCard();
  return displayOverlay
    ? {
        backgroundColor: "rgba(0, 0, 0, 0.65)",
        transition: "background-color .125s",
      }
    : undefined;
};

const ImageOverlay = () => (
  <Flex
    pointerEvents="none"
    position="absolute"
    borderRadius="md"
    top={0}
    bottom={0}
    left={0}
    right={0}
    minW={0}
    background="linear-gradient(to top, rgba(0, 0, 0, .65), rgba(26, 32, 44, 0) 33%);"
    {...useOverlayBackground()}
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
  return <ImageOverlay />;
};

const ImageCardContent = () => {
  const { name, showOverlay, hideOverlay, href } = useImageCard();
  return (
    <Flex
      onMouseEnter={showOverlay}
      onMouseLeave={hideOverlay}
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
      <NextLink href={href}>
        <a title="Open image" href={href} data-testid={name}>
          <ImageContent />
        </a>
      </NextLink>
    </Flex>
  );
};

export const ImageCard = (props: ImageCardProps) => (
  <ImageCardProvider {...props}>
    <ImageCardContent />
  </ImageCardProvider>
);
