import dynamic from "next/dynamic";
import { Box } from "@chakra-ui/react";

import { Layout } from "../components/layout";

const GraphiQL = dynamic(() => import("../components/graphiql"), {
  ssr: false,
  loading: ({ error }) => {
    if (error) throw error;
    return <div>loading</div>;
  },
});

const GraphqlPlayground = () => {
  return (
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
  );
};

export default GraphqlPlayground;
