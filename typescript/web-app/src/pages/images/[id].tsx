import { useEffect } from "react";
import { useQuery } from "@apollo/client";
import {
  Text,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Center,
  Spinner,
  Box,
  Flex,
} from "@chakra-ui/react";
import gql from "graphql-tag";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { RiArrowRightSLine } from "react-icons/ri";
import NextLink from "next/link";

import { Layout } from "../../components/layout";
import type { Image } from "../../graphql-types.generated";
import { Gallery } from "../../components/gallery";

// The dynamic import is needed because openlayers use web apis that are not available
// in NodeJS, like `Blob`, so it crashes when rendering in NextJS server side.
// And anyway, it would not make sense to render canvas server side, it would just be a loss.
const LabellingTool = dynamic(() => import("../../components/labelling-tool"), {
  ssr: false,
  loading: ({ error }) => {
    if (error) throw error;
    return (
      <Center h="full">
        <Spinner size="xl" />
      </Center>
    );
  },
});

const imageQuery = gql`
  query image($id: ID!) {
    image(where: { id: $id }) {
      id
      name
    }
  }
`;

type ImageQueryResponse = {
  image: Pick<Image, "id" | "name">;
};

const ImagePage = () => {
  const router = useRouter();
  const id = router?.query?.id;

  const { data: imageResult, error } = useQuery<ImageQueryResponse>(
    imageQuery,
    {
      variables: { id },
      skip: typeof id !== "string",
    }
  );

  const imageName = imageResult?.image.name;

  useEffect(() => {
    if (error) {
      router.replace({ pathname: "/images", query: router.query });
    }
  }, [error]);

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
              {imageName}
            </Text>
          </BreadcrumbItem>
        </Breadcrumb>
      }
    >
      <Flex height="100%" flexDirection="column">
        <Box flex="1">
          <LabellingTool />
        </Box>

        <Box bg="white" overflow="hidden">
          <Gallery />
        </Box>
      </Flex>
    </Layout>
  );
};

export default ImagePage;
