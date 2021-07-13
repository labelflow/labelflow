import { isArray } from "lodash/fp";

/**
 * Encode booleans as the presence or not of the param name in the url
 * Rather than with 0 and 1 like in `BooleanParam`
 * This gives simpler, more beautiful URLs like `/images` and `/images?modal-import`
 * Instead of `/images?modal-import=0` and `/images?modal-import=1`
 */
export const BoolParam = {
  encode: (bool: boolean | null | undefined): string | null | undefined => {
    if (!bool) {
      return undefined; // Don't show param name in URL at all
    }
    return null; // Show param name in URL, with no value
  },
  decode: (input: string | (string | null)[] | null | undefined) => {
    if (input !== undefined) {
      return true;
    }
    return false;
  },
};

export const IdParam = {
  encode: (id: string | null | undefined): string | null | undefined => {
    if (!id) {
      return undefined; // Don't show param name in URL at all
    }
    return id; // Show param name in URL, with no value
  },
  decode: (
    input: string | (string | null)[] | null | undefined
  ): string | undefined => {
    if (!input) return undefined;

    if (isArray(input)) return input[0] ?? undefined;

    return input;
  },
};
