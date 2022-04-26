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
import {
  createContext,
  PropsWithChildren,
  ReactElement,
  useContext,
} from "react";
import { HiCheckCircle } from "react-icons/hi";
import { IconType } from "react-icons/lib";
import { Card, CardProps } from "./card";

export type PricingCardData = {
  features: string[];
  name: string;
  price: string;
  pricePost: string;
  trialPeriod: string;
};

export type PricingCardPropsBase = {
  data: PricingCardData;
  icon: IconType;
  button: ReactElement;
};

export type PricingCardProps = CardProps & PricingCardPropsBase;

type PricingCardState = PricingCardData & Omit<PricingCardPropsBase, "data">;

const PricingCardContext = createContext({} as PricingCardState);

const usePricingCard = () => useContext(PricingCardContext);

const useProvider = ({
  data,
  ...props
}: PricingCardPropsBase): PricingCardState => ({
  ...data,
  ...props,
});

const PricingCardProvider = ({
  children,
  ...props
}: PropsWithChildren<PricingCardPropsBase>) => (
  <PricingCardContext.Provider value={useProvider(props)}>
    {children}
  </PricingCardContext.Provider>
);

const useAccentColor = () => useColorModeValue("brand.500", "brand.200");

const Header = () => {
  const { name, icon } = usePricingCard();
  return (
    <VStack spacing={6}>
      <Icon aria-hidden as={icon} fontSize="6xl" color={useAccentColor()} />
      <Heading size="md" fontWeight="extrabold">
        {name}
      </Heading>
    </VStack>
  );
};

const Price = () => {
  const { price, pricePost } = usePricingCard();
  return (
    <Flex
      align="flex-end"
      justify="center"
      fontWeight="extrabold"
      color={useAccentColor()}
      my="8"
    >
      <Heading size="3xl" fontWeight="inherit" lineHeight="0.9em">
        {price}
      </Heading>
      <Text fontWeight="inherit" fontSize="2xl">
        {pricePost}
      </Text>
    </Flex>
  );
};

type FeatureItemProps = { feature: string };

const FeatureItem = ({ feature }: FeatureItemProps) => (
  <ListItem fontWeight="medium" key={feature}>
    <ListIcon
      fontSize="xl"
      as={HiCheckCircle}
      marginEnd={2}
      color={useAccentColor()}
    />
    {feature}
  </ListItem>
);

const Features = () => {
  const { features } = usePricingCard();
  return (
    <List spacing="4" mb="8" maxW="28ch" mx="auto">
      {features.map((feature) => (
        <FeatureItem key={feature} feature={feature} />
      ))}
    </List>
  );
};

const StartTrial = () => {
  const { button, trialPeriod } = usePricingCard();
  return (
    <VStack spacing={2}>
      {button}
      <Text fontWeight="semibold" color="gray.400">
        {trialPeriod}
      </Text>
    </VStack>
  );
};

const PricingCardBody = (props: CardProps) => (
  <Card rounded={{ sm: "xl" }} {...props}>
    <Header />
    <Price />
    <Features />
    <StartTrial />
  </Card>
);

export const PricingCard = ({
  data,
  icon,
  button,
  ...props
}: PricingCardProps) => (
  <PricingCardProvider data={data} icon={icon} button={button}>
    <PricingCardBody {...props} />
  </PricingCardProvider>
);
