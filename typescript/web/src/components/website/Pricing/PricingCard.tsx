import {
  Flex,
  Heading,
  Icon,
  List,
  ListIcon,
  ListItem,
  Button,
  Text,
  useColorModeValue,
  VStack,
} from "@chakra-ui/react";
import NextLink from "next/link";
import * as React from "react";
import { HiCheckCircle } from "react-icons/hi";
import { Card, CardProps } from "./Card";

export interface PricingCardData {
  features: string[];
  name: string;
  price: string;
  pricePost: string;
}

interface PricingCardProps extends CardProps {
  data: PricingCardData;
  icon: React.ElementType;
  button: React.ReactElement;
}

export const PricingCard = (props: PricingCardProps) => {
  const { data, icon, button, ...rest } = props;
  const { features, price, pricePost, name } = data;
  const accentColor = useColorModeValue("brand.500", "brand.200");

  return (
    <Card rounded={{ sm: "xl" }} {...rest}>
      <VStack spacing={6}>
        <Icon aria-hidden as={icon} fontSize="6xl" color={accentColor} />
        <Heading size="md" fontWeight="extrabold">
          {name}
        </Heading>
      </VStack>
      <Flex
        align="flex-end"
        justify="center"
        fontWeight="extrabold"
        color={accentColor}
        my="8"
      >
        <Heading size="3xl" fontWeight="inherit" lineHeight="0.9em">
          {price}
        </Heading>
        <Text fontWeight="inherit" fontSize="2xl">
          {pricePost}
        </Text>
      </Flex>
      <List spacing="4" mb="8" maxW="28ch" mx="auto">
        {features.map((feature, index) => (
          <ListItem fontWeight="medium" key={index}>
            <ListIcon
              fontSize="xl"
              as={HiCheckCircle}
              marginEnd={2}
              color={accentColor}
            />
            {feature}
          </ListItem>
        ))}
      </List>
      <VStack spacing={6}>
        {/* <NextLink href="/pricing">
          <Button
            variant="unstyled"
            colorScheme="brand"
            // size="lg"
            w="full"
            // py={{ md: "8" }}
          >
            See all features
          </Button>
        </NextLink> */}
        {button}
      </VStack>
    </Card>
  );
};
