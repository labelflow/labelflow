/* eslint-disable @typescript-eslint/no-use-before-define */
import React from "react";
import { Story, DecoratorFn } from "@storybook/react";
import { withNextRouter } from "storybook-addon-next-router";
import { HStack, Button, Flex } from "@chakra-ui/react";
import { gql } from "@apollo/client";
import Bluebird from "bluebird";

import { get } from "lodash/fp";
import { chakraDecorator } from "../../../../utils/chakra-decorator";
import { client } from "../../../../connectors/apollo-client/schema-client";
import { getDatabase } from "../../../../connectors/database";

import { ImageNavigationTool } from "../image-navigation-tool";
import { apolloDecorator } from "../../../../utils/apollo-decorator";

const images = [
  {
    name: "Hello puffin 1",
    url: "https://images.unsplash.com/photo-1612564148954-59545876eaa0?auto=format&fit=crop&w=600&q=80",
  },
  {
    name: "Hello puffin 2",
    url: "https://images.unsplash.com/photo-1580629905303-faaa03202631?auto=format&fit=crop&w=600&q=80",
  },
  {
    name: "Hello puffin 3",
    url: "https://images.unsplash.com/photo-1490718720478-364a07a997cd?auto=format&fit=crop&w=600&q=80",
  },
];

export default {
  title: "web-app/Image Navigation Toolbar",
  component: ImageNavigationTool,
  loaders: [mockImagesLoader],
  decorators: [
    chakraDecorator,
    apolloDecorator,
    withIdInQueryStringRouterDecorator,
  ],
};

const Template: Story = () => (
  <HStack background="gray.100" padding={4} spacing={4}>
    <ImageNavigationTool />
    <Button variant="solid" background="white" color="gray.800">
      Button just to compare
    </Button>
    <Flex> </Flex>
  </HStack>
);

export const NoInput = Template.bind({});

export const NoImage = Template.bind({});
NoImage.parameters = {
  mockImages: { images: [] },
  withImageIdInQueryStringRouter: { id: "a" },
};

export const NoImageNoId = Template.bind({});
NoImageNoId.parameters = {
  mockImages: { images: [] },
};

export const OneImage = Template.bind({});
OneImage.parameters = {
  mockImages: { images: images.slice(0, 1) },
  withImageIdInQueryStringRouter: { getFromLoaded: get("images.0.id") },
};

export const OneWrongImage = Template.bind({});
OneWrongImage.parameters = {
  mockImages: { images: images.slice(1, 2) },
  withImageIdInQueryStringRouter: { id: "a" },
};

export const Basic1 = Template.bind({});
Basic1.parameters = {
  mockImages: { images },
  withImageIdInQueryStringRouter: { getFromLoaded: get("images.0.id") },
};

export const Basic2 = Template.bind({});
Basic2.parameters = {
  mockImages: { images },
  withImageIdInQueryStringRouter: { getFromLoaded: get("images.1.id") },
};

export const Basic3 = Template.bind({});
Basic3.parameters = {
  mockImages: { images },
  withImageIdInQueryStringRouter: { getFromLoaded: get("images.2.id") },
};

export const BasicWrongImage = Template.bind({});
BasicWrongImage.parameters = {
  mockImages: { images },
  withImageIdInQueryStringRouter: { id: "d" },
};

/* ----------- */
/*   Helpers   */
/* ----------- */

async function createDataset(name: string) {
  const mutationResult = await client.mutate({
    mutation: gql`
      mutation createDataset($name: String!) {
        createDataset(data: { name: $name }) {
          id
        }
      }
    `,
    variables: { name },
  });

  const {
    data: {
      createDataset: { id },
    },
  } = mutationResult;

  return id;
}

async function createImage(name: String, file: Blob, datasetId: string) {
  const mutationResult = await client.mutate({
    mutation: gql`
      mutation createImage($file: Upload!, $name: String!, $datasetId: ID!) {
        createImage(data: { name: $name, file: $file, datasetId: $datasetId }) {
          id
          name
          width
          height
          url
        }
      }
    `,
    variables: {
      file,
      name,
      datasetId,
    },
  });

  const {
    data: { createImage: image },
  } = mutationResult;

  return image;
}

async function mockImagesLoader({
  parameters,
}: {
  parameters: { mockImages?: { images?: { name: string; url: string }[] } };
}) {
  // first, clean the database and the apollo client
  await Promise.all(getDatabase().tables.map((table) => table.clear()));
  await client.clearStore();

  const imageArray = parameters?.mockImages?.images;

  // Because of race conditions we have to randomize the dataset name
  const datasetId = await createDataset(`storybook dataset ${Date.now()}`);

  if (imageArray == null) {
    return { images: [] };
  }

  // We use mapSeries to ensure images are created in the same order
  const loadedImages = await Bluebird.mapSeries(imageArray, ({ url, name }) =>
    fetch(url)
      .then((res) => res.blob())
      .then((blob) => createImage(name, blob, datasetId))
  );

  return { images: loadedImages, datasetId };
}

function withIdInQueryStringRouterDecorator(
  storyFn: Parameters<DecoratorFn>[0],
  context: Parameters<DecoratorFn>[1]
): ReturnType<DecoratorFn> {
  const imageId = context.parameters?.withImageIdInQueryStringRouter?.id;

  if (typeof imageId === "string") {
    return withNextRouter({
      query: { imageId, datasetId: context.loaded.datasetId },
    })(storyFn, context);
  }

  const getFromLoaded =
    context.parameters?.withImageIdInQueryStringRouter?.getFromLoaded;

  if (typeof getFromLoaded === "function") {
    return withNextRouter({
      query: {
        imageId: getFromLoaded(context.loaded),
        datasetId: context.loaded.datasetId,
      },
    })(storyFn, context);
  }

  return withNextRouter({ datasetId: context.loaded.datasetId })(
    storyFn,
    context
  );
}
