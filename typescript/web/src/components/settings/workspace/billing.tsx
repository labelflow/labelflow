import { Button, Flex, Stack, Text } from "@chakra-ui/react";
import { Card } from "../card";
import { FieldGroup } from "../field-group";
import { HeadingGroup } from "../heading-group";
import { useWorkspaceSettings } from "./context";

export const Billing = () => {
  const workspace = useWorkspaceSettings();
  return (
    <Stack as="section" spacing="6">
      <HeadingGroup
        title="Billing"
        description="Change Plan, payment methods or billing information"
      />
      <Card>
        <FieldGroup
          title="Plan"
          description="Your current plan. You can change it by clicking on Manage Billing"
        >
          <Text mt="1" mb="3">
            {workspace?.plan}
          </Text>
        </FieldGroup>

        <Flex direction="row" justifyContent="flex-end">
          <Button
            as="a"
            href={workspace?.stripeCustomerPortalUrl ?? undefined}
            size="sm"
            colorScheme="brand"
          >
            Manage Billing
          </Button>
        </Flex>
      </Card>
    </Stack>
  );
};
