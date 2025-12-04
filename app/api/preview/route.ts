/**
 * Preview Generation API Route
 * Generates a 1-day sample meal plan
 */

import { NextRequest, NextResponse } from "next/server";
import { generatePreview } from "@/lib/openai";
import { UserIntake } from "@/lib/prompts";

export async function POST(req: NextRequest) {
    try {
        const intake: UserIntake = await req.json();

        // Validate intake data
        if (!intake.name || !intake.age || !intake.weight || !intake.height) {
            return NextResponse.json(
                { error: "Missing required fields" },
                { status: 400 }
            );
        }

        // Generate 1-day preview
        const preview = await generatePreview(intake);

        return NextResponse.json(preview);
    } catch (error) {
        console.error("Preview generation error:", error);
        return NextResponse.json(
            { error: "Failed to generate preview" },
            { status: 500 }
        );
    }
}
