"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";

function getErrorMessage(error: unknown) {
  if (
    error &&
    typeof error === "object" &&
    "message" in error &&
    typeof error.message === "string"
  ) {
    return error.message;
  }

  return "Unexpected error. Please try again.";
}

export async function login(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    redirect("/login?error=Email%20and%20password%20are%20required.");
  }

  try {
    const supabase = await createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      redirect(`/login?error=${encodeURIComponent(error.message)}`);
    }
  } catch (error) {
    redirect(`/login?error=${encodeURIComponent(getErrorMessage(error))}`);
  }

  redirect("/dashboard");
}

export async function signup(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    redirect("/signup?error=Email%20and%20password%20are%20required.");
  }

  try {
    const supabase = await createClient();
    const requestOrigin = (await headers()).get("origin");
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
    const baseUrl = siteUrl ?? requestOrigin ?? "http://localhost:3000";
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${baseUrl}/auth/callback`,
      },
    });

    if (error) {
      redirect(`/signup?error=${encodeURIComponent(error.message)}`);
    }
  } catch (error) {
    redirect(`/signup?error=${encodeURIComponent(getErrorMessage(error))}`);
  }

  redirect("/login?message=Check%20your%20email%20to%20confirm%20your%20account.");
}

export async function logout() {
  try {
    const supabase = await createClient();
    await supabase.auth.signOut();
  } catch {
    // Fall through to login route.
  }

  redirect("/login");
}
