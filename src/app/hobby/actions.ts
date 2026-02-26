"use server";

import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";

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

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { error } = await supabase.from("hobby_logs").insert({
    user_id: user.id,
    hobby_type: "swimming",
    date,
    details: {
      distance_meters: distanceMeters,
      duration_minutes: durationMinutes,
      location,
    },
  });

  if (error) {
    redirect(`/hobby/swimming?error=${encodeURIComponent(error.message)}`);
  }

  redirect("/hobby/swimming?message=Swim%20saved.");
}
