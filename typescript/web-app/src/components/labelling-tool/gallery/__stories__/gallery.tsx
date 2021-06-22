/* eslint-disable @typescript-eslint/no-use-before-define */
import { HStack } from "@chakra-ui/react";
import { get } from "lodash/fp";
import { Story, DecoratorFn } from "@storybook/react";
import { withNextRouter } from "storybook-addon-next-router";
import gql from "graphql-tag";
import Bluebird from "bluebird";

import { client } from "../../../../connectors/apollo-client-schema";
import { chakraDecorator } from "../../../../utils/chakra-decorator";
import { apolloDecorator } from "../../../../utils/apollo-decorator";
import { db } from "../../../../connectors/database";

import { Gallery } from "../gallery";

const images = [
  "https://images.unsplash.com/photo-1579513141590-c597876aefbc?auto=format&fit=crop&w=882&q=80",
  "https://images.unsplash.com/photo-1504710685809-7bb702595f8f?auto=format&fit=crop&w=934&q=80",
  "https://images.unsplash.com/photo-1569579933032-9e16447c50e3?auto=format&fit=crop&w=2100&q=80",
  "https://images.unsplash.com/photo-1595687453172-253f44ed3975?auto=format&fit=crop&w=2100&q=80",
  "https://images.unsplash.com/photo-1574082595167-86d59cefcc3a?auto=format&fit=crop&w=2100&q=80",
  "https://images.unsplash.com/photo-1504618223053-559bdef9dd5a?auto=format&fit=crop&w=2100&q=80",
  "https://images.unsplash.com/photo-1490718720478-364a07a997cd?auto=format&fit=crop&w=933&q=80",
  "https://images.unsplash.com/photo-1557054068-bf70b5f32470?auto=format&fit=crop&w=2098&q=80",
  "https://images.unsplash.com/photo-1580629905303-faaa03202631?auto=format&fit=crop&w=1001&q=80",
  "https://images.unsplash.com/photo-1562519990-50eb51e282b2?auto=format&fit=crop&w=2089&q=80",
  "https://images.unsplash.com/photo-1565085360602-de694f1d7650?auto=format&fit=crop&w=2100&q=80",
  "https://images.unsplash.com/photo-1594389615321-4f50c5d7878c?auto=format&fit=crop&w=2100&q=80",
  "https://images.unsplash.com/photo-1548613053-22087dd8edb8?auto=format&fit=crop&w=975&q=80",
  "https://images.unsplash.com/photo-1567672935596-057a100fcced?auto=format&fit=crop&w=933&q=80",
  "https://images.unsplash.com/photo-1540380403593-2f4cbbc006dd?auto=format&fit=crop&w=934&q=80",
];

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
