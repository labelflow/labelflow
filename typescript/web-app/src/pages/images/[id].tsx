import React, { useState } from "react";
import { useQuery } from "@apollo/client";
import {
  Button,
  HStack,
  Box,
  Text,
  Image as ChakraImage,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
} from "@chakra-ui/react";
import gql from "graphql-tag";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { RiArrowRightSLine } from "react-icons/ri";
import NextLink from "next/link";

import { Layout } from "../../components/layout";
import type { Image } from "../../types.generated";
import { ImageNav } from "../../components/image-navigation-tool-bar";

const Toto = dynamic<Pick<Image, "id" | "url" | "name">>(
  () => import("../../components/openlayers-map"),
  {
    ssr: false,
    loading: () => <div>loading</div>,
  }
);

const imagesQuery = gql`
  query {
    images {
      id
    }
  }
`;

const imageQuery = gql`
  query image($id: ID!) {
    image(where: { id: $id }) {
      id
      width
      height
      url
      name
    }
  }
`;

const ImagePage = () => {
  const router = useRouter();

  const { id }: { id?: string } = router.query;

  const { data: imagesResult } =
    useQuery<{ images: Pick<Image, "id">[] }>(imagesQuery);

  const { data: imageResult } = useQuery<{
    image: Pick<Image, "id" | "url" | "name" | "width" | "height">;
  }>(imageQuery, { variables: { id } });

  const image = imageResult?.image;

  const [counter, setCounter] = useState(0);

  return (
    <Layout
      topBarLeftContent={
        <Breadcrumb
          spacing="8px"
          separator={<RiArrowRightSLine color="gray.500" />}
        >
          <BreadcrumbItem>
            <NextLink href="/images">
              <BreadcrumbLink>Images</BreadcrumbLink>
            </NextLink>
          </BreadcrumbItem>

          <BreadcrumbItem isCurrentPage>
            <Text
              maxWidth="20rem"
              textOverflow="ellipsis"
              whiteSpace="nowrap"
              overflow="hidden"
            >
              {image?.name}
            </Text>
          </BreadcrumbItem>
        </Breadcrumb>
      }
    >
      <Toto image={image} />

      <HStack
        padding={4}
        spacing={4}
        position="absolute"
        bottom={0}
        left={0}
        pointerEvents="none"
      >
        <ImageNav imageId={id} images={imagesResult?.images} router={router} />
      </HStack>
      <HStack
        padding={4}
        spacing={4}
        position="absolute"
        bottom={0}
        right={0}
        pointerEvents="none"
      >
        <Box pointerEvents="initial">
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
