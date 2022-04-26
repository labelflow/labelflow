import { BreadcrumbLink, Skeleton, Text } from "@chakra-ui/react";
import NextLink from "next/link";
import React from "react";
import { chakraDecorator, storybookTitle } from "../../../../utils/stories";
import { CollapsibleBreadcrumbs } from "./collapsible-breadcrumbs";

export default {
  title: storybookTitle("Breadcrumbs", CollapsibleBreadcrumbs),
  decorators: [chakraDecorator],
};

export const Empty = () => {
  return <CollapsibleBreadcrumbs />;
};

export const Loading = () => {
  return (
    <CollapsibleBreadcrumbs>
      <NextLink href="/test/datasets">
        <BreadcrumbLink>Datasets</BreadcrumbLink>
      </NextLink>

      <NextLink href="/test/datasets/xxx/images">
        <Skeleton>Dataset Name</Skeleton>
      </NextLink>

      <NextLink href="/test/datasets/xxx/images">
        <BreadcrumbLink>Images</BreadcrumbLink>
      </NextLink>

      <Skeleton>Image Name</Skeleton>
    </CollapsibleBreadcrumbs>
  );
};

export const Normal = () => {
  return (
    <CollapsibleBreadcrumbs>
      <NextLink href="/test/datasets">
        <BreadcrumbLink>Datasets</BreadcrumbLink>
      </NextLink>

      <NextLink href="/test/datasets/xxx/images">
        <BreadcrumbLink>Hello</BreadcrumbLink>
      </NextLink>

      <NextLink href="/test/datasets/xxx/images">
        <BreadcrumbLink>Images</BreadcrumbLink>
      </NextLink>

      <Text>World</Text>
    </CollapsibleBreadcrumbs>
  );
};

export const LongNames1Element = () => {
  return (
    <CollapsibleBreadcrumbs>
      <NextLink href="/test/datasets/xxx/images">
        <BreadcrumbLink>
          Hello this is a very long dataset name is it not ?
        </BreadcrumbLink>
      </NextLink>
    </CollapsibleBreadcrumbs>
  );
};

export const LongNames2Element = () => {
  return (
    <CollapsibleBreadcrumbs>
      <NextLink href="/test/datasets/xxx/images">
        <BreadcrumbLink>
          Hello this is a very long dataset name is it not ?
        </BreadcrumbLink>
      </NextLink>

      <Text>Wow such a looooooooooong image name bro ! What the hell</Text>
    </CollapsibleBreadcrumbs>
  );
};

export const LongNames3Element = () => {
  return (
    <CollapsibleBreadcrumbs>
      <NextLink href="/test/datasets">
        <BreadcrumbLink>Datasets</BreadcrumbLink>
      </NextLink>

      <NextLink href="/test/datasets/xxx/images">
        <BreadcrumbLink>
          Hello this is a very long dataset name is it not ?
        </BreadcrumbLink>
      </NextLink>

      <Text>Wow such a looooooooooong image name bro ! What the hell</Text>
    </CollapsibleBreadcrumbs>
  );
};

export const LongNames4Element = () => {
  return (
    <CollapsibleBreadcrumbs>
      <NextLink href="/test/datasets">
        <BreadcrumbLink>Datasets</BreadcrumbLink>
      </NextLink>

      <NextLink href="/test/datasets/xxx/images">
        <BreadcrumbLink>
          Hello this is a very long dataset name is it not ?
        </BreadcrumbLink>
      </NextLink>

      <NextLink href="/test/datasets/xxx/images">
        <BreadcrumbLink>Images</BreadcrumbLink>
      </NextLink>

      <Text>Wow such a looooooooooong image name bro ! What the hell</Text>
    </CollapsibleBreadcrumbs>
  );
};

export const LongNames5Element = () => {
  return (
    <CollapsibleBreadcrumbs>
      <NextLink href="/test/datasets">
        <BreadcrumbLink>Datasets</BreadcrumbLink>
      </NextLink>

      <NextLink href="/test/datasets/xxx/images">
        <BreadcrumbLink>
          Hello this is a very long dataset name is it not ?
        </BreadcrumbLink>
      </NextLink>

      <NextLink href="/test/datasets/xxx/images">
        <BreadcrumbLink>Images</BreadcrumbLink>
      </NextLink>

      <NextLink href="/test/datasets/xxx/images">
        <BreadcrumbLink>
          Even longer wowowowowo whats going on yoooooo way too long to be
          honest
        </BreadcrumbLink>
      </NextLink>

      <Text>Wow such a looooooooooong image name bro ! What the hell</Text>
    </CollapsibleBreadcrumbs>
  );
};

