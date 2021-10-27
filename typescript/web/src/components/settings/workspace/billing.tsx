import { Button, Stack, StackProps, Text, Flex } from "@chakra-ui/react";
import * as React from "react";
import { Card } from "../card";
import { HeadingGroup } from "../heading-group";

export const Billing = ({
  workspace,
  ...props
}: StackProps & {
  workspace?: {
    id: string;
    name: string;
    image?: string | null;
    slug: string;
    plan: string;
    stripeCustomerPortalUrl: string;
  };
}) => (
  <Stack as="section" spacing="6" {...props}>
    <HeadingGroup
      title="Billing"
      description="Change Plan, payment methods or billing information"
    />
    <Card>
      <Text fontWeight="bold">Current Plan</Text>
      <Flex direction="row" justifyContent="space-between">
        <Text fontSize="sm" mt="1" mb="3">
          {workspace?.plan}
        </Text>
        <Button
          as="a"
          href={workspace?.stripeCustomerPortalUrl}
          size="sm"
          colorScheme="brand"
        >
          Change Plan
        </Button>
      </Flex>
    </Card>
  </Stack>
);
