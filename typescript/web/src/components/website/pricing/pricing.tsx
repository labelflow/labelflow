import {
  Box,
  Button,
  ButtonProps,
  Heading,
  SimpleGrid,
  useColorModeValue,
} from "@chakra-ui/react";
import { WorkspacePlan } from "@labelflow/graphql-types";
import { paramCase } from "change-case";
import NextLink from "next/link";
import { BsPeopleFill } from "react-icons/bs";
import { GiCommercialAirplane } from "react-icons/gi";
import { IoRocketSharp } from "react-icons/io5";
import { SetOptional } from "type-fest";
import { PricingCard, PricingCardData, PricingCardProps } from "./pricing-card";

type ActionButtonProps = Pick<ButtonProps, "variant"> & {
  workspacePlan: WorkspacePlan;
};

const ActionButton = ({
  workspacePlan,
  variant = "outline",
  ...props
}: ActionButtonProps) => {
  const workspacePlanValue = paramCase(workspacePlan);
  return (
    <NextLink href={`/workspaces?plan=${workspacePlanValue}`}>
      <Button
        size="lg"
        w="full"
        colorScheme="brand"
        py={{ md: "8" }}
        fontWeight="extrabold"
        variant={variant}
        borderWidth={variant === "outline" ? 2 : undefined}
        {...props}
      >
        {workspacePlan === WorkspacePlan.Community
          ? "Try it now"
          : "Start free trial"}
      </Button>
    </NextLink>
  );
};

type PricingInfo = Omit<PricingCardProps, "button" | "data"> &
  Pick<ActionButtonProps, "variant" | "workspacePlan"> & {
    data: SetOptional<
      Omit<PricingCardData, "trialPeriod">,
      "name" | "pricePost"
    >;
  };

const PricingRow = ({
  workspacePlan,
  data,
  variant,
  ...props
}: PricingInfo) => (
  <PricingCard
    {...props}
    data={{
      name: workspacePlan,
      trialPeriod:
        workspacePlan === WorkspacePlan.Community
          ? "Free for ever"
          : "14 days free trial",
      pricePost: "/mo",
      ...data,
    }}
    button={<ActionButton workspacePlan={workspacePlan} variant={variant} />}
  />
);

const PRICING: PricingInfo[] = [
  {
    workspacePlan: WorkspacePlan.Community,
    icon: BsPeopleFill,
    data: {
      price: "$0",
      pricePost: "for ever",
      features: [
        "Smart labeling",
        "1,000 hosted images",
        "Unlimited datasets",
        "Dataset import/export",
        "Unlimited users",
        "Sleek labeling interface",
      ],
    },
  },
  {
    workspacePlan: WorkspacePlan.Starter,
    zIndex: 1,
    transform: { lg: "scale(1.05)" },
    icon: GiCommercialAirplane,
    data: {
      price: "$19",
      features: [
        "Smart labeling",
        "5,000 hosted images",
        "Unlimited datasets",
        "Dataset import/export",
        "Unlimited users",
        "Sleek labeling interface",
      ],
    },
  },
  {
    workspacePlan: WorkspacePlan.Pro,
    icon: IoRocketSharp,
    variant: "solid",
    data: {
      price: "$149",
      features: [
        "Smart labeling",
        "50,000 hosted images",
        "Unlimited datasets",
        "Dataset import/export",
        "Unlimited users",
        "Sleek labeling interface",
      ],
    },
  },
];

const PricingCards = () => (
  <>
    {PRICING.map((pricing) => (
      <PricingRow key={pricing.workspacePlan} {...pricing} />
    ))}
  </>
);

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
    <SimpleGrid
      mt="24"
      columns={{ base: 1, lg: 3 }}
      spacing={{ base: "8", lg: "0" }}
      maxW="7xl"
      mx="auto"
      justifyItems="center"
      alignItems="center"
    >
      <PricingCards />
    </SimpleGrid>
  </Box>
);
