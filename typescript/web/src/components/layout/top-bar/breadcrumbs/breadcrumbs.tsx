import React, { ReactNode } from "react";
import {
  chakra,
  Breadcrumb,
  BreadcrumbItem,
  ChakraProps,
  useColorModeValue as mode,
} from "@chakra-ui/react";
import { RiArrowRightSLine } from "react-icons/ri";
import { CollapsedBreadcrumbs } from "./collapsed-breadcrumbs";

const ArrowRightIcon = chakra(RiArrowRightSLine);

const breadcrumbItemSx: ChakraProps["sx"] = {
  height: "10",
  boxSizing: "border-box",
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
  maxWidth: "30em",
  minWidth: "3em",
  "& p, a, span": {
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },
};

export const Breadcrumbs = ({
  children,
  maxNumberOfBreadcrumbsBeforeSplit = 4,
  numberOfFirstBreadcrumbsDisplayedWhenSplit = 1,
  numberOfLastBreadcrumbsDisplayedWhenSplit = 2,
}: {
  children?: ReactNode;
  maxNumberOfBreadcrumbsBeforeSplit?: number;
  numberOfFirstBreadcrumbsDisplayedWhenSplit?: number;
  numberOfLastBreadcrumbsDisplayedWhenSplit?: number;
}) => {
  const childrenCount = React.Children.count(children);
  const childrenArray = React.Children.toArray(children);

  return (
    <>
      <CollapsedBreadcrumbs
        containsLastElement
        sx={{ display: { base: "inline-flex", md: "none" } }}
        icon={<ArrowRightIcon color={mode("gray.800", "gray.200")} />}
      >
        {childrenArray}
      </CollapsedBreadcrumbs>
      <Breadcrumb
        overflow="hidden"
        textOverflow="ellipsis"
        whiteSpace="nowrap"
        spacing="8px"
        sx={{
          "& ol": {
            display: "flex",
          },
          display: { base: "none", md: "inline !important" },
        }}
        // sx={{ "*": { display: "inline !important" } }}
        separator={<ArrowRightIcon color="gray.500" />}
      >
        {(() => {
          if (childrenCount <= 0) {
            return [];
          }
          if (childrenCount <= 1) {
            return [
              <BreadcrumbItem sx={breadcrumbItemSx} isCurrentPage>
                {childrenArray[0]}
              </BreadcrumbItem>,
            ];
          }
          if (childrenCount <= maxNumberOfBreadcrumbsBeforeSplit) {
            return [
              ...childrenArray
                .slice(0, childrenCount - 1)
                .map((child) => (
                  <BreadcrumbItem sx={breadcrumbItemSx}>{child}</BreadcrumbItem>
                )),
              <BreadcrumbItem sx={breadcrumbItemSx} isCurrentPage>
                {childrenArray[childrenCount - 1]}
              </BreadcrumbItem>,
            ];
          }
          return [
            ...childrenArray
              .slice(0, numberOfFirstBreadcrumbsDisplayedWhenSplit)
              .map((child) => (
                <BreadcrumbItem sx={breadcrumbItemSx}>{child}</BreadcrumbItem>
              )),
            <BreadcrumbItem overflow="visible">
              <CollapsedBreadcrumbs>
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
              .map((child) => (
                <BreadcrumbItem sx={breadcrumbItemSx}>{child}</BreadcrumbItem>
              )),
            <BreadcrumbItem sx={breadcrumbItemSx} isCurrentPage>
              {childrenArray[childrenCount - 1]}
            </BreadcrumbItem>,
          ];
        })()}
      </Breadcrumb>
    </>
  );
};
