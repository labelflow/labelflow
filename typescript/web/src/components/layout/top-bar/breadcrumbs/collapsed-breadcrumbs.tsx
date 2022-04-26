import React, { ReactNode, forwardRef } from "react";
import {
  chakra,
  ChakraProps,
  IconButton,
  IconButtonProps,
  Menu,
  MenuButton,
  Tooltip,
  MenuItem,
  MenuList,
  useColorModeValue,
} from "@chakra-ui/react";

import { RiArrowRightSLine } from "react-icons/ri";
import { IoEllipsisHorizontalSharp } from "react-icons/io5";

const ArrowRightIcon = chakra(RiArrowRightSLine);
const EllipsisIcon = chakra(IoEllipsisHorizontalSharp);

const itemSx: ChakraProps["sx"] = {
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
  maxWidth: "30em",
  "& p, a, span": {
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },
};

export type CollapsedBreadcrumbsProps = {
  children?: ReactNode;
  containsLastElement?: boolean;
} & Partial<IconButtonProps>;

const TriggerButton = forwardRef<any, any>((props, ref) => (
  <Tooltip label="Open Navigation Menu" placement="bottom" openDelay={1000}>
    <MenuButton
      ref={ref}
      as={IconButton}
      aria-label="Navigate in hidden breadcrumbs"
      icon={<EllipsisIcon fontSize="xl" />}
      color={useColorModeValue("gray.700", "gray.300")}
      variant="ghost"
      {...props}
    />
  </Tooltip>
));

export const CollapsedBreadcrumbs = ({
  children,
  containsLastElement = false,
  ...otherProps
}: CollapsedBreadcrumbsProps) => {
  const childrenCount = React.Children.count(children);
  const childrenArray = React.Children.toArray(children);

  return (
    <Menu isLazy>
      <TriggerButton {...otherProps} />
      <MenuList aria-label="Hidden breadcrumbs">
        {(() => {
          if (containsLastElement) {
            return [
              ...childrenArray
                .slice(0, childrenCount - 1)
                .map((child, index) => (
                  <MenuItem
                    sx={itemSx}
                    // eslint-disable-next-line react/no-array-index-key
                    key={index}
                    icon={<ArrowRightIcon fontSize="lg" color="gray.500" />}
                    onClick={(e) => {
                      // This is a very dirty Hack, to prevent Chakra's Menu
                      // from masking the Link / buttons that constitute the breadcrumb
                      // Here, we basically "forward" the click event to the breadcrumb element
                      // which is a couple floors down in the DOM tree...
                      const target = e?.target as HTMLButtonElement;
                      const breadcrumbContent = target?.children?.[1]
                        ?.children?.[0] as HTMLElement | undefined;
                      if (breadcrumbContent) {
                        // Pretend to click the thing, whether it's a link or a button
                        breadcrumbContent.click();
                      }
                    }}
                  >
                    {child}
                  </MenuItem>
                )),
              <MenuItem
                key="last"
                icon={<ArrowRightIcon fontSize="lg" color="gray.500" />}
                disabled
                sx={{
                  ...itemSx,
                  cursor: "default",
                  ":hover": { background: "none" },
                  ":active": { background: "none" },
                  ":focus": { background: "none" },
                }}
              >
                {childrenArray[childrenCount - 1]}
              </MenuItem>,
            ];
          }
          return childrenArray.map((child, index) => (
            <MenuItem
              sx={itemSx}
              // eslint-disable-next-line react/no-array-index-key
              key={index}
              icon={<ArrowRightIcon fontSize="lg" color="gray.500" />}
              onClick={(e) => {
                // This is a very dirty Hack, to prevent Chakra's Menu
                // from masking the Link / buttons that constitute the breadcrumb
                // Here, we basically "forward" the click event to the breadcrumb element
                // which is a couple floors down in the DOM tree...
                const target = e?.target as HTMLButtonElement;
                const breadcrumbContent = target?.children?.[1]
                  ?.children?.[0] as HTMLElement | undefined;
                if (breadcrumbContent) {
                  // Pretend to click the thing, whether it's a link or a button
                  breadcrumbContent.click();
                }
              }}
            >
              {child}
            </MenuItem>
          ));
        })()}
      </MenuList>
    </Menu>
  );
};
