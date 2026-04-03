import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function proxy(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Must be called before any redirect logic to keep the session fresh.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;

  // ── Route classification ────────────────────────────────────────
  const isAuthRoute  = pathname.startsWith("/login") || pathname.startsWith("/signup");
  const isStaffRoute = pathname.startsWith("/staff");
  const isConfirm    = pathname.startsWith("/auth/confirm");
  const isInternal   =
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon") ||
    isConfirm;
  const isMemberRoute = !isAuthRoute && !isStaffRoute && !isInternal && pathname !== "/";

  // ── Not logged in ───────────────────────────────────────────────
  if (!user) {
    if (isMemberRoute || isStaffRoute) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    return supabaseResponse;
  }

  // ── Logged in: resolve which portal this user belongs to ────────
  // Runs only on routes that need role awareness to avoid excess DB calls.
  if (isAuthRoute || isStaffRoute || isMemberRoute) {
    const { data: memberProfile } = await supabase
      .from("profiles")
      .select("id")
      .eq("id", user.id)
      .maybeSingle();

    const isMember = !!memberProfile; // member or peer_ambassador
    const isStaff  = !isMember;

    // Already logged-in → redirect away from auth pages
    if (isAuthRoute) {
      const dest = isMember ? "/home" : "/staff/dashboard";
      return NextResponse.redirect(new URL(dest, request.url));
    }

    // Staff trying to access the member app
    if (isStaff && isMemberRoute) {
      return NextResponse.redirect(new URL("/staff/dashboard", request.url));
    }

    // Member trying to access the staff portal
    if (isMember && isStaffRoute) {
      return NextResponse.redirect(new URL("/home", request.url));
    }
  }

  return supabaseResponse;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
