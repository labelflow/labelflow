import { Button, ButtonProps } from "@chakra-ui/react";

export type CreateButtonProps = Pick<ButtonProps, "isDisabled" | "isLoading">;

export const CreateWorkspaceButton = ({
  isDisabled,
  isLoading,
}: CreateButtonProps) => (
  <Button
    width="full"
    type="submit"
    isDisabled={isDisabled}
    colorScheme="brand"
    aria-label="create workspace button"
    isLoading={isLoading}
  >
    Create
  </Button>
);
