"use server";

import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";

type HobbyType = "swimming" | "hiking" | "workout" | "reading" | "gaming";

async function createLog({
  hobbyType,
  date,
  details,
}: {
  hobbyType: HobbyType;
  date: string;
  details: Record<string, unknown>;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { error } = await supabase.from("hobby_logs").insert({
    user_id: user.id,
    hobby_type: hobbyType,
    date,
    details,
  });

  if (error) {
    redirect(`/hobby/${hobbyType}?error=${encodeURIComponent(error.message)}`);
  }

  redirect(`/hobby/${hobbyType}?message=Log%20saved.`);
}

export async function createSwimmingLog(formData: FormData) {
  const date = String(formData.get("date") ?? "").trim();
  const distanceMeters = Number(formData.get("distance_meters") ?? 0);
  const durationMinutes = Number(formData.get("duration_minutes") ?? 0);
  const location = String(formData.get("location") ?? "").trim();

  if (!date || distanceMeters <= 0 || durationMinutes <= 0) {
    redirect(
      "/hobby/swimming?error=Date%2C%20distance%2C%20and%20duration%20are%20required.",
    );
  }

  await createLog({
    hobbyType: "swimming",
    date,
    details: {
      distance_meters: distanceMeters,
      duration_minutes: durationMinutes,
      location,
    },
  });
}

export async function createHikingLog(formData: FormData) {
  const date = String(formData.get("date") ?? "").trim();
  const distanceKm = Number(formData.get("distance_km") ?? 0);
  const durationMinutes = Number(formData.get("duration_minutes") ?? 0);
  const trail = String(formData.get("trail") ?? "").trim();

  if (!date || distanceKm <= 0 || durationMinutes <= 0) {
    redirect(
      "/hobby/hiking?error=Date%2C%20distance%2C%20and%20duration%20are%20required.",
    );
  }

  await createLog({
    hobbyType: "hiking",
    date,
    details: {
      distance_km: distanceKm,
      duration_minutes: durationMinutes,
      trail,
    },
  });
}

export async function createWorkoutLog(formData: FormData) {
  const date = String(formData.get("date") ?? "").trim();
  const workoutType = String(formData.get("workout_type") ?? "").trim();
  const durationMinutes = Number(formData.get("duration_minutes") ?? 0);
  const reps = Number(formData.get("reps") ?? 0);
  const weightKg = Number(formData.get("weight_kg") ?? 0);

  if (!date || !workoutType || durationMinutes <= 0) {
    redirect(
      "/hobby/workout?error=Date%2C%20workout%20type%2C%20and%20duration%20are%20required.",
    );
  }

  await createLog({
    hobbyType: "workout",
    date,
    details: {
      workout_type: workoutType,
      duration_minutes: durationMinutes,
      reps: reps > 0 ? reps : null,
      weight_kg: weightKg > 0 ? weightKg : null,
    },
  });
}

export async function createReadingLog(formData: FormData) {
  const date = String(formData.get("date") ?? "").trim();
  const bookTitle = String(formData.get("book_title") ?? "").trim();
  const pagesRead = Number(formData.get("pages_read") ?? 0);
  const notes = String(formData.get("notes") ?? "").trim();
  const finished = String(formData.get("finished") ?? "") === "on";

  if (!date || !bookTitle || pagesRead <= 0) {
    redirect(
      "/hobby/reading?error=Date%2C%20book%20title%2C%20and%20pages%20read%20are%20required.",
    );
  }

  await createLog({
    hobbyType: "reading",
    date,
    details: {
      book_title: bookTitle,
      pages_read: pagesRead,
      notes,
      finished,
    },
  });
}

export async function createGamingLog(formData: FormData) {
  const date = String(formData.get("date") ?? "").trim();
  const gameName = String(formData.get("game_name") ?? "").trim();
  const durationMinutes = Number(formData.get("duration_minutes") ?? 0);
  const achievement = String(formData.get("achievement") ?? "").trim();

  if (!date || !gameName || durationMinutes <= 0) {
    redirect(
      "/hobby/gaming?error=Date%2C%20game%20name%2C%20and%20duration%20are%20required.",
    );
  }

  await createLog({
    hobbyType: "gaming",
    date,
    details: {
      game_name: gameName,
      duration_minutes: durationMinutes,
      achievement,
    },
  });
}
