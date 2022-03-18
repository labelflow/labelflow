import {
  Button,
  Flex,
  HStack,
  Progress,
  ProgressProps,
  Stack,
  Text,
} from "@chakra-ui/react";
import { MAX_IMAGES_PER_WORKSPACE } from "@labelflow/common-resolvers";
import { WorkspacePlan } from "@labelflow/graphql-types";
import { isNil } from "lodash/fp";
import { useRouter } from "next/router";
import { useCallback } from "react";
import { trackEvent } from "../../../utils/google-analytics";
import { WorkspacePlanBadge } from "../../workspaces/workspace-plan-badge";
import { Card } from "../card";
import { FieldGroup } from "../field-group";
import { HeadingGroup } from "../heading-group";
import { useWorkspaceSettings } from "./context";

/**
 * Percentage from which a warning about the maximum number of images in a
 * workspace should be displayed
 */
const MAX_IMAGES_WARNING_THRESHOLD = 80;

/**
 * Percentage from which an error about the maximum number of images in a
 * workspace should be displayed
 */
const MAX_IMAGES_ERROR_THRESHOLD = 100;

const Header = () => (
  <HeadingGroup
    title="Plan & Billing"
    description="Change Plan, payment methods or billing information"
  />
);

const getUsagePercentage = (value: number, plan: WorkspacePlan): number => {
  const maxPlanValue = MAX_IMAGES_PER_WORKSPACE[plan];
  return (value / maxPlanValue) * 100;
};

const getProgressColorScheme = (
  value: number,
  plan: WorkspacePlan
): ProgressProps["colorScheme"] => {
  const percentageValue = getUsagePercentage(value, plan);
  if (percentageValue < MAX_IMAGES_WARNING_THRESHOLD) return "brand";
  return percentageValue < MAX_IMAGES_ERROR_THRESHOLD ? "orange" : "red";
};

const YourPlan = () => {
  const { plan } = useWorkspaceSettings();
  return (
    <FieldGroup
      title={
        <HStack spacing={4}>
          <Text>{"Your plan "}</Text>
          <WorkspacePlanBadge plan={plan} />
        </HStack>
      }
      description={`You are on the ${plan} plan. Click on Manage Plan to upgrade or cancel an existing subscription.`}
    />
  );
};

const Usage = () => {
  const {
    plan,
    imagesAggregates: { totalCount },
  } = useWorkspaceSettings();
  const maxCount = MAX_IMAGES_PER_WORKSPACE[plan];
  return (
    <FieldGroup
      title="Usage"
      description={
        <>
          Number of images stored in your workspace
          <HStack>
            <Progress
              display="flex"
              flexGrow={1}
              colorScheme={getProgressColorScheme(totalCount, plan)}
              value={getUsagePercentage(totalCount, plan)}
            />
            <Text fontSize="sm">{`${totalCount} / ${maxCount}`}</Text>
          </HStack>
        </>
      }
    />
  );
};

const ManageBillingButton = () => {
  const { stripeCustomerPortalUrl } = useWorkspaceSettings() ?? {};
  const router = useRouter();
  const handleClick = useCallback(() => {
    if (isNil(stripeCustomerPortalUrl)) return;
    trackEvent("manage_billing", stripeCustomerPortalUrl);
    router.push(stripeCustomerPortalUrl);
  }, [router, stripeCustomerPortalUrl]);
  return (
    <Button size="sm" mt={4} colorScheme="brand" onClick={handleClick}>
      Manage Plan
    </Button>
  );
};

const ManageBilling = () => (
  <Flex direction="row" justifyContent="flex-end">
    <ManageBillingButton />
  </Flex>
);

const Body = () => (
  <Card>
    <YourPlan />
    <Usage />
    <ManageBilling />
  </Card>
);

export const Billing = () => (
  <Stack as="section" spacing="6">
    <Header />
    <Body />
  </Stack>
);
