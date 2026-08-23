import { formatNumber } from "./formatNumber";

describe("formatNumber", () => {
  it("returns undefined for undefined input", () => {
    expect(formatNumber(undefined)).toBeUndefined();
  });

  it("formats zero correctly (not treated as falsy)", () => {
    expect(formatNumber(0)).toBe("0");
  });

  it("formats zero with digits", () => {
    expect(formatNumber(0, 1)).toBe("0,0");
  });

  it("formats a positive integer", () => {
    expect(formatNumber(1234)).toBe("1 234");
  });

  it("formats a decimal with specified digits", () => {
    expect(formatNumber(1.5, 1)).toBe("1,5");
  });

  it("rounds to specified digits", () => {
    expect(formatNumber(1.567, 2)).toBe("1,57");
  });

  it("formats large numbers with thousands separator", () => {
    expect(formatNumber(10000, 0)).toBe("10 000");
  });
});