export const LongNames6Element = () => {
  return (
    <CollapsibleBreadcrumbs>
      <NextLink href="/test/datasets">
        <BreadcrumbLink>Datasets</BreadcrumbLink>
      </NextLink>

      <NextLink href="/test/datasets/xxx/images">
        <BreadcrumbLink>
          Hello this is a very long dataset name is it not ?
        </BreadcrumbLink>
      </NextLink>

      <NextLink href="/test/datasets/xxx/images">
        <BreadcrumbLink>Images</BreadcrumbLink>
      </NextLink>

      <NextLink href="/test/datasets/xxx/images">
        <BreadcrumbLink>
          Even longer wowowowowo whats going on yoooooo way too long to be
          honest
        </BreadcrumbLink>
      </NextLink>

      <NextLink href="/test/datasets/xxx/images">
        <BreadcrumbLink>
          Wow such a looooooooooong image name bro ! What the hell
        </BreadcrumbLink>
      </NextLink>

      <Text>Longer again dayuuuummmmmmm bro whaaaaaaaaaat sooooo lonnnggg</Text>
    </CollapsibleBreadcrumbs>
  );
};

export const DifferentSettings1 = () => {
  return (
    <CollapsibleBreadcrumbs
      maxNumberOfBreadcrumbsBeforeSplit={4}
      numberOfFirstBreadcrumbsDisplayedWhenSplit={1}
      numberOfLastBreadcrumbsDisplayedWhenSplit={2}
    >
      <NextLink href="/test/datasets">
        <BreadcrumbLink>Datasets</BreadcrumbLink>
      </NextLink>

      <NextLink href="/test/datasets/xxx/images">
        <BreadcrumbLink>
          Hello this is a very long dataset name is it not ?
        </BreadcrumbLink>
      </NextLink>

      <NextLink href="/test/datasets/xxx/images">
        <BreadcrumbLink>Images</BreadcrumbLink>
      </NextLink>

      <NextLink href="/test/datasets/xxx/images">
        <BreadcrumbLink>
          Even longer wowowowowo whats going on yoooooo way too long to be
          honest
        </BreadcrumbLink>
      </NextLink>

      <NextLink href="/test/datasets/xxx/images">
        <BreadcrumbLink>
          Wow such a looooooooooong image name bro ! What the hell
        </BreadcrumbLink>
      </NextLink>

      <Text>Longer again dayuuuummmmmmm bro whaaaaaaaaaat sooooo lonnnggg</Text>
    </CollapsibleBreadcrumbs>
  );
};

export const DifferentSettings2 = () => {
  return (
    <CollapsibleBreadcrumbs
      maxNumberOfBreadcrumbsBeforeSplit={3}
      numberOfFirstBreadcrumbsDisplayedWhenSplit={0}
      numberOfLastBreadcrumbsDisplayedWhenSplit={2}
    >
      <NextLink href="/test/datasets">
        <BreadcrumbLink>Datasets</BreadcrumbLink>
      </NextLink>

      <NextLink href="/test/datasets/xxx/images">
        <BreadcrumbLink>
          Hello this is a very long dataset name is it not ?
        </BreadcrumbLink>
      </NextLink>

      <NextLink href="/test/datasets/xxx/images">
        <BreadcrumbLink>Images</BreadcrumbLink>
      </NextLink>

      <NextLink href="/test/datasets/xxx/images">
        <BreadcrumbLink>
          Even longer wowowowowo whats going on yoooooo way too long to be
          honest
        </BreadcrumbLink>
      </NextLink>

      <NextLink href="/test/datasets/xxx/images">
        <BreadcrumbLink>
          Wow such a looooooooooong image name bro ! What the hell
        </BreadcrumbLink>
      </NextLink>

      <Text>Longer again dayuuuummmmmmm bro whaaaaaaaaaat sooooo lonnnggg</Text>
    </CollapsibleBreadcrumbs>
  );
};
