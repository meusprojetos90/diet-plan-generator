import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { processSuccessfulOrder } from "@/lib/orders";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2025-02-24.acacia",
});

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const sessionId = searchParams.get("session_id");

    if (!sessionId) {
        return NextResponse.json({ error: "Missing session_id" }, { status: 400 });
    }

    try {
        console.log(`Verifying session ${sessionId}...`);

        // 1. Retrieve Session from Stripe to verify status
        const session = await stripe.checkout.sessions.retrieve(sessionId);

        if (session.payment_status !== "paid") {
            return NextResponse.json({
                error: "Payment not completed",
                status: session.payment_status
            }, { status: 400 });
        }

        // 2. Process Order (Idempotent)
        await processSuccessfulOrder(
            session.id,
            session.payment_intent as string,
            session.metadata?.orderId as string,
            session.amount_total,
            session.currency || "brl"
        );

        return NextResponse.json({ success: true, message: "Order processed successfully" });

    } catch (error) {
        console.error("Error verifying order:", error);
        return NextResponse.json(
            { error: "Failed to verify order" },
            { status: 500 }
        );
    }
}
