import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const url = request.nextUrl.pathname;

  // 1. Basic Path Traversal Protection
  if (url.includes("..") || url.includes("%2e%2e")) {
    return new NextResponse("Bad Request - Malformed Path", { status: 400 });
  }

  const response = NextResponse.next();

  // 2. Enforce Security Headers on dynamic responses
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=(), payment=()"
  );
  response.headers.set("X-XSS-Protection", "1; mode=block");

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except static files (_next/static, _next/image, favicon.ico, images/)
     */
    "/((?!_next/static|_next/image|favicon.ico|images/).*)",
  ],
};
