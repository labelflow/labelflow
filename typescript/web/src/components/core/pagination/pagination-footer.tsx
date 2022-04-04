import {
  PaginationToolbar,
  PaginationToolbarProps,
} from "./pagination-toolbar";
import { usePagination } from "./pagination.context";

export type PaginationFooterProps = PaginationToolbarProps;

export const PaginationFooter = (props: PaginationFooterProps) => {
  const { itemCount } = usePagination();
  return (
    <>
      {itemCount > 0 && (
        <PaginationToolbar
          pos="fixed"
          bottom={0}
          w="100%"
          left={0}
          {...props}
        />
      )}
    </>
  );
};
