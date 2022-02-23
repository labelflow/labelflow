import { Button } from "@chakra-ui/react";
import NextLink from "next/link";
import { BsArrowRight } from "react-icons/bs";

export const TryHeroButton = () => (
  <NextLink href="/auth/signin">
    <Button
      size="lg"
      minW="210px"
      colorScheme="brand"
      height="14"
      px="8"
      rightIcon={<BsArrowRight />}
    >
      Try it now
    </Button>
  </NextLink>
);
