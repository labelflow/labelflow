import { UseCounterProps } from "@chakra-ui/react";
import { clamp, isNaN } from "lodash/fp";
import {
  createContext,
  KeyboardEvent,
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { usePagination } from "./pagination.context";

const parseInputValue = (val: string): number => {
  return val === "" ? 1 : parseInt(val, 10);
};

export type InputState = {
  value: string;
  handleChange: UseCounterProps["onChange"];
  handleKeyDown: (event: KeyboardEvent<HTMLInputElement>) => void;
  handleBlur: () => void;
};

export type PageInputState = InputState & {
  digits: number;
};

export const PageInputContext = createContext({} as PageInputState);

export const usePageInput = () => useContext(PageInputContext);

const useHandleChange = (setValue: (value: string) => void) => {
  const { total } = usePagination();
  return useCallback(
    (valStr, valNum) => {
      if (!isNaN(valNum)) {
        setValue(clamp(valNum, 1, total).toString());
      } else if (valStr === "") {
        setValue("");
      }
    },
    [setValue, total]
  );
};

const useHandleKeyDown = (reset: () => void) => {
  const { setPage } = usePagination();
  return (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      const newPage = parseInputValue((event.target as HTMLInputElement).value);
      setPage(newPage);
    } else if (event.key === "Escape" || event.key === "Esc") {
      event.preventDefault();
      reset();
    }
  };
};

const useHandleBlur = (value: string) => {
  const { setPage } = usePagination();
  return useCallback(() => {
    const newPage = parseInputValue(value);
    setPage(newPage);
  }, [setPage, value]);
};

const useInput = (): InputState => {
  const { page } = usePagination();
  const [value, setValue] = useState(page.toString());
  const reset = useCallback(() => setValue(page.toString()), [page]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(reset, [page]);
  return {
    value,
    handleChange: useHandleChange(setValue),
    handleKeyDown: useHandleKeyDown(reset),
    handleBlur: useHandleBlur(value),
  };
};

const useDigits = () => {
  const { total } = usePagination();
  const digits = Math.ceil(Math.log10(total ?? 1));
  return Math.max(1, digits);
};

export type PageInputProviderProps = PropsWithChildren<{}>;

export const PageInputProvider = ({ children }: PageInputProviderProps) => {
  const inputState = useInput();
  const digits = useDigits();
  return (
    <PageInputContext.Provider value={{ ...inputState, digits }}>
      {children}
    </PageInputContext.Provider>
  );
};
