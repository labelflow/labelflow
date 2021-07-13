import { useEffect } from "react";
import { Spinner, Center } from "@chakra-ui/react";
import { useQuery, gql } from "@apollo/client";

import { useRouter } from "next/router";
import type { Image as ImageType } from "../graphql-types.generated";
import { Layout } from "../components/layout";

export const firstImageQuery = gql`
  query getFirstImage {
    images(first: 1) {
      id
    }
  }
`;

const IndexPage = () => {
  const router = useRouter();
  const { data: firstImageResult, error } =
    useQuery<{ images: Pick<ImageType, "id">[] }>(firstImageQuery);

  useEffect(() => {
    if (firstImageResult && !error) {
      router.replace({ pathname: "/images", query: router.query });
    }
  }, [firstImageResult, error]);

  return (
    <Layout>
      <Center h="full">
        <Spinner size="xl" />
      </Center>
    </Layout>
  );
};

export default IndexPage;
