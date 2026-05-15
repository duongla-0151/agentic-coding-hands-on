import createMiddleware from "next-intl/middleware";
import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { routing } from "@/i18n/routing";

const intlMiddleware = createMiddleware(routing);

const LOCALE_PATTERN = /^\/(vi|en)/;

function getLocale(pathname: string): string {
  return pathname.match(LOCALE_PATTERN)?.[1] ?? routing.defaultLocale;
}

function stripLocale(pathname: string): string {
  return pathname.replace(LOCALE_PATTERN, "") || "/";
}

async function createSupabaseForMiddleware(request: NextRequest, response: NextResponse) {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll: (cookiesToSet) => {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
        },
      },
    }
  );
}

async function getUser(request: NextRequest, response: NextResponse) {
  const supabase = await createSupabaseForMiddleware(request, response);
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

export default async function proxy(request: NextRequest) {
  const response = intlMiddleware(request);
  const { pathname } = request.nextUrl;
  const pathWithoutLocale = stripLocale(pathname);
  const locale = getLocale(pathname);

  const user = await getUser(request, response);

  // Authenticated users trying to access login → redirect to home
  if (pathWithoutLocale === "/login" && user) {
    return NextResponse.redirect(new URL(`/${locale}`, request.url));
  }

  // Unauthenticated users trying to access home → redirect to login
  if (pathWithoutLocale === "/" && !user) {
    return NextResponse.redirect(new URL(`/${locale}/login`, request.url));
  }

  // Protect /admin/* routes — check role only if user is authenticated
  if (pathWithoutLocale.startsWith("/admin")) {
    if (!user) {
      return NextResponse.redirect(new URL(`/${locale}/login`, request.url));
    }
    const supabase = await createSupabaseForMiddleware(request, response);
    const { data: isAdmin } = await supabase.rpc("is_super_admin");
    if (!isAdmin) {
      return NextResponse.redirect(new URL(`/${locale}/403`, request.url));
    }
  }

  return response;
}

export const config = {
  matcher: ["/((?!_next|_vercel|favicon.ico|api|auth|.*\\..*).*)"],
};
