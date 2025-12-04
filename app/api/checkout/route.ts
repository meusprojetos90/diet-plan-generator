/**
 * Stripe Checkout API Route
 * Creates a checkout session for meal plan purchase
 */

import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { getPrice, Currency, PlanDuration } from "@/lib/prices";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2024-11-20.acacia",
});

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const {
            days,
            customerEmail,
            customerName,
            currency,
            intakeId,
        }: {
            days: PlanDuration;
            customerEmail: string;
            customerName: string;
            currency: Currency;
            intakeId: string;
        } = body;

        // Validate input
        if (!days || !customerEmail || !currency) {
            return NextResponse.json(
                { error: "Missing required fields" },
                { status: 400 }
            );
        }

        // Get price for the selected plan
        const price = getPrice(currency, days);
        const unitAmount = price * 100; // Convert to cents

        // Create Stripe Checkout Session
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            line_items: [
                {
                    price_data: {
                        currency: currency.toLowerCase(),
                        product_data: {
                            name:
                                currency === "BRL"
                                    ? `Plano Alimentar ${days} dias`
                                    : `Meal Plan ${days} days`,
                            description:
                                currency === "BRL"
                                    ? `Plano alimentar personalizado para ${days} dias`
                                    : `Personalized meal plan for ${days} days`,
                        },
                        unit_amount: Math.round(unitAmount),
                    },
                    quantity: 1,
                },
            ],
            mode: "payment",
            success_url: `${process.env.NEXT_PUBLIC_APP_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/cancel`,
            customer_email: customerEmail,
            metadata: {
                days: days.toString(),
                customerEmail,
                customerName: customerName || "",
                intakeId: intakeId || "",
                currency,
            },
        });

        return NextResponse.json({ url: session.url, sessionId: session.id });
    } catch (error) {
        console.error("Stripe checkout error:", error);
        return NextResponse.json(
            { error: "Failed to create checkout session" },
            { status: 500 }
        );
    }
}
