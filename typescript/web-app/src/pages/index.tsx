import { useEffect } from "react";
import { Spinner, Center } from "@chakra-ui/react";
import { gql, useQuery } from "@apollo/client";
import { useRouter } from "next/router";
import { Layout } from "../components/layout";

const IndexPage = () => {
  const router = useRouter();

  return (
    <Layout>
      <Center h="full">
        <Spinner size="xl" />
      </Center>
    </Layout>
  );
};

export default IndexPage;
