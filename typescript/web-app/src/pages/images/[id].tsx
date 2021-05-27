import React, { useState } from "react";
import { useQuery } from "@apollo/client";
import { Button, HStack, Box } from "@chakra-ui/react";
import gql from "graphql-tag";
import { useRouter } from "next/router";
import { Layout } from "../../components/layout";
import type { Image } from "../../types.generated";
import { ImageNav } from "../../components/image-navigation-tool-bar";

const imagesQuery = gql`
  query {
    images {
      id
    }
  }
`;

const ImagePage = () => {
  const router = useRouter();

  const { id }: { id?: string } = router.query;

  const { data: imagesResult } =
    useQuery<{ images: Pick<Image, "id">[] }>(imagesQuery);

  const [counter, setCounter] = useState(0);

  return (
    <Layout>
      <HStack background="green" p={10}>
        <ImageNav imageId={id} images={imagesResult?.images} router={router} />
        <Box>
          <Button colorScheme="blue" onClick={() => setCounter(counter + 1)}>
            Done, and look at this state that persists when you change page:
            {counter}
          </Button>
        </Box>
      </HStack>
    </Layout>
  );
};

export default ImagePage;
