import { Button, chakra, Flex, Text } from "@chakra-ui/react";
import { isWorkspaceActive } from "@labelflow/common-resolvers/src/utils/is-workspace-active";
import { useRouter } from "next/router";
import { RiInformationFill } from "react-icons/ri";
import { useWorkspace } from "../../hooks/use-user";

const InfoIcon = chakra(RiInformationFill);

export const UpgradePlanBanner = () => {
  const { slug: workspaceSlug, status } = useWorkspace();
  const shouldDisplayUpdateBanner = !isWorkspaceActive(status);
  const router = useRouter();
  const redirectToSettings = () => {
    router.push(`/${workspaceSlug}/settings`);
  };
  return shouldDisplayUpdateBanner ? (
    <Flex
      direction={{ base: "column", md: "row" }}
      justify="center"
      align="center"
      bg="#EFAB22"
      p="4"
      gridGap="4"
    >
      <InfoIcon h="24px" w="24px" />
      <Text fontWeight="500" textAlign="center">
        Your trial has expired. Update your payment info to keep access to your
        datasets or downgrade to the community plan.
      </Text>
      <Button
        bg="orange.400"
        size="sm"
        _hover={{ bg: "orange.200" }}
        onClick={redirectToSettings}
      >
        Upgrade Plan
      </Button>
    </Flex>
  ) : (
    <></>
  );
};
