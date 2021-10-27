import { Button, Stack, StackProps, Text, Flex } from "@chakra-ui/react";
import * as React from "react";
import { Card } from "../card";
import { HeadingGroup } from "../heading-group";
import { FieldGroup } from "../field-group";

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
          href={workspace?.stripeCustomerPortalUrl}
          size="sm"
          colorScheme="brand"
        >
          Manage Billing
        </Button>
      </Flex>
    </Card>
  </Stack>
);
