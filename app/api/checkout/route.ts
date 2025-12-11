/**
 * Stripe Checkout API Route
 * Creates a checkout session for meal plan purchase
 */

import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import pool from "@/lib/db";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2025-02-24.acacia",
});

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

type Currency = "BRL" | "USD";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const {
            days,
            customerEmail,
            customerName,
            customerPhone,
            currency,
            intakeId,
            intake,
            preview,
        }: {
            days: number;
            customerEmail: string;
            customerName: string;
            customerPhone?: string;
            currency: Currency;
            intakeId: string;
            intake?: any;
            preview?: any;
        } = body;

        // Validate input
        if (!days || !customerEmail || !currency) {
            return NextResponse.json(
                { error: "Missing required fields" },
                { status: 400 }
            );
        }

        // Get price from database by days
        const planResult = await pool.query(
            "SELECT price_brl, price_usd FROM plans WHERE days = $1 AND is_active = true",
            [days]
        );

        if (planResult.rows.length === 0) {
            return NextResponse.json(
                { error: "Plan not found" },
                { status: 404 }
            );
        }

        const planRow = planResult.rows[0];
        const price = currency === "BRL"
            ? parseFloat(planRow.price_brl)
            : parseFloat(planRow.price_usd);
        const unitAmount = price * 100; // Convert to cents

        // --- 1. Persist Pending Order to DB ---

        // A. Ensure Customer Exists
        let customerId: string;
        const customerRes = await pool.query(
            "SELECT id FROM customers WHERE email = $1",
            [customerEmail]
        );

        if (customerRes.rows.length > 0) {
            customerId = customerRes.rows[0].id;
            // Optional: Update phone if provided
            if (customerPhone) {
                await pool.query("UPDATE customers SET phone = $1 WHERE id = $2", [customerPhone, customerId]);
            }
        } else {
            const newCustomer = await pool.query(
                "INSERT INTO customers (name, email, locale, currency, phone) VALUES ($1, $2, $3, $4, $5) RETURNING id",
                [customerName || customerEmail.split("@")[0], customerEmail, intake?.locale || "en", currency, customerPhone || null]
            );
            customerId = newCustomer.rows[0].id;
        }

        // B. Save Intake (if not already saved with ID)
        let finalIntakeId = (intakeId && UUID_REGEX.test(intakeId)) ? intakeId : null;

        if (!finalIntakeId && intake) {
            const newIntake = await pool.query(
                "INSERT INTO intakes (customer_id, payload_json) VALUES ($1, $2) RETURNING id",
                [customerId, JSON.stringify(intake)]
            );
            finalIntakeId = newIntake.rows[0].id;
        }

        if (!finalIntakeId) {
            throw new Error("Could not create or retrieve intake ID");
        }

        // C. Create Pending Order
        const newOrder = await pool.query(
            `INSERT INTO orders (
                customer_id, intake_id, days, price, currency, status
            ) VALUES ($1, $2, $3, $4, $5, 'pending') RETURNING id`,
            [customerId, finalIntakeId, days, price, currency]
        );
        const orderId = newOrder.rows[0].id;

        // D. Save Meal Plan (linked to order)
        if (preview) {
            await pool.query(
                "INSERT INTO meal_plans (order_id, plan_json) VALUES ($1, $2)",
                [orderId, JSON.stringify(preview)]
            );
        }

        // --- 2. Create Stripe Session ---

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
                orderId: orderId,
                days: days.toString(),
                customerEmail,
                currency,
            },
        });

        // E. Update Order with Session ID
        await pool.query(
            "UPDATE orders SET stripe_session_id = $1 WHERE id = $2",
            [session.id, orderId]
        );

        return NextResponse.json({ url: session.url, sessionId: session.id });
    } catch (error) {
        console.error("Stripe checkout error:", error);
        return NextResponse.json(
            { error: "Failed to create checkout session" },
            { status: 500 }
        );
    }
}

