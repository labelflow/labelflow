import dynamic from "next/dynamic";
import { Box, Center, Spinner } from "@chakra-ui/react";
import { Meta } from "../components/meta";
import { Layout } from "../components/layout";

const GraphiQL = dynamic(() => import("../components/graphiql"), {
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

const GraphqlPlayground = () => {
  return (
    <>
      <Meta title="Labelflow | GraphiQL" />
      <Layout>
        <Box
          h="100%"
          w="100%"
          borderTop="solid 1px"
          borderColor="#d0d0d0"
          boxSizing="border-box"
        >
          <GraphiQL />
        </Box>
      </Layout>
    </>
  );
};

export default GraphqlPlayground;
