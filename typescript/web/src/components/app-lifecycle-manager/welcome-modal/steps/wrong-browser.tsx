import {
  chakra,
  ModalContent,
  ModalFooter,
  VStack,
  HStack,
  Button,
  Heading,
  Image,
  Link,
  Center,
  Text,
  ModalBody,
  ModalHeader,
  useColorModeValue as mode,
} from "@chakra-ui/react";
import { RiGithubFill } from "react-icons/ri";

import { Logo } from "../../../logo";

import browserAlert from "../../../../../public/static/graphics/browser-alert.svg";

const GithubIcon = chakra(RiGithubFill);
type Props = { startLabellingButtonRef: React.Ref<HTMLButtonElement> };

export const WrongBrowser = ({ startLabellingButtonRef }: Props) => {
  return (
    <ModalContent margin="3.75rem">
      <ModalHeader textAlign="center" padding="6">
        <Center>
          <Logo maxW="lg" mt="8" mb="8" h="min-content" />
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
          <Image src={browserAlert} p={10} width="16em" height="16em" />
          <Heading
            as="h1"
            size="2xl"
            maxW="lg"
            color={mode("gray.600", "gray.300")}
            fontWeight="extrabold"
            textAlign="center"
          >
            Unsupported browser
          </Heading>
          <Text
            color={mode("gray.600", "gray.400")}
            maxW="lg"
            fontSize="lg"
            fontWeight="medium"
            textAlign="justify"
          >
            It seems like you are using an unsupported browser. For technical
            reasons, Labelflow recommends to use the latest version of{" "}
            <Link href="https://www.mozilla.org/firefox/new" isExternal>
              Firefox
            </Link>
            ,{" "}
            <Link href="https://brave.com/download/" isExternal>
              Brave
            </Link>
            ,{" "}
            <Link href="https://www.microsoft.com/edge" isExternal>
              Edge
            </Link>
            ,{" "}
            <Link href="https://www.google.com/chrome/" isExternal>
              Chrome
            </Link>{" "}
            or{" "}
            <Link href="https://www.apple.com/safari/" isExternal>
              Safari
            </Link>
            , not in incognito mode, not on a mobile terminal, and with any ad
            blocker disabled.
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
            ref={startLabellingButtonRef}
            size="lg"
            minW="210px"
            colorScheme="red"
            height="14"
            px="8"
            isLoading={false}
            onClick={undefined}
            variant="link"
            loadingText="Loading the app"
          >
            Try anyway...
          </Button>
        </HStack>
      </ModalFooter>
    </ModalContent>
  );
};
