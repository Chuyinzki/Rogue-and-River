export const supportedHobbyTypes = [
  "swimming",
  "hiking",
  "workout",
  "reading",
  "gaming",
] as const;

export type HobbyType = (typeof supportedHobbyTypes)[number];

export const hobbyTitles: Record<HobbyType, string> = {
  swimming: "Swimming",
  hiking: "Hiking",
  workout: "Workouts",
  reading: "Reading",
  gaming: "Gaming",
};

export const hobbyDescriptions: Record<HobbyType, string> = {
  swimming: "Log sessions, track distance trends, and monitor your best swims.",
  hiking: "Track trails, distance, and hike duration over time.",
  workout: "Capture workout type, effort, and progress session by session.",
  reading: "Track books and pages read to keep your reading momentum visible.",
  gaming: "Log game sessions, playtime, and unlocked achievements.",
};

export function isHobbyType(value: string): value is HobbyType {
  return supportedHobbyTypes.includes(value as HobbyType);
}
