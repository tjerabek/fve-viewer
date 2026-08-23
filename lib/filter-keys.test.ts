import { filterKeys } from "./filter-keys";

describe("filterKeys", () => {
  it("returns only the specified keys", () => {
    const result = filterKeys({ a: 1, b: 2, c: 3 }, ["a", "c"]);
    expect(result).toEqual({ a: 1, c: 3 });
  });

  it("ignores keys not present in the source object", () => {
    const result = filterKeys({ a: 1 }, ["a", "z"]);
    expect(result).toEqual({ a: 1 });
  });

  it("returns an empty object when no keys match", () => {
    const result = filterKeys({ a: 1, b: 2 }, ["x", "y"]);
    expect(result).toEqual({});
  });

  it("returns an empty object for an empty keys list", () => {
    const result = filterKeys({ a: 1 }, []);
    expect(result).toEqual({});
  });

  it("handles numeric values", () => {
    const result = filterKeys({ power: 1500, soc: 80, ignored: true }, ["power", "soc"]);
    expect(result).toEqual({ power: 1500, soc: 80 });
  });
});
