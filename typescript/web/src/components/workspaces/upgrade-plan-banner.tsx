import {
  Button,
  chakra,
  Flex,
  Stack,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { isWorkspaceActive } from "@labelflow/common-resolvers";
import { useRouter } from "next/router";
import { RiErrorWarningFill } from "react-icons/ri";
import { useWorkspace } from "../../hooks/use-user";

const InfoIcon = chakra(RiErrorWarningFill);

const Message = () => (
  <Text textAlign="center">
    Your trial has expired. Update your payment info to keep access to your
    datasets or downgrade to the community plan.
  </Text>
);

const UpgradeButton = () => {
  const router = useRouter();
  const { slug: workspaceSlug } = useWorkspace();
  const redirectToSettings = () => {
    router.push(`/${workspaceSlug}/settings`);
  };
  return (
    <Button
      colorScheme="orange"
      size="sm"
      fontSize="xs"
      onClick={redirectToSettings}
    >
      Upgrade Plan
    </Button>
  );
};

const Content = () => (
  <Stack
    direction={{ base: "column", md: "row" }}
    justify="center"
    align="center"
    color={useColorModeValue("white", "black")}
    p=".5em"
    maxW="5xl"
    spacing={4}
  >
    <InfoIcon fontSize="xl" />
    <Message />
    <UpgradeButton />
  </Stack>
);

const Body = () => (
  <Flex justify="center" bg="orange.400">
    <Content />
  </Flex>
);

export const UpgradePlanBanner = () => {
  const { status } = useWorkspace();
  return !isWorkspaceActive(status) ? <Body /> : <></>;
};
