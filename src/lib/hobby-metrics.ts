import type { HobbyType } from "@/lib/hobby-config";

export type HobbyLog = {
  hobby_type: HobbyType;
  date: string;
  details: Record<string, unknown> | null;
};

function toDayStamp(date: string) {
  const [year, month, day] = date.split("-").map(Number);
  return Date.UTC(year, (month ?? 1) - 1, day ?? 1);
}

function toDateString(stamp: number) {
  const d = new Date(stamp);
  const year = d.getUTCFullYear();
  const month = String(d.getUTCMonth() + 1).padStart(2, "0");
  const day = String(d.getUTCDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function getCurrentStreakDays(dates: string[]) {
  const uniqueDates = new Set(dates);
  const today = new Date();
  const todayStamp = Date.UTC(
    today.getUTCFullYear(),
    today.getUTCMonth(),
    today.getUTCDate(),
  );
  const yesterdayStamp = todayStamp - 86400000;
  let cursor = uniqueDates.has(toDateString(todayStamp))
    ? todayStamp
    : uniqueDates.has(toDateString(yesterdayStamp))
      ? yesterdayStamp
      : null;

  if (!cursor) {
    return 0;
  }

  let streak = 0;
  while (uniqueDates.has(toDateString(cursor))) {
    streak += 1;
    cursor -= 86400000;
  }

  return streak;
}

export function getSwimmingDistanceMeters(log: HobbyLog) {
  return Number(log.details?.distance_meters ?? 0);
}

export function getHikingDistanceKm(log: HobbyLog) {
  return Number(log.details?.distance_km ?? 0);
}

export function getWorkoutDurationMinutes(log: HobbyLog) {
  return Number(log.details?.duration_minutes ?? 0);
}

export function getReadingPages(log: HobbyLog) {
  return Number(log.details?.pages_read ?? 0);
}

export function getGamingDurationMinutes(log: HobbyLog) {
  return Number(log.details?.duration_minutes ?? 0);
}

export function sortByDateDesc<T extends { date: string }>(logs: T[]) {
  return [...logs].sort((a, b) => toDayStamp(b.date) - toDayStamp(a.date));
}
