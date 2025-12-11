/**
 * PDF Generation API Route
 * Background job that generates full meal plan and sends via email
 */

import { NextRequest, NextResponse } from "next/server";
import { UserIntake } from "@/lib/prompts";
import { generatePDF } from "@/lib/pdf-generator";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
const EMAIL_FROM = process.env.EMAIL_FROM || 'Cool Plan <noreply@replay.velare.app>';

export async function POST(req: NextRequest) {
    try {
        // Verify internal secret to prevent unauthorized access
        const secret = req.headers.get("X-Internal-Secret");
        if (secret !== process.env.INTERNAL_API_SECRET) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const {
            sessionId,
            email,
            customerName,
            days,
            intakeId,
            currency,
            paymentIntentId,
        } = body;

        console.log("Starting PDF generation for:", { email, days });

        // TODO: Fetch intake data from database using intakeId
        const intake: UserIntake = {
            name: customerName || "Cliente",
            age: 30,
            weight: 70,
            height: 170,
            gender: "other",
            goals: currency === "BRL" ? ["perder peso"] : ["lose weight"],
            restrictions: [],
            style: currency === "BRL" ? "onívoro" : "omnivore",
            activityLevel: currency === "BRL" ? "moderado" : "moderate",
            mealsPerDay: 4,
            locale: currency === "BRL" ? "pt-BR" : "en",
        };

        // Generate full meal plan using MOCK DATA for testing
        console.log("Generating meal plan with MOCK data (for testing)...");
        const { generateMockMealPlan } = await import("@/lib/mock-data");
        const mealPlan = generateMockMealPlan(intake, days);

        // Generate PDF
        console.log("Generating PDF...");
        const pdfBuffer = await generatePDF(mealPlan, {
            locale: intake.locale,
            customerName: intake.name,
            planDays: days,
        });

        // Send email with PDF attachment
        console.log("Sending email...");
        const isPtBr = intake.locale === "pt-BR";

        await resend.emails.send({
            from: EMAIL_FROM,
            to: email,
            subject: isPtBr
                ? `Seu Plano Alimentar de ${days} dias está pronto!`
                : `Your ${days}-day Meal Plan is ready!`,
            html: `
                <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
                    <h1>${isPtBr ? "Olá" : "Hello"}, ${intake.name}! 👋</h1>
                    <p>${isPtBr ? "Seu plano alimentar está pronto!" : "Your meal plan is ready!"}</p>
                    <p>${isPtBr ? "O PDF está em anexo neste email." : "The PDF is attached to this email."}</p>
                </div>
            `,
            attachments: [
                {
                    filename: `meal-plan-${days}days.pdf`,
                    content: pdfBuffer.toString("base64"),
                },
            ],
        });

        console.log("PDF generation completed successfully");

        return NextResponse.json({
            success: true,
            pdfUrl: "#",
        });
    } catch (error) {
        console.error("PDF generation error:", error);

        return NextResponse.json(
            {
                error: "Failed to generate PDF",
                details: error instanceof Error ? error.message : "Unknown error",
            },
            { status: 500 }
        );
    }
}

