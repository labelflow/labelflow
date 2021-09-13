import React, { ReactNode } from "react";
import {
  chakra,
  BreadcrumbItem,
  ChakraProps,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  MenuButtonProps,
} from "@chakra-ui/react";

import { RiArrowRightSLine } from "react-icons/ri";
import { VscEllipsis } from "react-icons/vsc";

const ArrowRightIcon = chakra(RiArrowRightSLine);
const EllipsisIcon = chakra(VscEllipsis);

const breadcrumbItemSx: ChakraProps["sx"] = {
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
  maxWidth: "20em",
  "& p, a": {
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },
};

export const CollapsedBreadcrumbs = ({
  children,
  containsLastElement = false,
  ...otherProps
}: {
  children?: ReactNode;
  containsLastElement?: boolean;
} & MenuButtonProps) => {
  const childrenCount = React.Children.count(children);
  const childrenArray = React.Children.toArray(children);

  return (
    <Menu>
      <MenuButton
        as={IconButton}
        aria-label="Options"
        icon={<EllipsisIcon fontSize="2xl" />}
        variant="outline"
        {...otherProps}
      />
      <MenuList>
        {(() => {
          if (containsLastElement) {
            return [
              ...childrenArray.slice(0, childrenCount - 1).map((child) => (
                <MenuItem icon={<ArrowRightIcon color="gray.500" />}>
                  <BreadcrumbItem sx={breadcrumbItemSx}>{child}</BreadcrumbItem>{" "}
                </MenuItem>
              )),
              <MenuItem
                icon={<ArrowRightIcon color="gray.500" />}
                disabled
                sx={{
                  cursor: "default",
                  ":hover": { background: "none" },
                  ":active": { background: "none" },
                  ":focus": { background: "none" },
                }}
              >
                <BreadcrumbItem sx={breadcrumbItemSx} isCurrentPage>
                  {childrenArray[childrenCount - 1]}
                </BreadcrumbItem>{" "}
              </MenuItem>,
            ];
          }
          return childrenArray.map((child) => (
            <MenuItem icon={<ArrowRightIcon color="gray.500" />}>
              <BreadcrumbItem sx={breadcrumbItemSx}>{child}</BreadcrumbItem>{" "}
            </MenuItem>
          ));
        })()}
      </MenuList>
    </Menu>
  );
};
