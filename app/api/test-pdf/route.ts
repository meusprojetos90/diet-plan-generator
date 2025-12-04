/**
 * Test endpoint to manually trigger PDF generation
 * Use this for testing without needing Stripe webhook
 */

import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { email, sessionId } = body;

        if (!email) {
            return NextResponse.json(
                { error: "Email is required" },
                { status: 400 }
            );
        }

        console.log("Triggering PDF generation for test...");

        // Call the generate-pdf endpoint
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/generate-pdf`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-Internal-Secret": process.env.INTERNAL_API_SECRET || "test-secret-123",
                },
                body: JSON.stringify({
                    sessionId: sessionId || `test-${Date.now()}`,
                    email,
                    customerName: "Cliente Teste",
                    days: 7,
                    intakeId: "test",
                    currency: "BRL",
                    paymentIntentId: "test",
                }),
            }
        );

        if (!response.ok) {
            const error = await response.text();
            console.error("Failed to generate PDF:", error);
            return NextResponse.json(
                { error: "Failed to generate PDF", details: error },
                { status: 500 }
            );
        }

        const result = await response.json();
        return NextResponse.json({
            success: true,
            message: "PDF generation started",
            ...result,
        });
    } catch (error) {
        console.error("Test trigger error:", error);
        return NextResponse.json(
            {
                error: "Failed to trigger PDF generation",
                details: error instanceof Error ? error.message : "Unknown error",
            },
            { status: 500 }
        );
    }
}
