/**
 * PDF Generation API Route
 * Background job that generates full meal plan and sends via email
 */

import { NextRequest, NextResponse } from "next/server";
import { UserIntake } from "@/lib/prompts";
import { generatePDF } from "@/lib/pdf-generator";
import { sendEmail } from "@/lib/email";

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
        // For now, we'll use mock data
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
        // TODO: Replace with real OpenAI call in production
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

        // For now, we'll use a placeholder URL since we're not using S3
        // The PDF will be sent as an email attachment
        const pdfUrl = "#"; // Placeholder - PDF is attached to email

        // Send email with PDF attachment
        console.log("Sending email...");
        await sendEmail({
            to: email,
            subject:
                intake.locale === "pt-BR"
                    ? `Seu Plano Alimentar de ${days} dias está pronto!`
                    : `Your ${days}-day Meal Plan is ready!`,
            locale: intake.locale,
            customerName: intake.name,
            pdfUrl,
            pdfBuffer,
        });

        // TODO: Update order in database with pdf_url and status = 'completed'

        console.log("PDF generation completed successfully");

        return NextResponse.json({
            success: true,
            pdfUrl,
        });
    } catch (error) {
        console.error("PDF generation error:", error);

        // TODO: Update job status in database to 'failed'

        return NextResponse.json(
            {
                error: "Failed to generate PDF",
                details: error instanceof Error ? error.message : "Unknown error",
            },
            { status: 500 }
        );
    }
}
