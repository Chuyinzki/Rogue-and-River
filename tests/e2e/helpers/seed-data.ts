export type SeedEntry = Record<string, string | number | boolean>;

const marker = "[seed-v1]";

export const seedDataByHobby: Record<
  "swimming" | "hiking" | "workout" | "reading" | "gaming",
  SeedEntry[]
> = {
  swimming: [
    {
      date: "2026-01-20",
      distance_meters: 1600,
      duration_minutes: 38,
      location: `Community Pool ${marker}`,
    },
    {
      date: "2026-01-23",
      distance_meters: 1200,
      duration_minutes: 31,
      location: `University Pool ${marker}`,
    },
  ],
  hiking: [
    {
      date: "2026-01-12",
      distance_km: 5.4,
      duration_minutes: 110,
      trail: `Canyon Loop ${marker}`,
    },
    {
      date: "2026-01-19",
      distance_km: 8.1,
      duration_minutes: 160,
      trail: `River Ridge ${marker}`,
    },
  ],
  workout: [
    {
      date: "2026-01-14",
      workout_type: `Push Day ${marker}`,
      duration_minutes: 62,
      reps: 60,
      weight_kg: 42.5,
    },
    {
      date: "2026-01-21",
      workout_type: `Leg Day ${marker}`,
      duration_minutes: 55,
      reps: 48,
      weight_kg: 60,
    },
  ],
  reading: [
    {
      date: "2026-01-10",
      book_title: "The Left Hand of Darkness",
      pages_read: 60,
      notes: `Great world-building ${marker}`,
      finished: false,
    },
    {
      date: "2026-01-24",
      book_title: "The Great Gatsby",
      pages_read: 180,
      notes: `Completed for class ${marker}`,
      finished: true,
    },
  ],
  gaming: [
    {
      date: "2026-01-08",
      game_name: "Hades",
      duration_minutes: 95,
      achievement: `Escaped Tartarus ${marker}`,
    },
    {
      date: "2026-01-17",
      game_name: "Celeste",
      duration_minutes: 80,
      achievement: `Reached Summit ${marker}`,
    },
  ],
};
