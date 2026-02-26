import {
  getCurrentStreakDays,
  getReadingPages,
  getSwimmingDistanceMeters,
} from "@/lib/hobby-metrics";

describe("hobby metrics", () => {
  it("returns 0 streak for empty date list", () => {
    expect(getCurrentStreakDays([])).toBe(0);
  });

  it("extracts reading pages safely", () => {
    expect(
      getReadingPages({
        hobby_type: "reading",
        date: "2026-01-01",
        details: { pages_read: 42 },
      }),
    ).toBe(42);
  });

  it("extracts swimming distance safely", () => {
    expect(
      getSwimmingDistanceMeters({
        hobby_type: "swimming",
        date: "2026-01-01",
        details: { distance_meters: 1500 },
      }),
    ).toBe(1500);
  });
});
