import { useEffect, useState } from "react";
import gql from "graphql-tag";
import { addDecorator, Story } from "@storybook/react";
import { NextRouter } from "next/router";
import { Box } from "@chakra-ui/react";

import { client } from "../../../connectors/apollo-client";
import { chakraDecorator } from "../../../utils/chakra-decorator";
import { apolloDecorator } from "../../../utils/apollo-decorator";

import { LabellingTool, Props } from "../labelling-tool";

addDecorator(chakraDecorator);
addDecorator(apolloDecorator);

export default {
  title: "web-app/Labelling Tool",
  component: LabellingTool,
};

const createImage = async (name: String, file: Blob) => {
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
};

addDecorator((StoryComponent) => {
  const [image, setImage] = useState();
  useEffect(() => {
    fetch(
      "https://images.unsplash.com/photo-1612564148954-59545876eaa0?auto=format&fit=crop&w=600&q=80"
    )
      .then((res) => res.blob())
      .then((blob) => createImage("Hello puffin", blob))
      .then(setImage);
  }, []);
  return image ? (
    <StoryComponent image={image} images={[{ id: image.id }]} />
  ) : null;
});

const Template: Story<Props> = (args: Props, context) => (
  <Box background="gray.100" width="640px" height="480px">
    <LabellingTool {...context} {...args} />
  </Box>
);

const router = {
  push: (x: string) => console.log(`Navigate to ${x}`),
} as unknown as NextRouter;

export const OneImage = Template.bind({});
OneImage.args = {
  router,
};

export const ThreeImages = Template.bind({});
ThreeImages.args = {
  images: [{ id: "titi" }, { id: "toto" }, { id: "tata" }],
  router,
};
