import { useColorModeValue } from "@chakra-ui/react";
import { useCallback } from "react";
import { ToggleButton, ToggleButtonGroup } from "../toggle-button-group";
import { usePagination } from "./pagination.context";

export const PerPageInput = () => {
  const { perPage, perPageOptions, setPerPage } = usePagination();
  const handleChange = useCallback(
    (value: string) => setPerPage(parseInt(value, 10)),
    [setPerPage]
  );
  const optionsBorderColor = useColorModeValue("gray.100", "whiteAlpha.300");
  const optionsCheckedColor = useColorModeValue("inherit", "whiteAlpha.900");
  const optionsCheckedBgColor = useColorModeValue("gray.100", "whiteAlpha.300");
  return (
    <ToggleButtonGroup value={perPage.toString()} onChange={handleChange}>
      {perPageOptions.map((value) => (
        <ToggleButton
          key={value}
          size="sm"
          value={value.toString()}
          description={`${value} items per page`}
          pointerEvents="initial"
          borderColor={optionsBorderColor}
          _checked={{ color: optionsCheckedColor, bg: optionsCheckedBgColor }}
        >
          {value}
        </ToggleButton>
      ))}
    </ToggleButtonGroup>
  );
};
