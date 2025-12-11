/**
 * Stripe Webhook Handler
 * Processes payment confirmations and activates the user plan
 */

import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { headers } from "next/headers";
import { processSuccessfulOrder } from "@/lib/orders";

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
        payment_intent,
        metadata,
        amount_total,
        currency
    } = session;

    console.log("Processing Checkout Session:", sessionId);

    // 1. Get Order ID from Metadata
    const orderId = metadata?.orderId;
    if (!orderId) {
        console.error("Missing orderId in metadata");
        return;
    }

    try {
        await processSuccessfulOrder(
            sessionId,
            payment_intent as string,
            orderId,
            amount_total,
            currency || "brl"
        );
    } catch (error) {
        console.error(`Error processing order ${orderId}:`, error);
    }
}
