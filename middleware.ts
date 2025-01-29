import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const token = request.cookies.get("accessToken");
  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  try {
    const verifyResponse = await fetch(`${process.env.NEXT_PUBLIC_DJANGO_BACKEND_URL}token/verify/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ token: token.value }),
    });
    if (verifyResponse.status === 200) {
      return NextResponse.next();
    }
  } catch (error) {
    console.error("Error verifying token", error);
  }

  return NextResponse.redirect(new URL("/login", request.url));
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|login).*)"],
};
