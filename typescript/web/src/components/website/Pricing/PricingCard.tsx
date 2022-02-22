import {
  Flex,
  Heading,
  Icon,
  List,
  ListIcon,
  ListItem,
  Text,
  useColorModeValue,
  VStack,
} from "@chakra-ui/react";
import * as React from "react";
import { HiCheckCircle } from "react-icons/hi";
import { Card, CardProps } from "./Card";

export interface PricingCardData {
  features: string[];
  name: string;
  price: string;
  pricePost: string;
  trialPeriod: string;
}

interface PricingCardProps extends CardProps {
  data: PricingCardData;
  icon: React.ElementType;
  button: React.ReactElement;
}

export const PricingCard = (props: PricingCardProps) => {
  const { data, icon, button, ...rest } = props;
  const { features, price, pricePost, name, trialPeriod } = data;
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
        {features.map((feature) => (
          <ListItem fontWeight="medium" key={feature}>
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
      <VStack spacing={2}>
        {button}
        <Text fontWeight="600" color="gray.400">
          {trialPeriod}
        </Text>
      </VStack>
    </Card>
  );
};
