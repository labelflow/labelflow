import { useHotkeys, Options as ReactHotkeysOptions } from "react-hotkeys-hook";
import { keymap } from "../keymap";

export const useSearchHotkeys = (
  onKey: () => void,
  options: ReactHotkeysOptions = {},
  deps: unknown[] = []
) =>
  useHotkeys(
    // "/" key doesn't seem to be recognized on AZERTY keyboards, so we use "*" to catch any input.
    "*",
    (keyboardEvent) => {
      const isKey = keymap.focusLabelClassSearch.key
        .split(",")
        .includes(keyboardEvent.key);
      if (!isKey) return;
      keyboardEvent.preventDefault();
      onKey();
    },
    options,
    [onKey, ...deps]
  );
