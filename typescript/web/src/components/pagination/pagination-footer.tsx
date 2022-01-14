import { PaginationToolbar } from "./pagination-toolbar";
import { usePagination } from "./pagination.context";

export const PaginationFooter = () => {
  const { itemCount } = usePagination();
  return (
    <>
      {itemCount > 0 && <PaginationToolbar pos="fixed" bottom={0} w="100%" />}
    </>
  );
};
