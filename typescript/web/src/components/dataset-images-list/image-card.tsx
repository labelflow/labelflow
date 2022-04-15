import {
  Checkbox,
  Flex,
  FlexProps,
  HStack,
  Skeleton,
  IconButton,
  Text,
  useBoolean,
  useColorModeValue,
  VStack,
  useControllableState,
} from "@chakra-ui/react";
import NextLink from "next/link";
import {
  ChangeEvent,
  createContext,
  FC,
  PropsWithChildren,
  MouseEvent,
  useCallback,
  useContext,
  memo,
} from "react";
import { HiTrash } from "react-icons/hi";
import { SetRequired } from "type-fest";
import { ImageWithFallback, Tooltip } from "../core";
import { EmptyStateImageNotFound } from "../empty-state";

export const IMAGE_CARD_HEIGHT = 208;

export type ImageCardProps = {
  id: string;
  name: string;
  thumbnail?: string | null;
  href: string;
  onDelete: (imageId: string) => void;
  selected?: boolean;
  onChangeSelected?: (value: boolean) => void;
};

type ImageCardState = SetRequired<
  Omit<ImageCardProps, "onChangeSelected">,
  "selected"
> & {
  displayOverlay: boolean;
  showOverlay: () => void;
  hideOverlay: () => void;
  setSelected: (value: boolean) => void;
};

const ImageCardContext = createContext({} as ImageCardState);

const useProvider = ({
  selected: selectedProp,
  onChangeSelected,
  ...props
}: ImageCardProps): ImageCardState => {
  const [displayOverlay, { on: showOverlay, off: hideOverlay }] =
    useBoolean(false);
  const [selected, setSelected] = useControllableState({
    defaultValue: false,
    value: selectedProp,
    onChange: onChangeSelected,
  });
  return {
    ...props,
    displayOverlay: selected || displayOverlay,
    showOverlay,
    hideOverlay,
    selected,
    setSelected,
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

const SelectCheckbox = () => {
  const { name, selected, setSelected } = useImageCard();
  const handleChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => setSelected(event.target.checked),
    [setSelected]
  );
  return (
    <Checkbox
      data-testid={`select-image-checkbox-${name}`}
      size="lg"
      onChange={handleChange}
      isChecked={selected}
      colorScheme={selected ? "unset" : undefined}
      borderColor="white"
      iconColor="white"
    />
  );
};

const DeleteButton = () => {
  const { id, onDelete } = useImageCard();
  const handleClick = useCallback(
    (event: MouseEvent<HTMLButtonElement>) => {
      // Prevent parent onClick event from being fired too
      event.preventDefault();
      event.stopPropagation();
      onDelete(id);
    },
    [onDelete, id]
  );
  return (
    <Tooltip label="Delete image">
      <IconButton
        _hover={{ bgColor: "gray.500" }}
        _active={{ bgColor: "gray.600" }}
        color="white"
        aria-label="delete image"
        isRound
        onClick={handleClick}
        variant="ghost"
        h="32px"
        minW="32px"
        size="lg"
      >
        <HiTrash />
      </IconButton>
    </Tooltip>
  );
};

const OverlayTopRow = () => {
  const { displayOverlay } = useImageCard();
  return (
    <HStack
      alignSelf="stretch"
      justify="space-between"
      visibility={displayOverlay ? "visible" : "hidden"}
      pl={3}
      pr={2}
      py={2}
      pointerEvents="all"
    >
      <SelectCheckbox />
      <DeleteButton />
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

const ImageErrorFallback = () => (
  <Flex
    align="center"
    justify="center"
    h={`${IMAGE_CARD_HEIGHT}px`}
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
      loadingFallback={
        <Skeleton h={`${IMAGE_CARD_HEIGHT}px`} borderRadius="md" />
      }
      errorFallback={<ImageErrorFallback />}
      objectFit="cover"
      h={`${IMAGE_CARD_HEIGHT}px`}
      w="full"
    />
  );
};

const ClickableImageContent = () => {
  const { name, href } = useImageCard();
  return (
    <NextLink href={href}>
      <a title="Open image" href={href} data-testid={name}>
        <ImageContent />
      </a>
    </NextLink>
  );
};

const ImageCardContent = () => {
  const { name, showOverlay, hideOverlay } = useImageCard();
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
    >
      <ImageOverlay />
      <ClickableImageContent />
    </Flex>
  );
};

// We use FC to workaround this TypeScript compiler bug:
//   Type instantiation is excessively deep and possibly infinite
//   https://github.com/microsoft/TypeScript/issues/34933
const ImageCardComponent: FC<ImageCardProps> = (props: ImageCardProps) => (
  <ImageCardProvider {...props}>
    <ImageCardContent />
  </ImageCardProvider>
);

export const ImageCard = memo(ImageCardComponent);
