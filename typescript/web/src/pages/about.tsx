import {
  Box,
  Center,
  Heading,
  Link,
  ListItem,
  Text,
  UnorderedList,
} from "@chakra-ui/react";
import * as React from "react";
import { CookieBanner } from "../components/cookie-banner";
import { Meta } from "../components/meta";
import { Footer } from "../components/website/Footer/Footer";
import { getImageUrl } from "../components/website/get-image-url";
import { NavBar } from "../components/website/Navbar/NavBar";
import { APP_GITHUB_URL } from "../constants";

export default function About() {
  return (
    <>
      <Meta title="LabelFlow | About" />
      <CookieBanner />
      <Box minH="640px">
        <NavBar />
        <Box as="section" py={{ base: "10", sm: "24" }}>
          <Box
            maxW={{ base: "xl", md: "3xl" }}
            mx="auto"
            px={{ base: "6", md: "8" }}
            className="markdown-body"
            boxSizing="border-box"
          >
            <Text textAlign="justify">
              <Heading
                align="center"
                fontWeight="extrabold"
                maxW="xl"
                mx="auto"
                mb="10"
              >
                Why LabelFlow?
              </Heading>
              We believe in a world where data solves real and impactful
              problems. The
              <Text as="b">
                <Link color="brand.500" href="https://labelflow.ai/website">
                  {" "}
                  LabelFlow{" "}
                </Link>
              </Text>
              team is building a product to support data people to create high
              volume and quality datasets to create the next big thing with
              artificial intelligence (AI)
              <br />
              <br />
              <Center>
                <img src={getImageUrl("team.jpg")} alt="team" />
              </Center>
              <br />
              <i>
                Launch team, from left to right: Jordan le Lay, Geoffrey
                Vancassel, Nicolas Draber, Valérian Gaudeau, Baptist Benoist{" "}
              </i>
              <br />
              <br />
              Here is our <b>3 points thesis that drives LabelFlow </b>
              development.
              <br />
              <Heading
                align="center"
                fontWeight="extrabold"
                maxW="xl"
                mx="auto"
                my="10"
              >
                #1 Data is more central than the machine learning model
              </Heading>
              <Center>
                <img src={getImageUrl("tuning-model.jpg")} alt="team" />
              </Center>
              <br />
              There’s been a shift recently in the machine learning community:
              qualifying data and the pipelines to improve the performance of
              the AI has become more central than the machine learning
              algorithms themselves. Since the field has reached a certain level
              of maturity, the lack of high-quality training datasets is holding
              the industry back. Improving the quality of training datasets is
              now the absolute key to improving computer vision capabilities
              <Heading
                align="center"
                fontWeight="extrabold"
                maxW="xl"
                mx="auto"
                my="10"
              >
                #2 Battle on digital personal data is lost, what remains is real
                life (impactful-type) data
              </Heading>
              <Center>
                <img src={getImageUrl("data-locked.jpg")} alt="team" />
              </Center>
              <br />
              Across seven of its products, Google has more than 1 billion
              unique users: Gmail, Chrome, Maps, Search, Youtube, Google Play
              and Android (more than 2 billion platforms equipped). On Facebook,
              there are 3 products that exceed this billion users: Facebook,
              Whatsapp and Messenger. This obviously creates huge amount of
              qualified data easily accessible.
              <br />
              <br />
              When it comes to real-life type of data, there’s a ton of
              impactful use cases where AI might help but which are still still
              under-developed since 2012:
              <UnorderedList paddingStart="5">
                <ListItem>curing cancer</ListItem>
                <ListItem>detecting whales to preserve them</ListItem>
                <ListItem>
                  identifying vegetation encroachment to avoid wildfires like in
                  California
                </ListItem>
                <ListItem>and more recently control a fusion reactor</ListItem>
              </UnorderedList>
              <br /> There is an untapped business potential to develop AIs with
              net positive impacts. It is “nice” to be suggested a trendy sofa
              on Facebook after searching “sofa” in Google but what about curing
              breast cancer with AI?
              <Heading
                align="center"
                fontWeight="extrabold"
                maxW="xl"
                mx="auto"
                my="10"
              >
                #3 AI is just a tool. Collaboration is the new word for
                competition
              </Heading>
              <Center>
                <img src={getImageUrl("collaboration.jpg")} alt="team" />
              </Center>
              <br />
              Since 2012 and the increase in speed of GPUs to train
              convolutional neural networks “without” the layer-by-layer
              pre-training, deep learning finally scratched the surface of real
              world use cases. For a few years the usual pattern has been:
              <br />
              <UnorderedList paddingStart="5">
                <ListItem>
                  {" "}
                  <Text as="b">Data is hard to collect</Text> (coming from
                  aircraft, helicopter, satellite, X-Ray machines, IR sensors,
                  industrial plants, etc.) Data is very heterogeneous (different
                  zoom levels, sharpness, lightning, poor distribution of
                  occurrences, etc.) because no one previously thought about
                  algorithms to process it{" "}
                </ListItem>
                <ListItem>
                  <Text as="b">Data is poorly labeled</Text> because it is long,
                  costly and boring{" "}
                </ListItem>
                <ListItem>
                  <Text as="b">Data is mostly locked</Text> by large enterprises
                  and reserved to its internal AI teams
                </ListItem>
                <ListItem>
                  <Text as="b">Output expectations are high</Text> because AI is
                  trendy and sold like “magic”
                </ListItem>
              </UnorderedList>
              <br />
              While leading to massive disappointments, this period 2012-2020
              has also educated organizations to the potential of AI and the
              benefits of collecting, organizing and qualifying data.
              Nonetheless, massive funding and tech newcomers in the space won’t
              easily generate what fuels machine learning models: qualified
              data.
              <br />
              <br />
              We truly believe that collaboration is the new word for
              competition. AI is just a tiny piece of most value chains. Even if
              counter intuitive, many players (even competing!) would benefit
              from sharing their small datasets of a few thousands labeled
              images in some joint initiatives to reach critical size datasets
              to bring AI at scale.
              <br />
              <br />
              Here is one{" "}
              <Link
                color="brand.600"
                href="https://ieee-dataport.org/open-access/drone-based-distribution-inspection-imager"
                isExternal
              >
                {" "}
                great initiative from EPRI{" "}
              </Link>{" "}
              in the US sharing 30,000 images from 5+ utility companies to drive
              AI at scale. Another great example{" "}
              <Link
                color="brand.600"
                href="https://opendata.edp.com/pages/homepage/"
                isExternal
              >
                {" "}
                with EDP
              </Link>
              , the Portuguese utility company sharing data from their energy
              assets. <br />
              <br />
              It is great if you can automatically detect defects on an
              electrical distribution pole with drone-based images but there are
              so many other parts that make a solution valuable when it comes to
              data: collection, visualization, organization, reporting,
              connecting with third parties, etc. AI is just a tool. To
              kickstart things in the right direction, we have made our codebase
              open (see{" "}
              <Link color="brand.600" href={APP_GITHUB_URL} isExternal>
                GitHub repository
              </Link>
              ) and our{" "}
              <Link color="brand.600" href="/open">
                {" "}
                performance indicators{" "}
              </Link>{" "}
              public.
            </Text>
          </Box>
        </Box>
        <Footer />
      </Box>
    </>
  );
}
