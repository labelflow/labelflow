import { HStack, IconButton, IconButtonProps, Tooltip } from "@chakra-ui/react";
import { RiArrowLeftSLine, RiArrowRightSLine } from "react-icons/ri";
import { PageInput } from "./page-input";
import { usePagination } from "./pagination.context";

type NavigationButtonProps = Required<
  Pick<IconButtonProps, "disabled" | "aria-label" | "onClick" | "icon">
> & {
  tooltip: string;
};

const NavigationButton = ({
  tooltip,
  disabled,
  ...props
}: NavigationButtonProps) => (
  <Tooltip label={tooltip} isDisabled={disabled} placement="top">
    <IconButton disabled={disabled} bg="none" {...props} />
  </Tooltip>
);

const Previous = () => {
  const { page, previous } = usePagination();
  const disabled = page < 2;
  return (
    <NavigationButton
      aria-label={disabled ? "No previous page" : "Previous page"}
      tooltip={`Previous page: ${page - 1}`}
      icon={<RiArrowLeftSLine size="1.5em" />}
      disabled={disabled}
      onClick={previous}
    />
  );
};

const Next = () => {
  const { page, total, next } = usePagination();
  const disabled = page >= total;
  return (
    <NavigationButton
      aria-label={disabled ? "No next page" : "Next page"}
      tooltip={`Next Page: ${page + 1}`}
      icon={<RiArrowRightSLine size="1.5em" />}
      disabled={disabled}
      onClick={next}
    />
  );
};

export const PageNavigation = () => (
  <HStack h={10} p={0} spacing={1} rounded={6} pointerEvents="initial">
    <Previous />
    <PageInput />
    <Next />
  </HStack>
);
