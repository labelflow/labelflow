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

import { Logo } from "../../../logo";

const GithubIcon = chakra(RiGithubFill);
type Props = {
  startLabellingButtonRef: React.Ref<HTMLButtonElement>;
  hasUserClickedStart: boolean;
  handleClickStartLabelling: () => void;
};

export const Welcome = ({
  startLabellingButtonRef,
  hasUserClickedStart,
  handleClickStartLabelling,
}: Props) => {
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
          <Heading
            as="h1"
            size="2xl"
            maxW="lg"
            color={mode("gray.600", "gray.300")}
            fontWeight="extrabold"
            textAlign="center"
          >
            The open standard{" "}
            <Text color="brand.500" display="inline">
              image labeling tool
            </Text>
          </Heading>

          <Text
            color={mode("gray.600", "gray.400")}
            mt="16"
            maxW="lg"
            fontSize="lg"
            fontWeight="medium"
            textAlign="justify"
          >
            Stay in control of your data, label your images without them leaving
            your computer. Focus on building the next big thing.
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
            isLoading={hasUserClickedStart}
            onClick={handleClickStartLabelling}
            loadingText="Loading the app"
          >
            Start Labelling!
          </Button>
        </HStack>
      </ModalFooter>
    </ModalContent>
  );
};
