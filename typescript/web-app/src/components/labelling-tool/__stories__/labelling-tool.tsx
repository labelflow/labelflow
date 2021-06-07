/* eslint-disable @typescript-eslint/no-use-before-define */
import { useEffect, useState } from "react";
import gql from "graphql-tag";
import { DecoratorFn, Story } from "@storybook/react";
import { NextRouter } from "next/router";
import { Box } from "@chakra-ui/react";

import { client } from "../../../connectors/apollo-client";
import { chakraDecorator } from "../../../utils/chakra-decorator";
import { apolloDecorator } from "../../../utils/apollo-decorator";

import { LabellingTool } from "../labelling-tool";
import { Image } from "../../../graphql-types.generated";

export default {
  title: "web-app/Labelling Tool",
  component: LabellingTool,
  decorators: [
    chakraDecorator,
    apolloDecorator,
    mockImagesDecorator,
    inGreyBoxDecorator,
  ],
};

const fakeRouter = {
  push: (x: string) => console.log(`Navigate to ${x}`),
} as unknown as NextRouter;

export const OneImage: Story = (_, { images }) => {
  return (
    <LabellingTool
      images={images.slice(0, 1)}
      image={images[0]}
      router={fakeRouter}
    />
  );
};

export const ThreeImages: Story = (_, { images }) => {
  return (
    <LabellingTool images={images} image={images[0]} router={fakeRouter} />
  );
};

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

function mockImagesDecorator(
  StoryComponent: Parameters<DecoratorFn>[0],
  StoryContext: Parameters<DecoratorFn>[1]
): ReturnType<DecoratorFn> {
  const [images, setImages] = useState<Array<Image>>();

  useEffect(() => {
    Promise.all(
      [
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
      ].map(({ url, name }) =>
        fetch(url)
          .then((res) => res.blob())
          .then((blob) => createImage(name, blob))
      )
    ).then(setImages);
  }, []);

  return images ? (
    <StoryComponent {...StoryContext} images={images} />
  ) : (
    <div>Loading mocked images into storybook...</div>
  );
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
