import React, { ReactNode } from "react";
import {
  chakra,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbProps,
  ChakraProps,
} from "@chakra-ui/react";
import { RiArrowRightSLine } from "react-icons/ri";

import {
  CollapsedBreadcrumbs,
  CollapsedBreadcrumbsProps,
} from "./collapsed-breadcrumbs";

const ArrowRightIcon = chakra(RiArrowRightSLine);

const breadcrumbItemSx: ChakraProps["sx"] = {
  height: "10",
  boxSizing: "border-box",
  overflow: "hidden",
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
      sx={{
        display: "inline",
        "& ol": {
          display: "flex",
        },
        " & [role=presentation]": {
          flexShrink: 0,
        },
      }}
      separator={<ArrowRightIcon color="gray.500" />}
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
