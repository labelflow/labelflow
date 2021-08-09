import {
  Box,
  SimpleGrid,
  useColorModeValue,
  Heading,
  Text,
} from "@chakra-ui/react";
import * as React from "react";
import { GiCommercialAirplane, GiCityCar } from "react-icons/gi";

import { IoRocketSharp } from "react-icons/io5";
import NextLink from "next/link";
import { ActionButton } from "./ActionButton";
import { PricingCard } from "./PricingCard";

export const Pricing = () => (
  <Box
    id="pricing"
    as="section"
    bg={useColorModeValue("gray.50", "gray.800")}
    py="48"
    px={{ base: "4", md: "8" }}
  >
    <Heading align="center" fontWeight="extrabold" maxW="lg" mx="auto">
      Multiply the progress speed of your AI
    </Heading>
    <Text align="center" textAlign="center" maxW="lg" mx="auto" mt="12">
      Dataset quality is the number one limiting factor for computer vision
      tasks. For the <strong>price of a cup of coffee a day</strong>, get the
      tools you need to make your machine learning models the best in their
      class.
    </Text>
    <SimpleGrid
      mt="24"
      columns={{ base: 1, lg: 3 }}
      spacing={{ base: "8", lg: "0" }}
      maxW="7xl"
      mx="auto"
      justifyItems="center"
      alignItems="center"
    >
      <PricingCard
        data={{
          price: "$0",
          pricePost: "for ever",
          name: "Free",
          features: [
            "Sleek labeling interface",
            "Dataset import/export",
            "Project management",
            "Up to 5 users, 100 images/month",
          ],
        }}
        icon={GiCityCar}
        button={
          <NextLink href="/projects">
            <ActionButton variant="outline" borderWidth="2px">
              Try it now
            </ActionButton>
          </NextLink>
        }
      />
      <PricingCard
        zIndex={1}
        isPopular
        transform={{ lg: "scale(1.05)" }}
        data={{
          price: "$59",
          pricePost: "/mo/user",
          name: "Starter",
          features: [
            "AI labeling assistant",
            "Custom workflows",
            "3rd party storage integration",
            "25 users, 10,000 images/month",
          ],
        }}
        icon={GiCommercialAirplane}
        button={
          <NextLink href="/request-access">
            <ActionButton>Request Access</ActionButton>
          </NextLink>
        }
      />
      <PricingCard
        data={{
          price: "Ask us",
          pricePost: "",
          name: "Pro & Enterprise",
          features: [
            "White label integrations",
            "On-prem airgapped deployment",
            "Enterprise features & support",
            "Unlimited users & images",
          ],
        }}
        icon={IoRocketSharp}
        button={
          <NextLink href="/request-access">
            <ActionButton variant="outline" borderWidth="2px">
              Request Access
            </ActionButton>
          </NextLink>
        }
      />
    </SimpleGrid>
  </Box>
);
