import React, { ReactNode } from "react";
import { useBreakpointValue } from "@chakra-ui/react";

import { CollapsibleBreadcrumbs } from "./collapsible-breadcrumbs";

export type ResponsiveBreadcrumbsProps = {
  children?: ReactNode;
};

const sxBase = {
  ml: 0,
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
  const breadcrumbSplittingProps = useBreakpointValue({
    base: {
      maxNumberOfBreadcrumbsBeforeSplit: 2,
      numberOfFirstBreadcrumbsDisplayedWhenSplit: 2,
      numberOfLastBreadcrumbsDisplayedWhenSplit: 0,
    },
    md: {
      maxNumberOfBreadcrumbsBeforeSplit: 5,
      numberOfFirstBreadcrumbsDisplayedWhenSplit: 2,
      numberOfLastBreadcrumbsDisplayedWhenSplit: 2,
    },
    xl: {
      maxNumberOfBreadcrumbsBeforeSplit: 6,
      numberOfFirstBreadcrumbsDisplayedWhenSplit: 3,
      numberOfLastBreadcrumbsDisplayedWhenSplit: 2,
    },
  });
  return (
    <CollapsibleBreadcrumbs sx={sxBase} {...breadcrumbSplittingProps}>
      {children}
    </CollapsibleBreadcrumbs>
  );
};
