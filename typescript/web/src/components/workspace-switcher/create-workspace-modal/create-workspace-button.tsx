import { Button } from "@chakra-ui/react";
import { FC } from "react";

export const CreateWorkspaceButton: FC<{
  isDisabled?: boolean;
  isLoading?: boolean;
}> = ({ isDisabled, isLoading }) => (
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
