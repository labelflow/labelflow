import { Box, Heading, Link, Text, Flex } from "@chakra-ui/react";
import { NavBar } from "../components/website/Navbar/NavBar";
import { Footer } from "../components/website/Footer/Footer";
import { Meta } from "../components/meta";
import { CookieBanner } from "../components/cookie-banner";
import { KpiDashboard } from "../components/metabase";

export default function Open() {
  return (
    <>
      <Meta title="LabelFlow | Open" />
      <CookieBanner />
      <Flex direction="column">
        <NavBar />
        <Box as="section" py={{ base: "10", sm: "24" }}>
          <Box
            maxW={{ base: "xl", md: "3xl" }}
            mx="auto"
            px={{ base: "6", md: "8" }}
            className="markdown-body"
            boxSizing="border-box"
          >
            <Heading
              align="center"
              fontWeight="extrabold"
              maxW="lg"
              mx="auto"
              mb="20"
            >
              Our KPIs are public
            </Heading>
            <Text textAlign="justify">
              LabelFlow.ai is an Open Startup, which means it operates fully
              transparent sharing its core metrics. Here are some first metrics
              made public (tracked with{" "}
              <Link
                href="https://www.metabase.com/"
                isExternal
                color="brand.600"
              >
                Metabase
              </Link>{" "}
              connected to our database). These metrics come from our
              collaborative version launched early January 2022. In the next
              weeks we plan to add additional information. If you want to dive
              deeper into our open startup approach,{" "}
              <Link
                href="https://labelflow.ai/posts/labelflow-becomes-an-open-startup"
                isExternal
                color="brand.600"
              >
                you can have a look to this post
              </Link>
              .
            </Text>
          </Box>
        </Box>
        <KpiDashboard />
        <Footer />
      </Flex>
    </>
  );
}
