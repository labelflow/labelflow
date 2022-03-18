import {
  Box,
  BoxProps,
  chakra,
  Text,
  useColorModeValue,
  VStack,
} from "@chakra-ui/react";
import { isNil } from "lodash/fp";
import {
  ChangeEvent,
  DragEvent as ReactDragEvent,
  PropsWithChildren,
  useCallback,
  useEffect,
} from "react";
import { RiUpload2Line } from "react-icons/ri";
import { DropZoneProvider, useDropZone } from "./drop-zone.context";

const UploadIcon = chakra(RiUpload2Line);

const DefaultContent = () => (
  <VStack
    justify="center"
    align="center"
    bg={useColorModeValue("gray.300", "gray.500")}
    borderWidth="3px"
    borderStyle="dashed"
    rounded="md"
    py="3em"
    px="1em"
  >
    <UploadIcon fontSize="4xl" />
    <Text>Drag and drop files or click to browse...</Text>
  </VStack>
);

const usePreventDefaultDrop = () => {
  useEffect(() => {
    const preventDefault = (event: DragEvent) => event.preventDefault();
    window.addEventListener("dragover", preventDefault);
    window.addEventListener("drop", preventDefault);
    return () => {
      window.removeEventListener("dragover", preventDefault);
      window.removeEventListener("drop", preventDefault);
    };
  });
};

const useInputChange = () => {
  const { onDrop } = useDropZone();
  return useCallback(
    ({ target: { files } }: ChangeEvent<HTMLInputElement>) => {
      if (isNil(files)) return;
      onDrop(files);
    },
    [onDrop]
  );
};

const DropZoneInput = () => {
  const { inputRef } = useDropZone();
  const handleChange = useInputChange();
  return (
    <input
      data-testid="drop-zone-input"
      type="file"
      ref={inputRef}
      style={{ display: "none" }}
      value=""
      onChange={handleChange}
      multiple
    />
  );
};

const useOnDrop = () => {
  const { onDrop } = useDropZone();
  return useCallback(
    ({ dataTransfer: { files } }: ReactDragEvent<HTMLInputElement>) =>
      onDrop(files),
    [onDrop]
  );
};

export type DropZoneProps = Omit<BoxProps, "onDrop" | "onClick"> & {
  onDrop: (files: FileList) => void;
};

type DropZoneBoxProps = Omit<DropZoneProps, "onDrop">;

const DropZoneChildren = ({ children }: PropsWithChildren<{}>) => (
  <>{isNil(children) ? <DefaultContent /> : children}</>
);

const DropZoneBox = ({ children, ...props }: DropZoneBoxProps) => {
  const { inputRef } = useDropZone();
  return (
    <Box
      data-testid="drop-zone-box"
      userSelect="none"
      cursor="pointer"
      onClick={() => inputRef.current?.click()}
      onDrop={useOnDrop()}
      {...props}
    >
      <DropZoneChildren>{children}</DropZoneChildren>
    </Box>
  );
};

export const DropZone = ({ onDrop, ...props }: DropZoneProps) => {
  usePreventDefaultDrop();
  return (
    <DropZoneProvider onDrop={onDrop}>
      <DropZoneInput />
      <DropZoneBox {...props} />
    </DropZoneProvider>
  );
};
