import React from "react";
import {
  BreadcrumbItem,
  Breadcrumb,
  BreadcrumbLink,
  Skeleton,
  Text,
  chakra,
} from "@chakra-ui/react";
import NextLink from "next/link";
import { chakraDecorator } from "../../../../../utils/chakra-decorator";

import { Breadcrumbs } from "..";

import { RiArrowRightSLine } from "react-icons/ri";

const ArrowRightIcon = chakra(RiArrowRightSLine);

export default {
  title: "web/Breadcrumbs",
  decorators: [chakraDecorator],
};

export const Empty = () => {
  return <Breadcrumbs />;
};

export const Loading = () => {
  return (
    <Breadcrumbs>
      <NextLink href="/local/datasets">
        <BreadcrumbLink>Datasets</BreadcrumbLink>
      </NextLink>

      <NextLink href="/local/datasets/xxx/images">
        <Skeleton>Dataset Name</Skeleton>
      </NextLink>

      <NextLink href="/local/datasets/xxx/images">
        <BreadcrumbLink>Images</BreadcrumbLink>
      </NextLink>

      <Skeleton>Image Name</Skeleton>
    </Breadcrumbs>
  );
};

export const Normal = () => {
  return (
    <Breadcrumbs>
      <NextLink href="/local/datasets">
        <BreadcrumbLink>Datasets</BreadcrumbLink>
      </NextLink>

      <NextLink href="/local/datasets/xxx/images">
        <BreadcrumbLink>Hello</BreadcrumbLink>
      </NextLink>

      <NextLink href="/local/datasets/xxx/images">
        <BreadcrumbLink>Images</BreadcrumbLink>
      </NextLink>

      <Text>World</Text>
    </Breadcrumbs>
  );
};

export const LongNames1Element = () => {
  return (
    <Breadcrumbs>
      <NextLink href="/local/datasets/xxx/images">
        <BreadcrumbLink>
          Hello this is a very long dataset name is it not ?
        </BreadcrumbLink>
      </NextLink>
    </Breadcrumbs>
  );
};

export const LongNames2Element = () => {
  return (
    <Breadcrumbs>
      <NextLink href="/local/datasets/xxx/images">
        <BreadcrumbLink>
          Hello this is a very long dataset name is it not ?
        </BreadcrumbLink>
      </NextLink>

      <Text>Wow such a looooooooooong image name bro ! What the hell</Text>
    </Breadcrumbs>
  );
};

export const LongNames3Element = () => {
  return (
    <Breadcrumbs>
      <NextLink href="/local/datasets">
        <BreadcrumbLink>Datasets</BreadcrumbLink>
      </NextLink>

      <NextLink href="/local/datasets/xxx/images">
        <BreadcrumbLink>
          Hello this is a very long dataset name is it not ?
        </BreadcrumbLink>
      </NextLink>

      <Text>Wow such a looooooooooong image name bro ! What the hell</Text>
    </Breadcrumbs>
  );
};

export const LongNames4Element = () => {
  return (
    <Breadcrumbs>
      <NextLink href="/local/datasets">
        <BreadcrumbLink>Datasets</BreadcrumbLink>
      </NextLink>

      <NextLink href="/local/datasets/xxx/images">
        <BreadcrumbLink>
          Hello this is a very long dataset name is it not ?
        </BreadcrumbLink>
      </NextLink>

      <NextLink href="/local/datasets/xxx/images">
        <BreadcrumbLink>Images</BreadcrumbLink>
      </NextLink>

      <Text>Wow such a looooooooooong image name bro ! What the hell</Text>
    </Breadcrumbs>
  );
};

export const LongNames5Element = () => {
  return (
    <Breadcrumbs>
      <NextLink href="/local/datasets">
        <BreadcrumbLink>Datasets</BreadcrumbLink>
      </NextLink>

      <NextLink href="/local/datasets/xxx/images">
        <BreadcrumbLink>
          Hello this is a very long dataset name is it not ?
        </BreadcrumbLink>
      </NextLink>

      <NextLink href="/local/datasets/xxx/images">
        <BreadcrumbLink>Images</BreadcrumbLink>
      </NextLink>

      <NextLink href="/local/datasets/xxx/images">
        <BreadcrumbLink>
          Even longer wowowowowo whats going on yoooooo way too long to be
          honest
        </BreadcrumbLink>
      </NextLink>

      <Text>Wow such a looooooooooong image name bro ! What the hell</Text>
    </Breadcrumbs>
  );
};

export const LongNames6Element = () => {
  return (
    <Breadcrumbs>
      <NextLink href="/local/datasets">
        <BreadcrumbLink>Datasets</BreadcrumbLink>
      </NextLink>

      <NextLink href="/local/datasets/xxx/images">
        <BreadcrumbLink>
          Hello this is a very long dataset name is it not ?
        </BreadcrumbLink>
      </NextLink>

      <NextLink href="/local/datasets/xxx/images">
        <BreadcrumbLink>Images</BreadcrumbLink>
      </NextLink>

      <NextLink href="/local/datasets/xxx/images">
        <BreadcrumbLink>
          Even longer wowowowowo whats going on yoooooo way too long to be
          honest
        </BreadcrumbLink>
      </NextLink>

      <NextLink href="/local/datasets/xxx/images">
        <BreadcrumbLink>
          Wow such a looooooooooong image name bro ! What the hell
        </BreadcrumbLink>
      </NextLink>

      <Text>Longer again dayuuuummmmmmm bro whaaaaaaaaaat sooooo lonnnggg</Text>
    </Breadcrumbs>
  );
};

export const Manual = () => {
  return (
    <Breadcrumb
      overflow="hidden"
      textOverflow="ellipsis"
      whiteSpace="nowrap"
      spacing="8px"
      separator={<ArrowRightIcon color="gray.500" />}
    >
      {[
        <BreadcrumbItem>
          <NextLink href="/local/datasets">
            <BreadcrumbLink>Datasets</BreadcrumbLink>
          </NextLink>
        </BreadcrumbItem>,

        <BreadcrumbItem isCurrentPage>
          <NextLink href="Ok">
            <BreadcrumbLink>Yo</BreadcrumbLink>
          </NextLink>
        </BreadcrumbItem>,

        <BreadcrumbItem>
          <NextLink href="Ok">
            <BreadcrumbLink>Images</BreadcrumbLink>
          </NextLink>
        </BreadcrumbItem>,

        <BreadcrumbItem isCurrentPage>
          <Text>Ok</Text>
        </BreadcrumbItem>,
      ]}
    </Breadcrumb>
  );
};
