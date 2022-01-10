import { useColorModeValue as mode } from "@chakra-ui/react";
import { useCallback } from "react";
import { ToggleButton, ToggleButtonGroup } from "../toggle-button-group";
import { usePagination } from "./pagination.context";

export const PerPageInput = () => {
  const { perPage, perPageOptions, setPerPage } = usePagination();
  const handleChange = useCallback(
    (value: string) => setPerPage(parseInt(value, 10)),
    [setPerPage]
  );
  return (
    <ToggleButtonGroup value={perPage.toString()} onChange={handleChange}>
      {perPageOptions.map((value) => (
        <ToggleButton
          key={value}
          size="sm"
          value={value.toString()}
          description={`${value} items per page`}
          pointerEvents="initial"
          borderColor={mode("gray.100", "whiteAlpha.300")}
          _checked={{
            color: mode("inherit", "whiteAlpha.900"),
            bg: mode("gray.100", "whiteAlpha.300"),
          }}
        >
          {value}
        </ToggleButton>
      ))}
    </ToggleButtonGroup>
  );
};
