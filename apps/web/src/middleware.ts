/**
 * NextAuth middleware. Защищает маршруты (app)/* — редиректит на /sign-in без сессии.
 * Авторизация обязательна, если задан AUTH_SECRET (т.е. это прод-режим).
 * Без AUTH_SECRET (демо/дев) — пропускаем, чтобы можно было посмотреть UI без почты.
 */
import { auth } from "@/server/auth";
import { NextResponse } from "next/server";

const authRequired = Boolean(process.env.AUTH_SECRET);

export default auth((req) => {
  const { nextUrl, auth: session } = req;
  const isAuthed = Boolean(session?.user);
  const isAppShell = nextUrl.pathname.startsWith("/today")
    || nextUrl.pathname.startsWith("/school")
    || nextUrl.pathname.startsWith("/ege")
    || nextUrl.pathname.startsWith("/habits")
    || nextUrl.pathname.startsWith("/friends")
    || nextUrl.pathname.startsWith("/profile-ai");
  const isSignIn = nextUrl.pathname.startsWith("/sign-in");

  if (authRequired && isAppShell && !isAuthed) {
    const signInUrl = new URL("/sign-in", nextUrl);
    signInUrl.searchParams.set("callbackUrl", nextUrl.pathname);
    return NextResponse.redirect(signInUrl);
  }
  if (authRequired && isSignIn && isAuthed) {
    return NextResponse.redirect(new URL("/today", nextUrl));
  }
  return NextResponse.next();
});

export const config = {
  matcher: [
    "/((?!api/auth|_next/static|_next/image|favicon.ico|fonts|images).*)",
  ],
};