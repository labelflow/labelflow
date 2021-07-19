/* eslint-disable @typescript-eslint/no-use-before-define */
import { HStack } from "@chakra-ui/react";
import { Story, DecoratorFn } from "@storybook/react";
import { withNextRouter } from "storybook-addon-next-router";
import { gql } from "@apollo/client";
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
    withIdsInQueryStringRouterDecorator,
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
};

/* ----------- */
/*   Helpers   */
/* ----------- */

async function createProject(name: string) {
  const mutationResult = await client.mutate({
    mutation: gql`
      mutation createProject($name: String!) {
        createProject(data: { name: $name }) {
          id
        }
      }
    `,
    variables: { name },
  });
  const {
    data: {
      createProject: { id },
    },
  } = mutationResult;

  return id;
}

async function createImage(url: string, projectId: string) {
  const mutationResult = await client.mutate({
    mutation: gql`
      mutation createImage($url: String!, $projectId: ID!) {
        createImage(data: { url: $url, projectId: $projectId }) {
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
      projectId,
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
  parameters: { mockImages?: { images?: string[] }; mockProjectId?: string };
}) {
  // first, clean the database and the apollo client
  await Promise.all(db.tables.map((table) => table.clear()));
  await client.clearStore();

  const imageArray = parameters?.mockImages?.images;

  // Because of race conditions we have to randomize the project name
  const projectId = await createProject(`storybook project ${Date.now()}`);

  if (imageArray == null || projectId == null) {
    return { images: [] };
  }

  // We use mapSeries to ensure images are created in the same order
  const loadedImages = await Bluebird.mapSeries(imageArray, (url) =>
    createImage(url, projectId)
  );

  return { projectId, images: loadedImages };
}

function withIdsInQueryStringRouterDecorator(
  storyFn: Parameters<DecoratorFn>[0],
  context: Parameters<DecoratorFn>[1]
): ReturnType<DecoratorFn> {
  return withNextRouter({
    query: {
      imageId: context.loaded.images[0].id,
      projectId: context.loaded.projectId,
    },
  })(storyFn, context);
}
