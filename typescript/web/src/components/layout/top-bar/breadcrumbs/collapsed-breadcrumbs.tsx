import React, { ReactNode } from "react";
import {
  chakra,
  BreadcrumbItem,
  ChakraProps,
  IconButton,
  IconButtonProps,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  useColorModeValue as mode,
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

export type CollapsedBreadcrumbsProps = {
  children?: ReactNode;
  containsLastElement?: boolean;
} & Partial<IconButtonProps>;

export const CollapsedBreadcrumbs = ({
  children,
  containsLastElement = false,
  ...otherProps
}: CollapsedBreadcrumbsProps) => {
  const childrenCount = React.Children.count(children);
  const childrenArray = React.Children.toArray(children);

  return (
    <Menu isLazy>
      <MenuButton
        as={IconButton}
        aria-label="Navigation"
        icon={<EllipsisIcon fontSize="xl" />}
        color={mode("gray.700", "gray.300")}
        variant="ghost"
        {...otherProps}
      />
      <MenuList>
        {(() => {
          if (containsLastElement) {
            return [
              ...childrenArray
                .slice(0, childrenCount - 1)
                .map((child, index) => (
                  <MenuItem
                    // eslint-disable-next-line react/no-array-index-key
                    key={index}
                    icon={<ArrowRightIcon color="gray.500" />}
                    onClick={(e) => {
                      // This is a very dirty Hack, to prevent Chakra's Menu
                      // from masking the Link / buttons that constitute the breadcrumb
                      // Here, we basically "forward" the click event to the breadcrumb element
                      // which is a couple floors down in the DOM tree...
                      const target = e?.target as HTMLButtonElement;
                      const breadcrumbContent = target?.children?.[1]
                        ?.children?.[0]?.children?.[0] as
                        | HTMLElement
                        | undefined;
                      if (breadcrumbContent) {
                        // Pretend to click the thing, whether it's a link or a button
                        breadcrumbContent.click();
                      }
                    }}
                  >
                    <BreadcrumbItem sx={breadcrumbItemSx}>
                      {child}
                    </BreadcrumbItem>{" "}
                  </MenuItem>
                )),
              <MenuItem
                key="last"
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
          return childrenArray.map((child, index) => (
            <MenuItem
              // eslint-disable-next-line react/no-array-index-key
              key={index}
              icon={<ArrowRightIcon color="gray.500" />}
              onClick={(e) => {
                // This is a very dirty Hack, to prevent Chakra's Menu
                // from masking the Link / buttons that constitute the breadcrumb
                // Here, we basically "forward" the click event to the breadcrumb element
                // which is a couple floors down in the DOM tree...
                const target = e?.target as HTMLButtonElement;
                const breadcrumbContent = target?.children?.[1]?.children?.[0]
                  ?.children?.[0] as HTMLElement | undefined;
                if (breadcrumbContent) {
                  // Pretend to click the thing, whether it's a link or a button
                  breadcrumbContent.click();
                }
              }}
            >
              <BreadcrumbItem sx={breadcrumbItemSx}>{child}</BreadcrumbItem>{" "}
            </MenuItem>
          ));
        })()}
      </MenuList>
    </Menu>
  );
};