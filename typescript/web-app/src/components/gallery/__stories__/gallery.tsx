/* eslint-disable @typescript-eslint/no-use-before-define */
import { HStack } from "@chakra-ui/react";
import { get } from "lodash/fp";
import { Story, DecoratorFn } from "@storybook/react";
import { withNextRouter } from "storybook-addon-next-router";
import gql from "graphql-tag";
import Bluebird from "bluebird";

import { client } from "../../../connectors/apollo-client-schema";
import { chakraDecorator } from "../../../utils/chakra-decorator";
import { apolloDecorator } from "../../../utils/apollo-decorator";
import { db } from "../../../connectors/database";

import { Gallery } from "../gallery";

import imageSampleCollection from "../../../utils/image-sample-collection";

const images = imageSampleCollection.slice(0, 15);

export default {
  title: "web-app/Gallery",
  component: Gallery,
  loaders: [mockImagesLoader],
  decorators: [
    chakraDecorator,
    apolloDecorator,
    withIdInQueryStringRouterDecorator,
  ],
};

const Template: Story = () => (
  <HStack background="gray.100" padding={4} spacing={4}>
    <Gallery />
  </HStack>
);

export const Images = Template.bind({});
Images.parameters = {
  mockImages: { images },
  withImageIdInQueryStringRouter: { getFromLoaded: get("images.0.id") },
};

/* ----------- */
/*   Helpers   */
/* ----------- */

async function createImage(url: string) {
  const mutationResult = await client.mutate({
    mutation: gql`
      mutation createImage($url: String!) {
        createImage(data: { url: $url }) {
          id
          name
          width
          height
          url
        }
      }
    `,
    variables: {
      url,
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
  parameters: { mockImages?: { images?: string[] } };
}) {
  // first, clean the database and the apollo client
  await Promise.all(db.tables.map((table) => table.clear()));
  await client.clearStore();

  const imageArray = parameters?.mockImages?.images;

  if (imageArray == null) {
    return { images: [] };
  }

  // We use mapSeries to ensure images are created in the same order
  const loadedImages = await Bluebird.mapSeries(imageArray, (url) =>
    createImage(url)
  );

  return { images: loadedImages };
}

function withIdInQueryStringRouterDecorator(
  storyFn: Parameters<DecoratorFn>[0],
  context: Parameters<DecoratorFn>[1]
): ReturnType<DecoratorFn> {
  const id = context.parameters?.withImageIdInQueryStringRouter?.id;

  if (typeof id === "string") {
    return withNextRouter({
      query: { id },
    })(storyFn, context);
  }

  const getFromLoaded =
    context.parameters?.withImageIdInQueryStringRouter?.getFromLoaded;

  if (typeof getFromLoaded === "function") {
    return withNextRouter({
      query: { id: getFromLoaded(context.loaded) },
    })(storyFn, context);
  }

  return withNextRouter({})(storyFn, context);
}
