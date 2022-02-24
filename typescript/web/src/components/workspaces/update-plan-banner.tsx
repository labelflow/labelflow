import { Button, chakra, Flex, Text } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { RiInformationFill } from "react-icons/ri";
import { useWorkspace } from "../../hooks/use-user";

const InfoIcon = chakra(RiInformationFill);
export const UpdatePlanBanner = () => {
  const { slug: workspaceSlug } = useWorkspace();
  const router = useRouter();
  const redirectToSettings = () => {
    router.push(`/${workspaceSlug}/settings`);
  };
  return (
    <Flex
      direction={{ base: "column", md: "row" }}
      justify="center"
      align="center"
      bg="#EFAB22"
      zIndex="100"
      p="4"
      gridGap="4"
    >
      <InfoIcon h="24px" w="24px" />
      <Text fontWeight="500" textAlign="center">
        Your trial has expired. Update your payment info to not lose access to
        your datasets or downgrade to the community plan.
      </Text>
      <Button
        bg="orange.400"
        size="sm"
        _hover={{ bg: "orange.200" }}
        onClick={redirectToSettings}
      >
        <Text>Update Plan</Text>
      </Button>
    </Flex>
  );
};
