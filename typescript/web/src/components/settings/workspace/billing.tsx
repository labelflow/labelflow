import { Button, Flex, Stack, Text } from "@chakra-ui/react";
import { isNil } from "lodash/fp";
import { useRouter } from "next/router";
import { useCallback } from "react";
import { trackEvent } from "../../../utils/google-analytics";
import { Card } from "../card";
import { FieldGroup } from "../field-group";
import { HeadingGroup } from "../heading-group";
import { useWorkspaceSettings } from "./context";

const Header = () => (
  <HeadingGroup
    title="Billing"
    description="Change Plan, payment methods or billing information"
  />
);

const CurrentPlan = () => {
  const { plan } = useWorkspaceSettings() ?? {};
  return (
    <FieldGroup
      title="Plan"
      description="Your current plan. You can change it by clicking on Manage Billing"
    >
      <Text mt="1" mb="3">
        {plan}
      </Text>
    </FieldGroup>
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
    <Button size="sm" colorScheme="brand" onClick={handleClick}>
      Manage Billing
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
