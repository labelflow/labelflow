import { Button, chakra, Flex, Text } from "@chakra-ui/react";
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

const Body = () => (
  <Flex
    direction={{ base: "column", md: "row" }}
    justify="center"
    align="center"
    bg="orange.400"
    color="white"
    p="4"
    gridGap="4"
  >
    <InfoIcon h="24px" w="24px" />
    <Message />
    <UpgradeButton />
  </Flex>
);

export const UpgradePlanBanner = () => {
  const { status } = useWorkspace();
  return !isWorkspaceActive(status) ? <Body /> : <></>;
};
