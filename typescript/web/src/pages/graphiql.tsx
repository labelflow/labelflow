import dynamic from "next/dynamic";
import {
  Box,
  Breadcrumb,
  BreadcrumbItem,
  Center,
  Spinner,
  Text,
} from "@chakra-ui/react";

import { RiArrowRightSLine } from "react-icons/ri";
import { Meta } from "../components/meta";
import { Layout } from "../components/layout";
import { AppLifecycleManager } from "../components/app-lifecycle-manager";

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
      <AppLifecycleManager />
      <Meta title="LabelFlow | GraphiQL" />
      <Layout
        topBarLeftContent={
          <Breadcrumb
            spacing="8px"
            separator={<RiArrowRightSLine color="gray.500" />}
          >
            <BreadcrumbItem>
              <Text>Graphiql</Text>
            </BreadcrumbItem>
          </Breadcrumb>
        }
      >
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
