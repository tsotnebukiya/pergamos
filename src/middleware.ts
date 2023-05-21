import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth((req) => {
  const path = req.nextUrl.pathname;
  const user = req.nextauth.token;
  if (path.startsWith("/dashboard/admin") && !user?.role.includes("admin")) {
    console.log("here");
    return NextResponse.redirect(new URL("/dashboard/forbidden", req.url));
  }
});

export const config = {
  matcher: ["/dashboard/:path*"],
};
