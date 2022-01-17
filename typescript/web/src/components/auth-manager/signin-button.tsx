import { Button, ButtonProps, useBreakpointValue } from "@chakra-ui/react";
import React, { useCallback } from "react";
import { useQueryParam } from "use-query-params";
import { trackEvent } from "../../utils/google-analytics";
import { BoolParam } from "../../utils/query-param-bool";

export const SigninButton = ({ ...props }: ButtonProps) => {
  const [, setIsOpen] = useQueryParam("modal-signin", BoolParam);

  const handleOpen = useCallback(() => {
    setIsOpen(true, "replaceIn");
    trackEvent("signin_button_click", {});
  }, [setIsOpen]);

  const buttonType = useBreakpointValue({
    base: "smallButton",
    lg: "largeButton",
  });

  if (buttonType === "null") return null;

  if (buttonType === "largeButton" || buttonType === "smallButton")
    return (
      <Button
        aria-label="Sign in"
        onClick={handleOpen}
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
