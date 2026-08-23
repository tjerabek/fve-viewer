import { datediff } from "./datediff";

describe("datediff", () => {
  it("returns 0 for the same date", () => {
    const d = new Date(2023, 0, 9);
    expect(datediff(d, d)).toBe(0);
  });

  it("returns 1 for consecutive days", () => {
    const a = new Date(2023, 0, 9);
    const b = new Date(2023, 0, 10);
    expect(datediff(a, b)).toBe(1);
  });

  it("returns correct diff across months", () => {
    const a = new Date(2023, 0, 25);
    const b = new Date(2023, 1, 5);
    expect(datediff(a, b)).toBe(11);
  });

  it("returns correct diff across years", () => {
    const a = new Date(2023, 0, 1);
    const b = new Date(2024, 0, 1);
    expect(datediff(a, b)).toBe(365);
  });
});
