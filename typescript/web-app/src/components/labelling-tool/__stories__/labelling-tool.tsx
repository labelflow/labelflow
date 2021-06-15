/* eslint-disable @typescript-eslint/no-use-before-define */

import gql from "graphql-tag";
import { DecoratorFn, Story } from "@storybook/react";
import { Box } from "@chakra-ui/react";
import { withNextRouter } from "storybook-addon-next-router";
import Bluebird from "bluebird";

import { client } from "../../../connectors/apollo-client-schema";
import { chakraDecorator } from "../../../utils/chakra-decorator";
import { queryParamsDecorator } from "../../../utils/query-params-decorator";
import { apolloDecorator } from "../../../utils/apollo-decorator";
import { db } from "../../../connectors/database";

import { LabellingTool } from "../labelling-tool";

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
  title: "web-app/Labelling Tool",
  component: LabellingTool,
  loaders: [mockImagesLoader],
  decorators: [
    inGreyBoxDecorator,
    queryParamsDecorator,
    chakraDecorator,
    apolloDecorator,
    withImageIdInQueryStringRouterDecorator,
  ],
};

export const OneImage: Story = () => {
  return <LabellingTool />;
};
OneImage.parameters = { mockImages: { images: images.slice(0, 1) } };

export const ThreeImages: Story = () => {
  return <LabellingTool />;
};
ThreeImages.parameters = { mockImages: { images } };

/* ----------- */
/*   Helpers   */
/* ----------- */

async function createImage(name: String, file: Blob) {
  const mutationResult = await client.mutate({
    mutation: gql`
      mutation createImage($file: Upload!, $name: String!) {
        createImage(data: { name: $name, file: $file }) {
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
  await Promise.all(db.tables.map((table) => table.clear()));
  await client.clearStore();

  const imageArray = parameters?.mockImages?.images;

  if (imageArray == null) {
    return { images: [] };
  }

  // We use mapSeries to ensure images are created in the same order
  const loadedImages = await Bluebird.mapSeries(imageArray, ({ url, name }) =>
    fetch(url)
      .then((res) => res.blob())
      .then((blob) => createImage(name, blob))
  );

  return { images: loadedImages };
}

function withImageIdInQueryStringRouterDecorator(
  storyFn: Parameters<DecoratorFn>[0],
  context: Parameters<DecoratorFn>[1]
): ReturnType<DecoratorFn> {
  // hardcoded to take the first loaded image Id
  // and store it in the query parameters
  // If needed this could be adjusted with
  // Story.parameters
  return withNextRouter({
    query: { id: context.loaded.images[0].id },
  })(storyFn, context);
}

function inGreyBoxDecorator(
  storyFn: Parameters<DecoratorFn>[0]
): ReturnType<DecoratorFn> {
  return (
    <Box background="gray.100" width="640px" height="480px">
      {storyFn()}
    </Box>
  );
}
