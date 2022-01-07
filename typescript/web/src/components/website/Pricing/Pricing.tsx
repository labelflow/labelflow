import { Box, SimpleGrid, useColorModeValue, Heading } from "@chakra-ui/react";
import * as React from "react";
import { GiCommercialAirplane } from "react-icons/gi";
import { BsPeopleFill } from "react-icons/bs";

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
    {/* <Text align="center" textAlign="center" maxW="lg" mx="auto" mt="12">
      Dataset quality is the number one limiting factor for computer vision
      tasks. For the <strong>price of a cup of coffee a day</strong>, get the
      tools you need to make your machine learning models the best in their
      class.
    </Text> */}
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
          name: "Community",
          features: [
            "Smart labeling",
            "1,000 hosted images",
            "Unlimited local images",
            "Unlimited datasets",
            "Dataset import/export",
            "Unlimited users",
            "Sleek labeling interface",
          ],
        }}
        icon={BsPeopleFill}
        button={
          <NextLink href="/test/datasets">
            <ActionButton>Try it now</ActionButton>
          </NextLink>
        }
      />
      <PricingCard
        zIndex={1}
        // isPopular
        transform={{ lg: "scale(1.05)" }}
        data={{
          price: "$19",
          pricePost: "/mo",
          name: "Starter",
          features: [
            "Smart labeling",
            "5,000 hosted images",
            "Unlimited local images",
            "Unlimited datasets",
            "Dataset import/export",
            "Unlimited users",
            "Sleek labeling interface",
          ],
        }}
        icon={GiCommercialAirplane}
        button={
          <NextLink href="/request-access">
            <ActionButton variant="outline" borderWidth="2px">
              Request Access
            </ActionButton>
          </NextLink>
        }
      />
      <PricingCard
        data={{
          price: "$149",
          pricePost: "/mo",
          name: "Pro",
          features: [
            "Smart labeling",
            "50,000 hosted images",
            "Unlimited local images",
            "Unlimited datasets",
            "Dataset import/export",
            "Unlimited users",
            "Sleek labeling interface",
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
