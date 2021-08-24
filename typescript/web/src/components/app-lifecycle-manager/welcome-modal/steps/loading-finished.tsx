import { useEffect } from "react";
import {
  chakra,
  ModalContent,
  ModalFooter,
  VStack,
  HStack,
  Button,
  Image,
  Center,
  Text,
  Heading,
  ModalBody,
  ModalHeader,
  useColorModeValue as mode,
} from "@chakra-ui/react";

import useCountDown from "react-countdown-hook";
import { RiPlayFill, RiSpeedMiniFill } from "react-icons/ri";

import gift from "../../../../../public/static/graphics/gift.svg";

const PlayIcon = chakra(RiPlayFill);
const SpeedIcon = chakra(RiSpeedMiniFill);

type Props = {
  startLabellingButtonRef: React.Ref<HTMLButtonElement>;
  onClickNext?: () => void;
  onClickSkip?: () => void;
};

export const LoadingFinished = ({
  startLabellingButtonRef,
  onClickNext,
  onClickSkip,
}: Props) => {
  const [timeLeft, { start }] = useCountDown(10 * 1000, 1000);

  // Start the timer during the first render
  useEffect(() => {
    start();
  }, []);

  useEffect(() => {
    if (timeLeft < 1000 && onClickNext) {
      onClickNext();
    }
  }, [timeLeft]);

  return (
    <ModalContent margin="3.75rem">
      <ModalHeader textAlign="center" padding="8">
        <Center>
          <Image src={gift} mt="12" mb="8" width="40" height="40" />
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
            We&apos;re all set!
          </Heading>
          <Text
            color={mode("gray.600", "gray.400")}
            maxW="lg"
            fontSize="lg"
            fontWeight="medium"
            textAlign="justify"
          >
            The tutorial will start automatically in {timeLeft / 1000} seconds.
            It contains example data, helping you get you started easily with
            Labelflow. You can skip it if you prefer.
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
            onClick={onClickNext}
          >
            Get started!
          </Button>
        </HStack>
      </ModalFooter>
    </ModalContent>
  );
};
