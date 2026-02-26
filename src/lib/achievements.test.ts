import { getAchievementCandidates } from "@/lib/achievements";
import type { HobbyLog } from "@/lib/hobby-metrics";

describe("achievement candidates", () => {
  it("awards reading milestones for finished books and pages", () => {
    const logs: HobbyLog[] = [
      {
        hobby_type: "reading",
        date: "2026-01-01",
        details: { book_title: "Book A", pages_read: 60, finished: true },
      },
      {
        hobby_type: "reading",
        date: "2026-01-02",
        details: { book_title: "Book B", pages_read: 50, finished: false },
      },
    ];

    const titles = getAchievementCandidates("reading", logs).map((c) => c.title);
    expect(titles).toContain("First book finished");
    expect(titles).toContain("100 pages read");
  });

  it("awards swim volume milestone at 5 logs", () => {
    const logs: HobbyLog[] = Array.from({ length: 5 }).map((_, idx) => ({
      hobby_type: "swimming",
      date: `2026-01-0${idx + 1}`,
      details: { distance_meters: 1000, duration_minutes: 30 },
    }));

    const titles = getAchievementCandidates("swimming", logs).map((c) => c.title);
    expect(titles).toContain("5 swims logged");
  });

  it("awards gaming hours milestone at 20 hours", () => {
    const logs: HobbyLog[] = [
      {
        hobby_type: "gaming",
        date: "2026-01-01",
        details: { game_name: "A", duration_minutes: 900 },
      },
      {
        hobby_type: "gaming",
        date: "2026-01-02",
        details: { game_name: "B", duration_minutes: 300 },
      },
    ];

    const titles = getAchievementCandidates("gaming", logs).map((c) => c.title);
    expect(titles).toContain("20 gaming hours");
  });
});
