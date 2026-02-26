import { getCurrentStreakDays, type HobbyLog, type HobbyType } from "@/lib/hobby-metrics";

type AchievementCandidate = {
  hobbyType: HobbyType;
  title: string;
  description: string;
};

function getAchievementCandidates(hobbyType: HobbyType, logs: HobbyLog[]) {
  const candidates: AchievementCandidate[] = [];

  if (hobbyType === "swimming" && logs.length >= 5) {
    candidates.push({
      hobbyType,
      title: "5 swims logged",
      description: "Logged at least 5 swimming sessions.",
    });
  }

  if (hobbyType === "reading") {
    const totalPages = logs.reduce(
      (sum, log) => sum + Number(log.details?.pages_read ?? 0),
      0,
    );
    const finishedCount = logs.filter((log) => log.details?.finished === true).length;

    if (finishedCount >= 1) {
      candidates.push({
        hobbyType,
        title: "First book finished",
        description: "Marked your first completed book.",
      });
    }

    if (totalPages >= 100) {
      candidates.push({
        hobbyType,
        title: "100 pages read",
        description: "Read at least 100 pages in total.",
      });
    }
  }

  if (hobbyType === "hiking") {
    const streak = getCurrentStreakDays(logs.map((log) => log.date));
    if (streak >= 21) {
      candidates.push({
        hobbyType,
        title: "3-week hiking streak",
        description: "Maintained a 21-day hiking streak.",
      });
    }
  }

  if (hobbyType === "workout" && logs.length >= 10) {
    candidates.push({
      hobbyType,
      title: "10 workouts logged",
      description: "Completed and logged 10 workout sessions.",
    });
  }

  if (hobbyType === "gaming") {
    const totalMinutes = logs.reduce(
      (sum, log) => sum + Number(log.details?.duration_minutes ?? 0),
      0,
    );
    if (totalMinutes >= 1200) {
      candidates.push({
        hobbyType,
        title: "20 gaming hours",
        description: "Played and tracked at least 20 total hours.",
      });
    }
  }

  return candidates;
}

export async function awardAchievementsForHobby({
  supabase,
  userId,
  hobbyType,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  supabase: any;
  userId: string;
  hobbyType: HobbyType;
}) {
  const { data: logsData } = await supabase
    .from("hobby_logs")
    .select("hobby_type, date, details")
    .eq("user_id", userId)
    .eq("hobby_type", hobbyType);

  const logs = (logsData ?? []) as HobbyLog[];
  const candidates = getAchievementCandidates(hobbyType, logs);
  if (candidates.length === 0) {
    return;
  }

  const titles = candidates.map((c) => c.title);
  const { data: existingData } = await supabase
    .from("achievements")
    .select("title")
    .eq("user_id", userId)
    .eq("hobby_type", hobbyType)
    .in("title", titles);

  const existingTitles = new Set(
    ((existingData ?? []) as Array<{ title: string }>).map((row) => row.title),
  );

  const toInsert = candidates
    .filter((candidate) => !existingTitles.has(candidate.title))
    .map((candidate) => ({
      user_id: userId,
      hobby_type: candidate.hobbyType,
      title: candidate.title,
      description: candidate.description,
    }));

  if (toInsert.length > 0) {
    await supabase.from("achievements").insert(toInsert);
  }
}
