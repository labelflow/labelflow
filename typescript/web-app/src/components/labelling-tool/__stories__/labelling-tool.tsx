/* eslint-disable @typescript-eslint/no-use-before-define */
import { useEffect, useMemo, useState } from "react";
import gql from "graphql-tag";
import { DecoratorFn, Story } from "@storybook/react";
import { NextRouter, createRouter } from "next/router";
import { RouterContext } from "next/dist/next-server/lib/router-context";
import { Box } from "@chakra-ui/react";
import { withNextRouter } from "storybook-addon-next-router";

import { client } from "../../../connectors/apollo-client";
import { chakraDecorator } from "../../../utils/chakra-decorator";
import { apolloDecorator } from "../../../utils/apollo-decorator";

import { LabellingTool } from "../labelling-tool";
import { Image } from "../../../graphql-types.generated";
import { db } from "../../../connectors/database";

export default {
  title: "web-app/Labelling Tool",
  component: LabellingTool,
  decorators: [chakraDecorator, apolloDecorator, inGreyBoxDecorator],
};

export const OneImage: Story = () => {
  return <LabellingTool />;
};

OneImage.decorators = [
  (storyFn, context) =>
    withNextRouter({
      query: { id: context.images[0].id },
    })(storyFn, context),
  mockImagesDecorator([
    {
      name: "Hello puffin 1",
      url: "https://images.unsplash.com/photo-1612564148954-59545876eaa0?auto=format&fit=crop&w=600&q=80",
    },
  ]),
];

export const ThreeImages: Story = () => {
  return <LabellingTool />;
};

ThreeImages.decorators = [
  (storyFn, context) =>
    withNextRouter({
      query: { id: context.images[0].id },
    })(storyFn, context),
  mockImagesDecorator([
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
  ]),
];

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

function mockImagesDecorator(imageArray: { name: string; url: string }[]) {
  return function decorator(
    StoryComponent: Parameters<DecoratorFn>[0],
    StoryContext: Parameters<DecoratorFn>[1]
  ): ReturnType<DecoratorFn> {
    const [images, setImages] = useState<Array<Image>>();

    useEffect(() => {
      Promise.all(
        imageArray.map(({ url, name }) =>
          fetch(url)
            .then((res) => res.blob())
            .then((blob) => createImage(name, blob))
        )
      ).then(setImages);

      return () => {
        db.tables.map((table) => table.clear());
      };
    }, []);

    return images ? (
      <StoryComponent {...StoryContext} images={images} />
    ) : (
      <div>Loading mocked images into storybook...</div>
    );
  };
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
