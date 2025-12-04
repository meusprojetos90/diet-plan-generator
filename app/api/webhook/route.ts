/**
 * Stripe Webhook Handler
 * Processes payment confirmations and triggers PDF generation
 */

import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { headers } from "next/headers";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2025-02-24.acacia",
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: NextRequest) {
    try {
        const body = await req.text();
        const signature = headers().get("stripe-signature");

        if (!signature) {
            return NextResponse.json(
                { error: "Missing stripe-signature header" },
                { status: 400 }
            );
        }

        // Verify webhook signature
        let event: Stripe.Event;
        try {
            event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
        } catch (err) {
            console.error("Webhook signature verification failed:", err);
            return NextResponse.json(
                { error: "Invalid signature" },
                { status: 400 }
            );
        }

        // Handle the event
        switch (event.type) {
            case "checkout.session.completed":
                await handleCheckoutCompleted(event.data.object as Stripe.Checkout.Session);
                break;

            case "payment_intent.succeeded":
                console.log("Payment succeeded:", event.data.object.id);
                break;

            case "payment_intent.payment_failed":
                console.log("Payment failed:", event.data.object.id);
                break;

            default:
                console.log(`Unhandled event type: ${event.type}`);
        }

        return NextResponse.json({ received: true });
    } catch (error) {
        console.error("Webhook error:", error);
        return NextResponse.json(
            { error: "Webhook handler failed" },
            { status: 500 }
        );
    }
}

/**
 * Handle successful checkout
 */
async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
    const {
        id: sessionId,
        customer_email,
        payment_intent,
        metadata,
    } = session;

    const days = metadata?.days;
    const email = metadata?.customerEmail || customer_email;
    const customerName = metadata?.customerName;
    const intakeId = metadata?.intakeId;
    const currency = metadata?.currency || "USD";

    console.log("Checkout completed:", {
        sessionId,
        email,
        days,
        currency,
    });

    // TODO: Save order to database
    // TODO: Trigger background job for PDF generation
    // For now, we'll call the generate-pdf endpoint directly
    // In production, use a proper job queue (BullMQ, Inngest, etc.)

    try {
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_APP_URL}/api/generate-pdf`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-Internal-Secret": process.env.INTERNAL_API_SECRET || "",
                },
                body: JSON.stringify({
                    sessionId,
                    email,
                    customerName,
                    days: parseInt(days || "7"),
                    intakeId,
                    currency,
                    paymentIntentId: payment_intent,
                }),
            }
        );

        if (!response.ok) {
            console.error("Failed to trigger PDF generation:", await response.text());
        } else {
            console.log("PDF generation triggered successfully");
        }
    } catch (error) {
        console.error("Error triggering PDF generation:", error);
    }
}
