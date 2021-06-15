import { useQuery } from "@apollo/client";
import gql from "graphql-tag";
import NextLink from "next/link";
import {
  VStack,
  Box,
  Image,
  Center,
  Spinner,
  Text,
  Breadcrumb,
  BreadcrumbItem,
  Wrap,
  WrapItem,
  Heading,
  Tooltip,
} from "@chakra-ui/react";
import { isEmpty } from "lodash/fp";
import { ImportButton } from "../../components/import-button";
import { RiArrowRightSLine } from "react-icons/ri";

import { Layout } from "../../components/layout";
import type { Image as ImageType } from "../../graphql-types.generated";

export const imagesQuery = gql`
  query getImages {
    images {
      id
      name
      url
    }
  }
`;

const ImagesPage = () => {
  const { data: imagesResult } =
    useQuery<{ images: Pick<ImageType, "id" | "url" | "name">[] }>(imagesQuery);

  return (
    <Layout
      topBarLeftContent={
        <Breadcrumb
          spacing="8px"
          separator={<RiArrowRightSLine color="gray.500" />}
        >
          <BreadcrumbItem>
            <Text>Images</Text>
          </BreadcrumbItem>
        </Breadcrumb>
      }
    >
      {!imagesResult && (
        <Center h="full">
          <Spinner size="xl" />
        </Center>
      )}
      {imagesResult && isEmpty(imagesResult?.images) && (
        <Center h="full">
          <Box as="section">
            <Box
              maxW="2xl"
              mx="auto"
              px={{ base: "6", lg: "8" }}
              py={{ base: "16", sm: "20" }}
              textAlign="center"
            >
              <Heading as="h2">You don&apos;t have any images.</Heading>
              <Text mt="4" fontSize="lg">
                Fortunately, it’s very easy to add some.
              </Text>

              <ImportButton
                colorScheme="brand"
                variant="solid"
                mt="8"
                showModal={false}
              />
            </Box>
          </Box>
        </Center>
      )}

      {imagesResult && !isEmpty(imagesResult?.images) && (
        <Wrap h="full" spacing={8} padding={8} justify="space-evenly">
          {imagesResult?.images?.map(({ id, name, url }) => (
            <NextLink href={`/images/${id}`} key={id}>
              {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
              <a>
                <WrapItem p={4} background="white" rounded={8}>
                  <VStack w="20rem" h="20rem" justify="space-between">
                    <Heading
                      as="h3"
                      size="sm"
                      overflow="hidden"
                      textOverflow="ellipsis"
                      whiteSpace="nowrap"
                      w="full"
                    >
                      {name}
                    </Heading>
                    <Image
                      background="gray.100"
                      alt={name}
                      src={url}
                      ignoreFallback
                      objectFit="contain"
                      h="18rem"
                      w="full"
                    />
                  </VStack>
                </WrapItem>
              </a>
            </NextLink>
          ))}
        </Wrap>
      )}
    </Layout>
  );
};

export default ImagesPage;
