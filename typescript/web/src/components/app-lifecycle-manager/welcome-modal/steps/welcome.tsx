import { useEffect, useState } from "react";
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
import { RiPlayFill, RiSpeedMiniFill } from "react-icons/ri";

import useCountDown from "react-countdown-hook";

import { Logo } from "../../../logo";

const PlayIcon = chakra(RiPlayFill);
const SpeedIcon = chakra(RiSpeedMiniFill);

type Props = {
  startLabellingButtonRef: React.Ref<HTMLButtonElement>;
  onClickNext: () => void;
  onClickSkip?: () => void;
};

export const Welcome = ({
  startLabellingButtonRef,
  onClickSkip,
  onClickNext,
}: Props) => {
  const [isCountDownStarted, setIsCountDownStarted] = useState(false);
  const [timeLeft, { start }] = useCountDown(10 * 1000, 1000);

  // Start the timer during the first render
  useEffect(() => {
    setIsCountDownStarted(true);
    start();
  }, []);

  useEffect(() => {
    if (isCountDownStarted && timeLeft < 1000 && onClickNext) {
      onClickNext();
    }
  }, [isCountDownStarted, timeLeft]);

  return (
    <ModalContent margin="3.75rem">
      <ModalHeader textAlign="center" padding="8">
        <Center flexDirection="column">
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
            Stay in control of your data, label your images fast, without them
            leaving your computer. Focus on building the next big thing while we
            ensure privacy and performance.
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
            size="lg"
            leftIcon={<SpeedIcon fontSize="xl" />}
            minW="210px"
            variant="link"
            height="14"
            px="8"
            loadingText="Skip the tutorial"
            onClick={onClickSkip}
          >
            Skip the tutorial
          </Button>

          <Button
            ref={startLabellingButtonRef}
            leftIcon={<PlayIcon fontSize="xl" />}
            size="lg"
            minW="210px"
            colorScheme="brand"
            height="14"
            px="8"
            loadingText="Get started!"
            onClick={onClickNext}
          >
            Get started!
          </Button>
        </HStack>
      </ModalFooter>
    </ModalContent>
  );
};
