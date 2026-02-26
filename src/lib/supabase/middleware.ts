import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

import { getSupabaseEnv } from "./env";

const protectedPrefixes = ["/dashboard", "/profile", "/hobby"];
const authPages = ["/login", "/signup"];

function isProtectedPath(pathname: string) {
  return protectedPrefixes.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
}

function isAuthPath(pathname: string) {
  return authPages.includes(pathname);
}

function redirectWithCookies(
  request: NextRequest,
  response: NextResponse,
  pathname: string,
) {
  const url = request.nextUrl.clone();
  url.pathname = pathname;
  url.search = "";

  const redirectResponse = NextResponse.redirect(url);
  response.cookies
    .getAll()
    .forEach(({ name, value }) => redirectResponse.cookies.set(name, value));

  return redirectResponse;
}

export async function updateSession(request: NextRequest) {
  const response = NextResponse.next({
    request,
  });
  const env = getSupabaseEnv();

  if (!env) {
    return response;
  }

  const supabase = createServerClient(env.supabaseUrl, env.supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options),
        );
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user && isProtectedPath(request.nextUrl.pathname)) {
    return redirectWithCookies(request, response, "/login");
  }

  if (user && isAuthPath(request.nextUrl.pathname)) {
    return redirectWithCookies(request, response, "/dashboard");
  }

  return response;
}
