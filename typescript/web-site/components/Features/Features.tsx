import {
  Box,
  SimpleGrid,
  Heading,
  Text,
  useColorModeValue as mode,
} from "@chakra-ui/react";
import * as React from "react";
import {
  FcFlashOn,
  FcKey,
  FcPositiveDynamic,
  FcGraduationCap,
  FcLike,
  FcFlowChart,
} from "react-icons/fc";
import { Feature } from "./Feature";

export const Features = () => (
  <Box as="section" py="48" bg={mode("gray.50", "gray.800")}>
    <Box
      maxW="5xl"
      mx="auto"
      // py="48"
      px={{ base: "6", md: "8" }}
    >
      <Heading
        align="center"
        textAlign="center"
        maxW="lg"
        mx="auto"
        letterSpacing="tight"
        fontWeight="extrabold"
      >
        The fastest labeling interface on the internet
      </Heading>
      <Text align="center" textAlign="center" maxW="lg" mx="auto" mt="12">
        No cruft, no time lost, only fun. We focus on performance and user
        experience to ensure that your{" "}
        <strong>time is spent working on your data</strong>, not waiting for
        stuff to load.
      </Text>

      <SimpleGrid
        mt="24"
        columns={{ base: 1, md: 2 }}
        spacingX="10"
        spacingY={{ base: "8", md: "14" }}
      >
        <Feature title="Productive" icon={<FcPositiveDynamic />}>
          Labelflow is designed for optimum productivity. Keyboard shortcuts,
          interface layout, collaborative workflows, everything is designed with
          users, for users.
        </Feature>
        <Feature title="Blazing fast" icon={<FcFlashOn />}>
          You can&apos;t be productive with a slow tool. This is why Labelflow
          has been built with performance in mind from the beginning. The
          interface is fast and you can see it.
        </Feature>
        <Feature title="Collaborative precision" icon={<FcGraduationCap />}>
          Labelflow brings your dataset quality to new levels, thanks to
          collaborative quality check workflows, data exploration tools, and
          bringing your AI in the loop to identify potential issues and help
          curate your datasets.
          {/* Powerful data exploration Streamlined collaboration and quality
          management Curate a dataset of your project’s images and review the
          quality of your annotations to create top-performing training models.
          Find and correct errors in your ground truth data with Labelflow's
          manual and AI-powered Error Finder features. Hasty's Error Finder
          takes you to the most likely issues in your training data, eliminating
          the hours needed to color match annotations or search for artifacts. */}
        </Feature>
        <Feature title="Easy workflow management" icon={<FcFlowChart />}>
          With easy-to-use workflow management tools and insightful data
          dashboards to help you manage your data pipeline and your teams,
          Labelflow ensures you always have a clear and simple view of your data
          and processes.
          {/* No-code automation Seamless pipeline integration. Work smarter, not
          harder. Integrate your computer vision pipeline using Python SDKs to
          streamline and automate your data, user, and project management tasks.
          You can also import images by linking them from external storages. The
          linked images are displayed in SuperAnnotate, but they are not stored
          on our local servers. */}
        </Feature>
        <Feature title="Open community and standard" icon={<FcLike />}>
          Our mission is to generalize standard good practices around visual
          data management. Dataset curation should not require any &quot;secret
          sauce&quot;. Labelflow is building a community around an open source
          labeling tool to set the standard.
        </Feature>
        <Feature title="Own your data and algorithms" icon={<FcKey />}>
          Labelflow does not try to own your data or algorithms, but integrates
          with them seamlessly. No duplicate source of truth and complicated
          scripts to synchronize your data between various tools. Your database
          is the source of truth for Labelflow.
        </Feature>

        {/* <Feature title="Built by the ecosystem" icon={<FcGlobe />}>
        LabelFlow generates code using leading open source tools. No esoteric
        framework or any dodgy library that will make developers pull their
        hair. It's just basic industry good practices.
      </Feature>
      <Feature title="Fun" icon={<FcLike />}>
        Building a SaaS business should be fun. LabelFlow makes it easy and
        simple. No nonsense point and click, no absurdly complex code, just fun!
        Your future developers will appreciate.
      </Feature>
      <Feature title="Secured by experts" icon={<FcKey />}>
        Ensuring your SaaS is secure can be incredibly difficult. LabelFlow
        provides you with a platform built on modern best practices, and is
        constantly updated to ensure your platform stays safe.
      </Feature>
      <Feature title="Simple" icon={<FcGraduationCap />}>
        Simplicity is the key to iterate fast on your business idea. LabelFlow
        provides you with a codebase which is as simple as it can get, while
        providing with all the features you need.
      </Feature>
      <Feature title="Owned by you" icon={<FcFolder />}>
        Unlike typical low-code platforms which traps you on their platform,
        LabelFlow generates code based on leading open-source tools, and makes
        this code available to you on Github. You just saved months of
        development!
      </Feature>
      <Feature title="Fast" icon={<FcFlashOn />}>
        Performance is the most important aspect for your users. But scaling and
        maintaining high performance of web applications can be daunting.
        LabelFlow guarantees you'll get ideal performance.
      </Feature> */}
      </SimpleGrid>
    </Box>
  </Box>
);
