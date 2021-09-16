import React, { ReactNode } from "react";
import { chakra, useColorModeValue as mode } from "@chakra-ui/react";

import { HiOutlineChevronDoubleRight } from "react-icons/hi";
import { CollapsibleBreadcrumbs } from "./collapsible-breadcrumbs";

const BreadcrumbIcon = chakra(HiOutlineChevronDoubleRight);

export type ResponsiveBreadcrumbsProps = {
  children?: ReactNode;
};

const sxBase = {
  "& ol": {
    display: "flex",
  },
  " & [role=presentation]": {
    flexShrink: 0,
  },
};

export const ResponsiveBreadcrumbs = ({
  children,
}: ResponsiveBreadcrumbsProps) => {
  return (
    <>
      <CollapsibleBreadcrumbs
        sx={{
          ...sxBase,
          display: { base: "inline", md: "none", lg: "none" },
        }}
        maxNumberOfBreadcrumbsBeforeSplit={0}
        numberOfFirstBreadcrumbsDisplayedWhenSplit={0}
        numberOfLastBreadcrumbsDisplayedWhenSplit={0}
        collapsedProps={{
          variant: "ghost",
          icon: (
            <BreadcrumbIcon
              fontSize="xl"
              color={mode("gray.700", "gray.300")}
            />
          ),
        }}
      >
        {children}
      </CollapsibleBreadcrumbs>
      <CollapsibleBreadcrumbs
        sx={{
          ...sxBase,
          display: { base: "none", md: "inline", lg: "none" },
        }}
        maxNumberOfBreadcrumbsBeforeSplit={3}
        numberOfFirstBreadcrumbsDisplayedWhenSplit={0}
        numberOfLastBreadcrumbsDisplayedWhenSplit={2}
      >
        {children}
      </CollapsibleBreadcrumbs>
      <CollapsibleBreadcrumbs
        sx={{
          ...sxBase,
          display: { base: "none", md: "none", lg: "inline" },
        }}
        maxNumberOfBreadcrumbsBeforeSplit={4}
        numberOfFirstBreadcrumbsDisplayedWhenSplit={1}
        numberOfLastBreadcrumbsDisplayedWhenSplit={2}
      >
        {children}
      </CollapsibleBreadcrumbs>
    </>
  );
};
