import React from "react";
import {
  chakra,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Skeleton,
} from "@chakra-ui/react";
import NextLink from "next/link";
import { RiArrowRightSLine } from "react-icons/ri";

const ArrowRightIcon = chakra(RiArrowRightSLine);
export const Breadcrumbs = (props: {}) => {
  return (
    <Breadcrumb
      overflow="hidden"
      textOverflow="ellipsis"
      whiteSpace="nowrap"
      spacing="8px"
      sx={{ "*": { display: "inline !important" } }}
      separator={<ArrowRightIcon color="gray.500" />}
    >
      <BreadcrumbItem>
        <NextLink href="/local/datasets">
          <BreadcrumbLink>Datasets</BreadcrumbLink>
        </NextLink>
      </BreadcrumbItem>

      <BreadcrumbItem isCurrentPage>
        <NextLink href={`/local/datasets/${datasetSlug}/images`}>
          <BreadcrumbLink>
            {datasetName ?? <Skeleton>Dataset Name</Skeleton>}
          </BreadcrumbLink>
        </NextLink>
      </BreadcrumbItem>

      <BreadcrumbItem>
        <NextLink href={`/local/datasets/${datasetSlug}/images`}>
          <BreadcrumbLink>Images</BreadcrumbLink>
        </NextLink>
      </BreadcrumbItem>

      <BreadcrumbItem isCurrentPage>
        {imageName ? <Text>{imageName}</Text> : <Skeleton>Image Name</Skeleton>}
      </BreadcrumbItem>
    </Breadcrumb>
  );
};
