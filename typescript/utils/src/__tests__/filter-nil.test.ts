import { filterNil } from "..";

const VALUE = [undefined, null, "", 0, false, "foobar"];
const EXPECTED = ["", 0, false, "foobar"];

describe("filterNil", () => {
  it("removes null or undefined values from the array", () => {
    expect(filterNil(VALUE)).toEqual(EXPECTED);
  });
});
