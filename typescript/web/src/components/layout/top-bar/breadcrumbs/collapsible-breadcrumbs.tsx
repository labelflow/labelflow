import React, { ReactNode } from "react";
import {
  chakra,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbProps,
  ChakraProps,
  useColorModeValue,
} from "@chakra-ui/react";
// import { RiArrowRightSLine } from "react-icons/ri";

import {
  CollapsedBreadcrumbs,
  CollapsedBreadcrumbsProps,
} from "./collapsed-breadcrumbs";

// const ArrowRightIcon = chakra(RiArrowRightSLine);

const breadcrumbItemSx: ChakraProps["sx"] = {
  height: "10",
  boxSizing: "border-box",
  // // Ideally we'd want this, but there is a bug with ChakraUI
  // overflowX: "hidden",
  // overflowY: "visible",
  // // This is a workaround for the bug and seems to not cause any problem
  overflow: "visible",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
  maxWidth: "90em",
  minWidth: "3em",
  "& p, a, span": {
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },
};

export type CollapsibleBreadcrumbsProps = {
  children?: ReactNode;
  maxNumberOfBreadcrumbsBeforeSplit?: number;
  numberOfFirstBreadcrumbsDisplayedWhenSplit?: number;
  numberOfLastBreadcrumbsDisplayedWhenSplit?: number;
  collapsedProps?: Partial<CollapsedBreadcrumbsProps>;
} & Partial<BreadcrumbProps>;

export const CollapsibleBreadcrumbs = ({
  children,
  maxNumberOfBreadcrumbsBeforeSplit = 4,
  numberOfFirstBreadcrumbsDisplayedWhenSplit = 1,
  numberOfLastBreadcrumbsDisplayedWhenSplit = 2,
  collapsedProps,
  ...props
}: CollapsibleBreadcrumbsProps) => {
  const childrenCount = React.Children.count(children);
  const childrenArray = React.Children.toArray(children);

  const separatorColor = useColorModeValue("gray.300", "gray.600");
  return (
    <Breadcrumb
      overflowX="hidden"
      overflowY="visible"
      textOverflow="ellipsis"
      whiteSpace="nowrap"
      spacing="8px"
      // Next two lines allows to not hide the focus outline
      // of the collapsed breadcrumb button
      // Without this, the focus outline is hidden
      m={-2}
      p={2}
      // Next line aligns the breadcrumbs correctly to the left
      pl={0}
      sx={{
        display: "inline",
        "& ol": {
          display: "flex",
        },
        " & [role=presentation]": {
          flexShrink: 0,
        },
      }}
      // separator={<ArrowRightIcon color="gray.500" />}
      separator={
        <chakra.svg
          viewBox="0 0 24 24"
          width="8"
          mx="-3"
          height="8"
          stroke={separatorColor}
          strokeWidth="1"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          shapeRendering="geometricPrecision"
          color={separatorColor}
          overflow="visible"
        >
          <path d="M16.88 3.549L7.12 20.451" />
        </chakra.svg>
      }
      {...props}
    >
      {(() => {
        if (childrenCount <= 0) {
          return [];
        }
        if (childrenCount <= maxNumberOfBreadcrumbsBeforeSplit) {
          return [
            ...childrenArray.slice(0, childrenCount - 1).map((child, index) => (
              // eslint-disable-next-line react/no-array-index-key
              <BreadcrumbItem key={index} sx={breadcrumbItemSx}>
                {child}
              </BreadcrumbItem>
            )),
            <BreadcrumbItem key="last" sx={breadcrumbItemSx} isCurrentPage>
              {childrenArray[childrenCount - 1]}
            </BreadcrumbItem>,
          ];
        }
        return [
          ...childrenArray
            .slice(0, numberOfFirstBreadcrumbsDisplayedWhenSplit)
            .map((child, index) => (
              // eslint-disable-next-line react/no-array-index-key
              <BreadcrumbItem key={`first${index}`} sx={breadcrumbItemSx}>
                {child}
              </BreadcrumbItem>
            )),
          <BreadcrumbItem key="middle" overflow="visible">
            <CollapsedBreadcrumbs
              variant="ghost"
              containsLastElement={
                numberOfLastBreadcrumbsDisplayedWhenSplit <= 0
              }
              {...collapsedProps}
            >
              {childrenArray.slice(
                numberOfFirstBreadcrumbsDisplayedWhenSplit,
                childrenCount - numberOfLastBreadcrumbsDisplayedWhenSplit
              )}
            </CollapsedBreadcrumbs>
          </BreadcrumbItem>,
          ...childrenArray
            .slice(
              childrenCount - numberOfLastBreadcrumbsDisplayedWhenSplit,
              childrenCount - 1
            )
            .map((child, index) => (
              // eslint-disable-next-line react/no-array-index-key
              <BreadcrumbItem key={`last${index}`} sx={breadcrumbItemSx}>
                {child}
              </BreadcrumbItem>
            )),
          numberOfLastBreadcrumbsDisplayedWhenSplit > 0 ? (
            <BreadcrumbItem key="last" sx={breadcrumbItemSx} isCurrentPage>
              {childrenArray[childrenCount - 1]}
            </BreadcrumbItem>
          ) : null,
        ];
      })()}
    </Breadcrumb>
  );
};
