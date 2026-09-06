import { NextRequest, NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";
import { apiRatelimit, authRatelimit } from "@/lib/ratelimit";

const adminRoute = '/admin';
const userRoutes = ['/sell-details', '/settings', '/profile'];

export async function proxy(request: NextRequest) {
    const pathname = request.nextUrl.pathname;
    const ip = request.headers.get("x-forwarded-for") ?? "127.0.0.1";
    if (pathname.startsWith("/api")) {
        const isAuthApi = pathname.startsWith("/api/auth");
        const limiter = isAuthApi ? authRatelimit : apiRatelimit;

        const { success, limit, remaining, reset } = await limiter.limit(ip);

        if (!success) {
            return new NextResponse(
                JSON.stringify({ error: "Too Many Requests" }), 
                {
                    status: 429,
                    headers: {
                        "Content-Type": "application/json",
                        "X-RateLimit-Limit": limit.toString(),
                        "X-RateLimit-Remaining": remaining.toString(),
                        "X-RateLimit-Reset": reset.toString(),
                    },
                }
            );
        }
    }

    //verification of the  routes//
    const isAdminRoute = pathname.startsWith(adminRoute);
    const isUserRoute = userRoutes.some(route => pathname.startsWith(route));

    if (!isAdminRoute && !isUserRoute) {
        return NextResponse.next();
    }

    const sessionCookie = getSessionCookie(request);
    if (!sessionCookie) {
        return NextResponse.redirect(new URL(`/sign-in?callbackUrl=${pathname}`, request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};