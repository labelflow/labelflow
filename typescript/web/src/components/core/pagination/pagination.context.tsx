import {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useReducer,
} from "react";
import { DEFAULT_PER_PAGE_OPTIONS } from "./page-input.constants";

export type PaginationPayload = { page: number; perPage: number };

export type PaginationState = PaginationPayload & {
  perPageOptions: number[];
  itemCount: number;
  total: number;
  setPagination: (pagination: Partial<PaginationPayload>) => void;
  setPage: (page: number) => void;
  setPerPage: (perPage: number) => void;
  previous: () => void;
  next: () => void;
};

export const PaginationContext = createContext({} as PaginationState);

export const usePagination = () => useContext(PaginationContext);

const paginationReducer = (
  prevState: PaginationPayload,
  nextState: Partial<PaginationPayload>
): PaginationPayload => ({ ...prevState, ...nextState });

export type PaginationProps = Pick<
  PaginationState,
  "itemCount" | "perPageOptions"
> &
  Partial<PaginationPayload> &
  PropsWithChildren<{}>;

const usePrevious = ({
  page,
  setPagination,
}: Pick<
  PaginationState,
  "page" | "setPagination"
>): PaginationState["previous"] => {
  return useCallback(() => {
    if (page < 2) return;
    setPagination({ page: page - 1 });
  }, [page, setPagination]);
};

const useNext = ({
  page,
  total,
  setPagination,
}: Pick<
  PaginationState,
  "page" | "total" | "setPagination"
>): PaginationState["next"] => {
  return useCallback(() => {
    if (page > total - 1) return;
    setPagination({ page: page + 1 });
  }, [page, setPagination, total]);
};

const useNavigation = (
  state: Pick<PaginationState, "setPagination" | "page" | "total">
): Pick<PaginationState, "previous" | "next"> => ({
  previous: usePrevious(state),
  next: useNext(state),
});

const usePaginationState = ({
  page: defaultPage = 1,
  perPageOptions = DEFAULT_PER_PAGE_OPTIONS,
  perPage: defaultPerPage = perPageOptions[0],
  itemCount,
}: Omit<PaginationProps, "children">): PaginationState => {
  const [pagination, setPagination] = useReducer(paginationReducer, {
    page: defaultPage,
    perPage: defaultPerPage,
  });
  const { perPage } = pagination;
  const total = Math.max(1, Math.ceil(itemCount / perPage));
  const page = Math.min(Math.max(1, pagination.page), total);
  return {
    page,
    perPage,
    perPageOptions,
    itemCount,
    total,
    setPagination,
    setPerPage: (value: number) =>
      setPagination({ perPage: value, page: perPage !== value ? 1 : page }),
    setPage: (value: number) => setPagination({ page: value }),
    ...useNavigation({ page, total, setPagination }),
  };
};

export const PaginationProvider = ({ children, ...props }: PaginationProps) => (
  <PaginationContext.Provider value={usePaginationState(props)}>
    {children}
  </PaginationContext.Provider>
);
