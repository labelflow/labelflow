import { pascalCase } from "change-case";
import { RedisEvent } from ".";

describe("RedisEvents", () => {
  it("uses PascalCase for keys and values", () => {
    Object.entries(RedisEvent).forEach(([key, value]) => {
      expect(key).toBe(pascalCase(key));
      expect(value).toBe(pascalCase(key));
    });
  });
});
