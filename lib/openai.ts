/**
 * OpenAI Integration for Meal Plan Generation
 */

import OpenAI from "openai";
import { generatePrompt, UserIntake, MealPlanOutput } from "./prompts";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Generate meal plan using OpenAI
 */
export async function generateMealPlan(
    intake: UserIntake,
    days: number
): Promise<MealPlanOutput> {
    const prompt = generatePrompt(intake, days);

    const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini", // or "gpt-4-turbo" for better quality
        messages: [
            {
                role: "system",
                content:
                    "You are a professional nutritionist. Always return valid JSON without markdown formatting.",
            },
            {
                role: "user",
                content: prompt,
            },
        ],
        temperature: 0.7,
        response_format: { type: "json_object" },
    });

    const content = completion.choices[0].message.content;
    if (!content) {
        throw new Error("No content returned from OpenAI");
    }

    try {
        const mealPlan = JSON.parse(content) as MealPlanOutput;
        return mealPlan;
    } catch (error) {
        console.error("Failed to parse OpenAI response:", content);
        throw new Error("Invalid JSON response from OpenAI");
    }
}

/**
 * Generate preview (1-day sample)
 */
export async function generatePreview(
    intake: UserIntake
): Promise<MealPlanOutput> {
    return generateMealPlan(intake, 1);
}
