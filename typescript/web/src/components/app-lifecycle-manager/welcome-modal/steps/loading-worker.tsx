import {
  chakra,
  ModalContent,
  ModalFooter,
  VStack,
  HStack,
  Button,
  Heading,
  Image,
  Center,
  Text,
  ModalBody,
  ModalHeader,
  useColorModeValue as mode,
} from "@chakra-ui/react";
import { RiGithubFill } from "react-icons/ri";

import { Logo } from "../../../logo";

import rocket from "../../../../../public/static/graphics/rocket.svg";

const GithubIcon = chakra(RiGithubFill);
type Props = { startLabellingButtonRef: React.Ref<HTMLButtonElement> };

export const LoadingWorker = ({ startLabellingButtonRef }: Props) => {
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
          <Image src={rocket} p={10} width="16em" height="16em" />
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
            The application finishes loading to allow offline use. Labelflow
            runs completely offline, this allows you to have a lightning fast
            labelling tool even with no internet connection, and guarantees we
            don&apos;t use your data.
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
            colorScheme="brand"
            height="14"
            px="8"
            isLoading
            onClick={undefined}
            loadingText="Loading the app"
          >
            Start Labelling!
          </Button>
        </HStack>
      </ModalFooter>
    </ModalContent>
  );
};
