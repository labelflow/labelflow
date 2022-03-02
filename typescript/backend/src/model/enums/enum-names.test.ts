import * as enums from ".";

describe("Enum names", () => {
  it.concurrent.each(Object.entries(enums))(
    "%s",
    async (_description, enumValue) => {
      Object.entries(enumValue).forEach(([key, value]) =>
        expect(key).toBe(value)
      );
    }
  );
});
