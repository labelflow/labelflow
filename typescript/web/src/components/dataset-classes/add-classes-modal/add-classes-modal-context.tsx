import { ApolloError } from "@apollo/client";
import { isEmpty } from "lodash/fp";
import {
  createContext,
  Dispatch,
  PropsWithChildren,
  SetStateAction,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useDebounce } from "use-debounce";
import { useDatasetClasses } from "../dataset-classes.context";
import { useCreateManyLabelClassesMutation } from "./create-many-label-classes.mutation";

export type AddClassesModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export type ValueState = { value: string; error: string };

export type AddClassesModalState = ValueState & {
  setValue: (value: string) => void;
  submit: () => Promise<void>;
  count: number;
  duplicates: number;
  loading: boolean;
  canSubmit: boolean;
};

const AddClassesModalContext = createContext({} as AddClassesModalState);

export const useAddClassesModal = () => useContext(AddClassesModalContext);

type UseValueResult = {
  state: ValueState;
  setState: Dispatch<SetStateAction<ValueState>>;
  setValue: Dispatch<ValueState["value"]>;
  setError: Dispatch<ValueState["error"]>;
};

const useValue = (): UseValueResult => {
  const [state, setState] = useState<ValueState>({ value: "", error: "" });
  const setValue = (value: string) => setState({ value, error: "" });
  const setError = (error: string) =>
    setState((oldState) => ({ ...oldState, error }));
  return { state, setState, setValue, setError };
};

const useModalObserver = (
  isOpen: boolean,
  setValueState: Dispatch<SetStateAction<ValueState>>
) => {
  useEffect(() => {
    if (isOpen) return;
    setValueState({ value: "", error: "" });
  }, [isOpen, setValueState]);
};

const parseClassNames = (text: string): string[] =>
  text
    .split("\n")
    .map((className) => className.trim())
    .filter((name) => !isEmpty(name));

type FindDuplicatesOptions = {
  classNames: string[];
  existing: ReturnType<typeof useDatasetClasses>["labelClasses"];
};

type FindDuplicatesResult = { classNames: string[]; duplicates: number };

const findDuplicates = ({
  classNames,
  existing,
}: FindDuplicatesOptions): FindDuplicatesResult =>
  classNames.reduce<FindDuplicatesResult>(
    (prev, className) => {
      const { classNames: prevUnique, duplicates: prevDuplicates } = prev;
      const isDuplicate =
        existing?.some(({ name }) => className === name) ||
        prevUnique.includes(className);
      return isDuplicate
        ? { ...prev, duplicates: prevDuplicates + 1 }
        : { ...prev, classNames: [...prevUnique, className] };
    },
    { classNames: [], duplicates: 0 }
  );

type UseParseClassNamesOptions = Pick<AddClassesModalState, "value">;

type UseParseClassNamesResult = FindDuplicatesResult & { debouncing: boolean };

const useParseClassNames = ({
  value,
}: UseParseClassNamesOptions): UseParseClassNamesResult => {
  const [debounced] = useDebounce(value, 250, {
    leading: true,
    trailing: true,
  });
  const { labelClasses: existing } = useDatasetClasses();
  const result = useMemo(() => {
    const classNames = parseClassNames(debounced);
    return findDuplicates({ classNames, existing });
  }, [existing, debounced]);
  return { ...result, debouncing: value !== debounced };
};

type UseSubmitOptions = Pick<FindDuplicatesResult, "classNames"> &
  Pick<AddClassesModalState, "canSubmit"> &
  Pick<AddClassesModalProps, "onClose"> &
  Pick<UseValueResult, "setError">;

type UseSubmitResult = { submit: () => Promise<void>; loading: boolean };

const useSubmit = ({
  classNames,
  canSubmit,
  onClose,
  setError,
}: UseSubmitOptions): UseSubmitResult => {
  const { datasetId = "" } = useDatasetClasses();
  const [createLabelClasses, { loading }] = useCreateManyLabelClassesMutation(
    classNames,
    datasetId
  );
  const submit = useCallback(async () => {
    if (!canSubmit) return;
    try {
      await createLabelClasses();
      onClose();
    } catch (error) {
      if (error instanceof ApolloError) {
        setError(error.message);
      } else {
        throw error;
      }
    }
  }, [canSubmit, createLabelClasses, onClose, setError]);
  return { submit, loading };
};

const useProvider = ({
  isOpen,
  onClose,
}: AddClassesModalProps): AddClassesModalState => {
  const { loading: datasetLoading } = useDatasetClasses();
  const {
    state: { value, error },
    setState: setValueState,
    setValue,
    setError,
  } = useValue();
  const { classNames, duplicates, debouncing } = useParseClassNames({ value });
  const canSubmit = !debouncing && !datasetLoading && classNames.length > 0;
  const submitOpts = { classNames, canSubmit, onClose, setError };
  const { submit, loading: submitting } = useSubmit(submitOpts);
  const loading = submitting || datasetLoading;
  useModalObserver(isOpen, setValueState);
  return {
    value,
    error,
    submit,
    count: classNames.length,
    setValue,
    duplicates,
    loading,
    canSubmit: canSubmit && !submitting,
  };
};

export type AddClassesModalProviderProps =
  PropsWithChildren<AddClassesModalProps>;

export const AddClassesModalProvider = ({
  children,
  ...props
}: AddClassesModalProviderProps) => (
  <AddClassesModalContext.Provider value={useProvider(props)}>
    {children}
  </AddClassesModalContext.Provider>
);
