import { Button, Stack, StackProps, Text } from "@chakra-ui/react";
import * as React from "react";
import { Card } from "../card";
import { HeadingGroup } from "../heading-group";

export const DangerZone = (props: StackProps) => (
  <Stack as="section" spacing="6" {...props}>
    <HeadingGroup
      title="Danger zone"
      description="Irreversible and destructive actions"
    />
    <Card>
      <Text fontWeight="bold">Delete workspace and all data</Text>
      <Text fontSize="sm" mt="1" mb="3">
        Once you delete your workspace, there is no going back. Please be
        certain.
      </Text>
      <Button size="sm" colorScheme="red">
        Delete workspace
      </Button>
    </Card>
  </Stack>
);
