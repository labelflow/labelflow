import {
  Box,
  Button,
  Flex,
  HStack,
  Progress,
  Stack,
  Text,
  useColorModeValue as mode,
  VStack,
} from "@chakra-ui/react";
import { WorkspacePlan } from "@labelflow/graphql-types";
import { isNil } from "lodash/fp";
import { useRouter } from "next/router";
import { useCallback } from "react";
import { trackEvent } from "../../../utils/google-analytics";
import { WorkspacePlanBadge } from "../../workspaces/workspace-badge";
import { Card } from "../card";
import { HeadingGroup } from "../heading-group";
import { useWorkspaceSettings } from "./context";

const MAX_IMAGES_BY_PLAN: Record<WorkspacePlan, number> = {
  Community: 1000,
  Starter: 5000,
  Pro: 50000,
};

const WARNING_PERCENTAGE_LEVEL = 80;

const ERROR_PERCENTAGE_LEVEL = 100;

const Header = () => (
  <HeadingGroup
    title="Plan & Billing"
    description="Change Plan, payment methods or billing information"
  />
);

const getPercentageValue = (value: number, plan: WorkspacePlan) => {
  const maxPlanValue = MAX_IMAGES_BY_PLAN[plan];
  return (value / maxPlanValue) * 100;
};
const getColorScheme = (value: number, plan: WorkspacePlan) => {
  const percentageValue = getPercentageValue(value, plan);
  if (percentageValue < WARNING_PERCENTAGE_LEVEL) {
    return "brand";
  }
  if (percentageValue < ERROR_PERCENTAGE_LEVEL) {
    return "orange";
  }
  return "red";
};

const TopPart = () => {
  const { plan } = useWorkspaceSettings();
  return (
    <VStack spacing={4} align="flex-start">
      <HStack spacing={4}>
        <Text fontWeight="semibold">Your plan</Text>
        <WorkspacePlanBadge plan={plan} />
      </HStack>
      <Text color={mode("gray.800", "gray.400")} fontSize="sm">
        {`You are on the ${plan} plan. Click on Manage Plan to upgrade or cancel an existing subscription.`}
      </Text>
      <Text fontWeight="semibold">Usage</Text>
      <Text fontSize="sm">Number of images stored in your workspace</Text>
    </VStack>
  );
};

const CurrentPlan = () => {
  const {
    plan,
    imagesAggregates: { totalCount },
  } = useWorkspaceSettings();
  const maxPlanValue = MAX_IMAGES_BY_PLAN[plan];
  return (
    <Box>
      <TopPart />
      <HStack>
        <Progress
          display="flex"
          flexGrow={1}
          colorScheme={getColorScheme(totalCount, plan)}
          value={getPercentageValue(totalCount, plan)}
        />
        <Text fontSize="sm">{`${totalCount} / ${maxPlanValue}`}</Text>
      </HStack>
    </Box>
  );
};

const ManageBillingButton = () => {
  const { stripeCustomerPortalUrl } = useWorkspaceSettings() ?? {};
  const router = useRouter();
  const handleClick = useCallback(() => {
    if (!isNil(stripeCustomerPortalUrl)) {
      trackEvent("manage_billing", stripeCustomerPortalUrl);
      router.push(stripeCustomerPortalUrl);
    }
  }, [router, stripeCustomerPortalUrl]);
  return (
    <Button size="sm" mt={4} colorScheme="brand" onClick={handleClick}>
      Manage Plan
    </Button>
  );
};

const Body = () => (
  <Card>
    <CurrentPlan />
    <Flex direction="row" justifyContent="flex-end">
      <ManageBillingButton />
    </Flex>
  </Card>
);

export const Billing = () => (
  <Stack as="section" spacing="6">
    <Header />
    <Body />
  </Stack>
);
