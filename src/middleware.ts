import { NextRequest, NextResponse } from "next/server";

import { getUser } from "./actions/user_actions";

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const token = getTokenFromStorage(request);
  const userData = await getUser();

  const isRootPath = path === "/";
  
  if (token && (path === "/login" || path === "/signup")) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

function getTokenFromStorage(request: NextRequest) {
  const cookies = request.cookies;
  // console.log("====cookies are coming here =======>",cookies, "===========>")
  const token = cookies.get("token");
  return token;
}

export const config = {
  matcher: [
    "/login",
    "/signup",
    "/",
    "/project",
  ],
};
