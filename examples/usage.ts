/**
 * Example Usage - Complete Flow
 * This file demonstrates how to use the diet plan generator
 */

import { generateMealPlan, generatePreview } from "@/lib/openai";
import { generatePDF } from "@/lib/pdf-generator";
import { UserIntake } from "@/lib/prompts";
import { writeFile } from "fs/promises";

/**
 * Example 1: Generate a preview (1-day sample)
 */
async function examplePreview() {
    const intake: UserIntake = {
        name: "João Silva",
        age: 30,
        weight: 75,
        height: 175,
        gender: "male",
        goal: "perder peso",
        restrictions: ["lactose"],
        style: "onívoro",
        activityLevel: "moderado",
        mealsPerDay: 4,
        preferredMealTimes: ["08:00", "12:00", "15:00", "19:00"],
        budget: "medium",
        cookingSkill: "intermediate",
        locale: "pt-BR",
    };

    console.log("Generating preview...");
    const preview = await generatePreview(intake);
    console.log("Preview generated:", JSON.stringify(preview, null, 2));

    return preview;
}

/**
 * Example 2: Generate full meal plan and PDF
 */
async function exampleFullPlan() {
    const intake: UserIntake = {
        name: "Sarah Johnson",
        age: 28,
        weight: 65,
        height: 165,
        gender: "female",
        goal: "gain muscle",
        restrictions: ["gluten"],
        style: "vegetarian",
        activityLevel: "intense",
        mealsPerDay: 5,
        preferredMealTimes: ["07:00", "10:00", "13:00", "16:00", "19:00"],
        budget: "high",
        cookingSkill: "advanced",
        locale: "en",
    };

    console.log("Generating 30-day meal plan...");
    const mealPlan = await generateMealPlan(intake, 30);

    console.log("Generating PDF...");
    const pdfBuffer = await generatePDF(mealPlan, {
        locale: intake.locale,
        customerName: intake.name,
        planDays: 30,
    });

    // Save to file
    await writeFile("./meal-plan-example.pdf", pdfBuffer);
    console.log("PDF saved to meal-plan-example.pdf");

    return { mealPlan, pdfBuffer };
}

/**
 * Example 3: Test API endpoints locally
 */
async function testAPIEndpoints() {
    const baseUrl = "http://localhost:3000";

    // 1. Generate preview
    console.log("Testing /api/preview...");
    const previewResponse = await fetch(`${baseUrl}/api/preview`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            name: "Test User",
            age: 25,
            weight: 70,
            height: 170,
            gender: "other",
            goal: "maintain weight",
            restrictions: [],
            style: "omnivore",
            activityLevel: "moderate",
            mealsPerDay: 3,
            locale: "en",
        }),
    });

    const preview = await previewResponse.json();
    console.log("Preview:", preview);

    // 2. Create checkout session
    console.log("\nTesting /api/checkout...");
    const checkoutResponse = await fetch(`${baseUrl}/api/checkout`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            days: "14",
            customerEmail: "test@example.com",
            customerName: "Test User",
            currency: "USD",
            intakeId: "test-intake-id",
        }),
    });

    const checkout = await checkoutResponse.json();
    console.log("Checkout URL:", checkout.url);

    return { preview, checkout };
}

/**
 * Example 4: Different user scenarios
 */
const exampleScenarios = {
    // Weight loss - Brazilian user
    weightLossBR: {
        name: "Maria Santos",
        age: 35,
        weight: 80,
        height: 160,
        gender: "female" as const,
        goal: "perder peso",
        restrictions: ["gluten", "lactose"],
        style: "vegetariano",
        activityLevel: "leve",
        mealsPerDay: 4,
        locale: "pt-BR" as const,
    },

    // Muscle gain - US user
    muscleGainUS: {
        name: "Mike Johnson",
        age: 25,
        weight: 75,
        height: 180,
        gender: "male" as const,
        goal: "gain muscle",
        restrictions: [],
        style: "omnivore",
        activityLevel: "intense",
        mealsPerDay: 6,
        locale: "en" as const,
    },

    // Vegan - Brazilian user
    veganBR: {
        name: "Ana Costa",
        age: 28,
        weight: 58,
        height: 165,
        gender: "female" as const,
        goal: "manter peso",
        restrictions: [],
        style: "vegano",
        activityLevel: "moderado",
        mealsPerDay: 4,
        locale: "pt-BR" as const,
    },

    // Keto - US user
    ketoUS: {
        name: "David Smith",
        age: 40,
        weight: 90,
        height: 175,
        gender: "male" as const,
        goal: "lose weight",
        restrictions: ["carbs"],
        style: "keto",
        activityLevel: "light",
        mealsPerDay: 3,
        locale: "en" as const,
    },
};

/**
 * Run examples
 */
async function main() {
    try {
        // Uncomment the example you want to run:

        // await examplePreview();
        // await exampleFullPlan();
        // await testAPIEndpoints();

        console.log("Example scenarios available:", Object.keys(exampleScenarios));
    } catch (error) {
        console.error("Error:", error);
    }
}

// Uncomment to run:
// main();

export {
    examplePreview,
    exampleFullPlan,
    testAPIEndpoints,
    exampleScenarios,
};
