import { useRef, useEffect } from "react";
import {
  chakra,
  ModalContent,
  ModalFooter,
  VStack,
  Stack,
  Button,
  Heading,
  Center,
  Text,
  ModalBody,
  ModalHeader,
  useColorModeValue as mode,
} from "@chakra-ui/react";
import { RiGithubFill } from "react-icons/ri";

import Rocket from "../../../graphics/rocket";

const ChakraRocket = chakra(Rocket);

const GithubIcon = chakra(RiGithubFill);

export const Loading = () => {
  const startLabellingButtonRef = useRef<HTMLAnchorElement>(null);
  // Start the timer during the first render
  useEffect(() => {
    startLabellingButtonRef.current?.focus();
  }, []);
  return (
    <ModalContent margin={{ base: "4", md: "3.75rem" }}>
      <ModalHeader textAlign="center" padding={{ base: "4", md: "8" }}>
        <Center>
          <ChakraRocket
            my={{ base: "4", md: "10" }}
            width="40"
            height={{ base: "16", md: "40" }}
          />
        </Center>
      </ModalHeader>

      <ModalBody>
        <VStack
          justifyContent="space-evenly"
          spacing="8"
          h="full"
          mt="0"
          mb={{ base: "4", md: "8" }}
        >
          <Heading
            as="h1"
            size="2xl"
            maxW="lg"
            color={mode("gray.600", "gray.300")}
            fontWeight="extrabold"
            textAlign="center"
          >
            Getting ready...
          </Heading>

          <Text
            color={mode("gray.600", "gray.400")}
            maxW="lg"
            fontSize="lg"
            fontWeight="medium"
            textAlign="justify"
          >
            Labelflow runs completely offline, allowing you to have a lightning
            fast labelling tool even without internet connection, and
            guaranteeing we don&apos;t use your data.
          </Text>
        </VStack>
      </ModalBody>
      <ModalFooter>
        <Stack
          direction={{ base: "column", md: "row" }}
          justifyContent="center"
          width="full"
          spacing="4"
          mb={{ base: "0", md: "10" }}
        >
          <Button
            ref={startLabellingButtonRef as any}
            as="a"
            leftIcon={<GithubIcon fontSize="xl" />}
            href="https://github.com/Labelflow/labelflow"
            target="blank"
            size="lg"
            minW="210px"
            variant="link"
            height="14"
            px="8"
          >
            See code on Github
          </Button>

          <Button
            size="lg"
            minW="210px"
            colorScheme="brand"
            height="14"
            px="8"
            isLoading
            loadingText="Loading the app"
          >
            Start Labelling!
          </Button>
        </Stack>
      </ModalFooter>
    </ModalContent>
  );
};
