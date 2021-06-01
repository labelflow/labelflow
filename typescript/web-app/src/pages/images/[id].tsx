import { useState } from "react";
import { useQuery } from "@apollo/client";
import {
  Button,
  HStack,
  Box,
  Text,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
} from "@chakra-ui/react";
import gql from "graphql-tag";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { RiArrowRightSLine } from "react-icons/ri";
import NextLink from "next/link";

import { DrawingToolbar } from "../../components/drawing-tool-bar";
import { Layout } from "../../components/layout";
import type { Image } from "../../types.generated";
import { ImageNavigationToolbar } from "../../components/image-navigation-tool-bar";

const OpenlayersMap = dynamic(() => import("../../components/openlayers-map"), {
  ssr: false,
  loading: () => <div>loading</div>,
});

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
      <OpenlayersMap image={image} />

      <DrawingToolbar />

      <ImageNavigationToolbar
        imageId={id}
        images={imagesResult?.images}
        router={router}
      />
    </Layout>
  );
};

export default ImagePage;
