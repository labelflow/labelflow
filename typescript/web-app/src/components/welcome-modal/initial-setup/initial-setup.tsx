import { Box, Stack, Button, Text, HStack } from "@chakra-ui/react";
import * as React from "react";
import { Step } from "./step";
import { StepContent } from "./step-content";
import { Steps } from "./steps";
import { useSteps } from "./use-steps";

export const InitialSetup = () => {
  const { nextStep, prevStep, reset, activeStep } = useSteps({
    initialStep: 0,
  });

  return (
    <Box mx="auto" maxW="2xl" py="10" px={{ base: "6", md: "8" }} minH="400px">
      <Steps activeStep={activeStep}>
        <Step title="Select campaign settings">
          <StepContent>
            <Stack shouldWrapChildren spacing="4">
              <Text>
                For each ad campaign that you create, you can control how much
                you&apos;re willing to spend on clicks and conversions, which
                networks and geographical locations you want your ads to show
                on, and more.
              </Text>
              <HStack>
                <Button size="sm" variant="ghost" isDisabled>
                  Back
                </Button>
                <Button size="sm" onClick={nextStep}>
                  Next
                </Button>
              </HStack>
            </Stack>
          </StepContent>
        </Step>
        <Step title="Create an ad group">
          <StepContent>
            <Stack shouldWrapChildren spacing="4">
              <Text>
                An ad group contains one or more ads which target a shared set
                of keywords.
              </Text>
              <HStack>
                <Button size="sm" onClick={prevStep} variant="ghost">
                  Back
                </Button>
                <Button size="sm" onClick={nextStep}>
                  Next
                </Button>
              </HStack>
            </Stack>
          </StepContent>
        </Step>
        <Step title="Create an ad">
          <StepContent>
            <Stack shouldWrapChildren spacing="4">
              <Text>
                Try out different ad text to see what brings in the most
                customers, and learn how to enhance your ads using features like
                ad extensions. If you run into any problems with your ads, find
                out how to tell if they&apos;re running and how to resolve
                approval issues.
              </Text>
              <HStack>
                <Button size="sm" onClick={prevStep} variant="ghost">
                  Back
                </Button>
                <Button size="sm" onClick={nextStep}>
                  Finish
                </Button>
              </HStack>
            </Stack>
          </StepContent>
        </Step>
      </Steps>
      <HStack
        display={activeStep === 3 ? "flex" : "none"}
        mt="10"
        spacing="4"
        shouldWrapChildren
      >
        <Text>All steps completed - you&apos;re finished</Text>
        <Button
          size="sm"
          onClick={reset}
          variant="outline"
          verticalAlign="baseline"
        >
          Reset
        </Button>
      </HStack>
    </Box>
  );
};
