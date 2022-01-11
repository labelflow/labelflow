import { PaginationToolbar } from "./pagination-toolbar";
import { usePagination } from "./pagination.context";

export const PaginationFooter = () => {
  const { total } = usePagination();
  return (
    <>{total > 0 && <PaginationToolbar pos="fixed" bottom={0} w="100%" />}</>
  );
};
