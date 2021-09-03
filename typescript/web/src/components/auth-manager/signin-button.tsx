import {
  Button,
  ButtonProps,
  Tooltip,
  IconButton,
  chakra,
  useBreakpointValue,
} from "@chakra-ui/react";
import { useQueryParam } from "use-query-params";
import { RiLoginCircleLine } from "react-icons/ri";
import { trackEvent } from "../../utils/google-analytics";
import { BoolParam } from "../../utils/query-param-bool";

const SigninIcon = chakra(RiLoginCircleLine);

type Props = ButtonProps;

export const SigninButton = ({ ...props }: Props) => {
  const [, setIsOpen] = useQueryParam("modal-signin", BoolParam);

  const buttonType = useBreakpointValue({
    base: "smallButton",
    lg: "largeButton",
  });

  if (buttonType === "null") return null;
  if (buttonType === "smallButton")
    return (
      <Tooltip label="Sign in" openDelay={300}>
        <IconButton
          aria-label="Sign in"
          icon={<SigninIcon fontSize="xl" />}
          onClick={() => {
            trackEvent("signin_button_click", {});
            setIsOpen(true, "replaceIn");
          }}
          colorScheme="brand"
          variant="solid"
          {...props}
        />
      </Tooltip>
    );

  if (buttonType === "largeButton")
    return (
      <Button
        aria-label="Sign in"
        leftIcon={<SigninIcon fontSize="xl" />}
        onClick={() => {
          trackEvent("signin_button_click", {});
          setIsOpen(true, "replaceIn");
        }}
        colorScheme="brand"
        variant="solid"
        {...props}
      >
        Sign in
      </Button>
    );

  return null;
};
