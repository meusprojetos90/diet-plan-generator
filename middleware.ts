import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Middleware to detect user language and currency
 * Sets cookies for site_lang and site_currency
 */
export function middleware(req: NextRequest) {
    const acceptLanguage = req.headers.get("accept-language") || "";
    const languages = acceptLanguage
        .split(",")
        .map((l) => l.split(";")[0].trim());

    // Detect language
    let lang = "en";
    if (languages.find((l) => l.startsWith("pt"))) {
        lang = "pt-BR";
    }

    // Detect currency from geo location (Vercel provides req.geo)
    const country = req.geo?.country || "";
    let currency = "USD";

    // Brazil uses BRL
    if (country === "BR" || lang === "pt-BR") {
        currency = "BRL";
    }

    const response = NextResponse.next();

    // Set cookies for language and currency
    response.cookies.set("site_lang", lang, {
        path: "/",
        maxAge: 60 * 60 * 24 * 365, // 1 year
    });

    response.cookies.set("site_currency", currency, {
        path: "/",
        maxAge: 60 * 60 * 24 * 365, // 1 year
    });

    return response;
}

export const config = {
    matcher: [
        "/",
        "/quiz",
        "/preview",
        "/checkout/:path*",
        "/success",
        "/cancel",
    ],
};
