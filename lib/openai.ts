/**
 * OpenAI Integration for Meal Plan Generation
 */

import OpenAI from "openai";
import { generatePrompt, UserIntake, MealPlanOutput } from "./prompts";
import pool from "./db";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

// Pricing per 1M tokens (estimates)
const PRICING: Record<string, { input: number; output: number }> = {
    "gpt-5-mini": { input: 0.15, output: 0.60 },
    "gpt-4o-mini": { input: 0.15, output: 0.60 },
};

/**
 * Log AI usage to database
 */
async function logAIUsage(
    model: string,
    operation: string,
    promptTokens: number,
    completionTokens: number,
    orderId?: string
) {
    try {
        const pricing = PRICING[model as keyof typeof PRICING] || PRICING["gpt-4o-mini"];
        const cost = (promptTokens * pricing.input + completionTokens * pricing.output) / 1_000_000;

        await pool.query(`
            INSERT INTO ai_usage_logs (order_id, operation, model, tokens_input, tokens_output, cost_usd)
            VALUES ($1, $2, $3, $4, $5, $6)
        `, [orderId || null, operation, model, promptTokens, completionTokens, cost]);

        console.log(`AI Usage logged: ${model}, ${promptTokens + completionTokens} tokens, $${cost.toFixed(6)}`);
    } catch (error) {
        console.error("Failed to log AI usage:", error);
    }
}

/**
 * Generate meal plan using OpenAI
 */
export async function generateMealPlan(
    intake: UserIntake,
    days: number,
    orderId?: string
): Promise<MealPlanOutput> {
    const prompt = generatePrompt(intake, days);
    const model = "gpt-5-mini";

    const completion = await openai.chat.completions.create({
        model,
        messages: [
            {
                role: "system",
                content:
                    "Você é um nutricionista e personal trainer profissional brasileiro. Sempre retorne JSON válido e completo.",
            },
            {
                role: "user",
                content: prompt,
            },
        ],
        response_format: { type: "json_object" },
        max_completion_tokens: 16000,
    });

    // Log usage
    if (completion.usage) {
        await logAIUsage(
            model,
            `generate_meal_plan_${days}d`,
            completion.usage.prompt_tokens,
            completion.usage.completion_tokens,
            orderId
        );
    }

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
    intake: UserIntake,
    orderId?: string
): Promise<MealPlanOutput> {
    return generateMealPlan(intake, 1, orderId);
}

