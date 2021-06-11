import { useQuery } from "@apollo/client";
import gql from "graphql-tag";
import NextLink from "next/link";
import {
  VStack,
  Image,
  Center,
  Wrap,
  WrapItem,
  Heading,
} from "@chakra-ui/react";
import { isEmpty } from "lodash/fp";
import { ImportButton } from "../../components/import-button";
import { Layout } from "../../components/layout";
import type { Image as ImageType } from "../../graphql-types.generated";

const imagesQuery = gql`
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
    <Layout>
      {isEmpty(imagesResult?.images) && (
        <Center h="100%">
          <ImportButton />
        </Center>
      )}

      <Wrap h="100%" spacing={8} padding={8} justify="space-evenly">
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
    </Layout>
  );
};

export default ImagesPage;
