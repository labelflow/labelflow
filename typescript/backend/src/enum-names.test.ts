import { InvitationResult } from "./labelflow";
import * as MODEL_ENUMS from "./model/enums";

const ENUM_ENTRIES = [...Object.entries(MODEL_ENUMS), InvitationResult];

describe("Enum names", () => {
  it.concurrent.each(ENUM_ENTRIES)("%s", async (_description, enumValue) => {
    Object.entries(enumValue).forEach(([key, value]) =>
      expect(key).toBe(value)
    );
  });
});
