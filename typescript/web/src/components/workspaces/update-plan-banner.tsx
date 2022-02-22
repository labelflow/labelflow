import { Button, chakra, Flex, Text } from "@chakra-ui/react";
import { RiInformationFill } from "react-icons/ri";

const InfoIcon = chakra(RiInformationFill);
export const UpdatePlanBanner = () => (
  <Flex
    direction={{ base: "column", md: "row" }}
    justify="center"
    align="center"
    bg="#EFAB22"
    position="fixed"
    top="0"
    left="0"
    right="0"
    zIndex="100"
    p="4"
    gridGap="4"
  >
    <InfoIcon h="24px" w="24px" />
    <Text fontWeight="500" textAlign="center">
      Your trial has expired. Update your payment info to not lose access to
      your datasets or downgrade to the community plan.
    </Text>
    <Button bg="orange.400" size="sm" _hover={{ bg: "orange.200" }}>
      <Text>Update Plan</Text>
    </Button>
  </Flex>
);
