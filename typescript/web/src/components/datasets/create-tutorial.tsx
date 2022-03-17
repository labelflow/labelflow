import { Text } from "@chakra-ui/react";
import { InfoBody } from "../info-body/info-body";
import { Lottie } from "../lottie";

const Illustration = () => (
  <Lottie
    path="https://assets3.lottiefiles.com/packages/lf20_d0cvjyyg.json"
    w={500}
    speed={0.7}
  />
);

export const CreateTutorial = () => {
  return (
    <InfoBody
      title="Your tutorial will be here in a second..."
      illustration={Illustration}
      illustrationTitleSpacing={8}
    >
      {" "}
      <Text mt="4" mb="16" fontSize="lg">
        Its images and labels are being downloaded
      </Text>
    </InfoBody>
  );
};
