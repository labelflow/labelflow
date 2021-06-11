import { ChakraProvider, Heading, Text } from "@chakra-ui/react";
import { Layout } from "../components/layout";
import { theme } from "../theme";

const OfflinePage = () => {
  return (
    <ChakraProvider theme={theme} resetCSS>
      <Layout>
        <Heading>Offline</Heading>
        <Text>You are offline</Text>
      </Layout>
    </ChakraProvider>
  );
};

export default OfflinePage;
