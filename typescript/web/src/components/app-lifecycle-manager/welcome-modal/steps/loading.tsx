import { useRef, useEffect } from "react";
import {
  chakra,
  ModalContent,
  ModalFooter,
  VStack,
  HStack,
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
  const startLabellingButtonRef = useRef<HTMLButtonElement>(null);
  // Start the timer during the first render
  useEffect(() => {
    startLabellingButtonRef.current?.focus();
  }, []);
  return (
    <ModalContent margin="3.75rem">
      <ModalHeader textAlign="center" padding="8">
        <Center>
          <ChakraRocket mt="12" mb="8" width="40" height="40" />
          {/* <Image src={rocket} mt="12" mb="8" width="40" height="40" /> */}
        </Center>
      </ModalHeader>

      <ModalBody>
        <VStack
          justifyContent="space-evenly"
          spacing="8"
          h="full"
          mt="0"
          mb="8"
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
        <HStack
          direction={{ base: "column", md: "row" }}
          justifyContent="center"
          width="full"
          spacing="4"
          mb="10"
        >
          <Button
            ref={startLabellingButtonRef}
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
        </HStack>
      </ModalFooter>
    </ModalContent>
  );
};
