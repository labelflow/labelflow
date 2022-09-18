import {
  createContext,
  PropsWithChildren,
  RefObject,
  useContext,
  useRef,
} from "react";

export type DropZoneState = {
  inputRef: RefObject<HTMLInputElement>;
  onDrop: (files: FileList) => void;
};

const DropZoneContext = createContext({} as DropZoneState);

export const useDropZone = () => useContext(DropZoneContext);

export type DropZoneProviderProps = PropsWithChildren<
  Pick<DropZoneState, "onDrop">
>;

const useProvider = (
  props: Omit<DropZoneProviderProps, "children">
): DropZoneState => {
  const inputElement = useRef<HTMLInputElement>(null);
  return { ...props, inputRef: inputElement };
};

export const DropZoneProvider = ({
  children,
  ...props
}: DropZoneProviderProps) => (
  <DropZoneContext.Provider value={useProvider(props)}>
    {children}
  </DropZoneContext.Provider>
);
