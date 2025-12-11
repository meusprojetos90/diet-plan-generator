
import { stackServerApp } from "@/stack"
import { NextResponse, NextRequest } from "next/server"

export async function middleware(req: NextRequest) {
    // Stack middleware usually handles session refresh automatically if using stackServerApp.urls
    // API is accessible via stackServerApp.urls

    const user = await stackServerApp.getUser()
    const isLoggedIn = !!user

    const isOnDashboard = req.nextUrl.pathname.startsWith("/dashboard")
    const isOnAuth = req.nextUrl.pathname.startsWith("/handler") // Stack auth routes usually under /handler or handled by SDK components. 
    // Custom login page at /login? 
    // For now, let's assume we use Stack's prebuilt UI or redirection.
    // If user provided keys, they likely have the hosted UI enabled or local handlers.

    if (isOnDashboard && !isLoggedIn) {
        const redirectUrl = req.nextUrl.clone()
        redirectUrl.pathname = "/login" // Custom login route
        redirectUrl.searchParams.set("redirect_url", req.nextUrl.href)
        return NextResponse.redirect(redirectUrl)
    }

    return NextResponse.next()
}

export const config = {
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}
