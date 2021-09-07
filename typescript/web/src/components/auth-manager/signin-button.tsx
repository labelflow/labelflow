import { Button, ButtonProps, useBreakpointValue } from "@chakra-ui/react";
import { useQueryParam } from "use-query-params";
import { trackEvent } from "../../utils/google-analytics";
import { BoolParam } from "../../utils/query-param-bool";

type Props = ButtonProps;

export const SigninButton = ({ ...props }: Props) => {
  const [, setIsOpen] = useQueryParam("modal-signin", BoolParam);

  const buttonType = useBreakpointValue({
    base: "smallButton",
    lg: "largeButton",
  });

  if (buttonType === "null") return null;

  if (buttonType === "largeButton" || buttonType === "smallButton")
    return (
      <Button
        aria-label="Sign in"
        onClick={() => {
          trackEvent("signin_button_click", {});
          setIsOpen(true, "replaceIn");
        }}
        colorScheme="brand"
        variant="solid"
        loadingText="Loading"
        {...props}
      >
        Sign in
      </Button>
    );

  return null;
};
