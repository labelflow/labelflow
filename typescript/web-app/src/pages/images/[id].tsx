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
import { useRouter } from "next/router";
import { RiArrowRightSLine } from "react-icons/ri";
import NextLink from "next/link";

import { Extent, getCenter } from "ol/extent";
import Projection from "ol/proj/Projection";

import { Map } from "@labelflow/react-openlayers-fiber";

import "ol/ol.css";

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

const imageQuery = gql`
  query image($id: ID!) {
    image(where: { id: $id }) {
      id
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
    image: Pick<Image, "id" | "url" | "name">;
  }>(imageQuery, { variables: { id } });

  const image = imageResult?.image;

  const [counter, setCounter] = useState(0);

  const extent: Extent = [0, 0, 1024, 968];
  const attributions = '© <a href="http://xkcd.com/license.html">xkcd</a>';
  const projection = new Projection({
    code: "xkcd-image",
    units: "pixels",
    extent,
  });

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
            <Text>{image?.name}</Text>
          </BreadcrumbItem>
        </Breadcrumb>
      }
    >
      {/* <ChakraImage src={image?.url} /> */}

      <Map>
        <olView
          initialCenter={getCenter(extent)}
          initialZoom={2}
          maxZoom={8}
          initialProjection={projection}
        />
        <olLayerImage>
          <olSourceImageStatic
            initialProjection={projection}
            initialUrl="https://imgs.xkcd.com/comics/online_communities.png"
            attributions={attributions}
            imageExtent={extent}
          />
        </olLayerImage>
      </Map>

      <HStack
        background="green"
        padding={4}
        spacing={4}
        position="absolute"
        bottom={0}
        left={0}
      >
        <ImageNav imageId={id} images={imagesResult?.images} router={router} />
      </HStack>
      <HStack
        background="yellow"
        padding={4}
        spacing={4}
        position="absolute"
        bottom={0}
        right={0}
      >
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
