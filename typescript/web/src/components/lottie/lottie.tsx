import { chakra } from "@chakra-ui/react";
import LottiePlayer from "react-lottie-player";

const ChakraLottie = chakra(LottiePlayer);

export type LottieProps = React.ComponentPropsWithoutRef<typeof ChakraLottie>;

export const Lottie = (props: LottieProps) => (
  <ChakraLottie play loop {...props} />
);
