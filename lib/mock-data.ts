/**
 * Mock data generator for testing PDF generation
 */

import { MealPlanOutput, UserIntake } from "./prompts";

export function generateMockMealPlan(
    intake: UserIntake,
    days: number
): MealPlanOutput {
    const mockDays = [];

    for (let i = 1; i <= days; i++) {
        mockDays.push({
            day: i,
            date: new Date(Date.now() + i * 24 * 60 * 60 * 1000).toLocaleDateString(
                intake.locale
            ),
            meals: [
                {
                    time: intake.locale === "pt-BR" ? "Café da Manhã" : "Breakfast",
                    name: intake.locale === "pt-BR" ? "Omelete com Aveia" : "Omelette with Oats",
                    recipe:
                        intake.locale === "pt-BR"
                            ? "Bata os ovos, adicione sal e pimenta. Cozinhe em fogo médio. Sirva com aveia."
                            : "Beat the eggs, add salt and pepper. Cook on medium heat. Serve with oats.",
                    ingredients: [
                        { item: intake.locale === "pt-BR" ? "Ovos" : "Eggs", quantity: "2", unit: "" },
                        { item: intake.locale === "pt-BR" ? "Aveia" : "Oats", quantity: "30", unit: "g" },
                    ],
                    macros: { calories: 350, protein: 20, carbs: 30, fat: 15 },
                    preparation_time: 15,
                    difficulty: "easy" as const,
                },
                {
                    time: intake.locale === "pt-BR" ? "Almoço" : "Lunch",
                    name: intake.locale === "pt-BR" ? "Frango Grelhado com Arroz" : "Grilled Chicken with Rice",
                    recipe:
                        intake.locale === "pt-BR"
                            ? "Tempere o frango e grelhe. Cozinhe o arroz. Sirva com salada."
                            : "Season the chicken and grill. Cook the rice. Serve with salad.",
                    ingredients: [
                        { item: intake.locale === "pt-BR" ? "Peito de frango" : "Chicken breast", quantity: "150", unit: "g" },
                        { item: intake.locale === "pt-BR" ? "Arroz integral" : "Brown rice", quantity: "80", unit: "g" },
                    ],
                    macros: { calories: 450, protein: 40, carbs: 50, fat: 10 },
                    preparation_time: 30,
                    difficulty: "medium" as const,
                },
                {
                    time: intake.locale === "pt-BR" ? "Jantar" : "Dinner",
                    name: intake.locale === "pt-BR" ? "Salmão com Legumes" : "Salmon with Vegetables",
                    recipe:
                        intake.locale === "pt-BR"
                            ? "Asse o salmão no forno. Refogue os legumes. Sirva quente."
                            : "Bake the salmon in the oven. Sauté the vegetables. Serve hot.",
                    ingredients: [
                        { item: intake.locale === "pt-BR" ? "Salmão" : "Salmon", quantity: "120", unit: "g" },
                        { item: intake.locale === "pt-BR" ? "Brócolis" : "Broccoli", quantity: "100", unit: "g" },
                    ],
                    macros: { calories: 400, protein: 35, carbs: 20, fat: 20 },
                    preparation_time: 25,
                    difficulty: "medium" as const,
                },
            ],
            total_calories: 1200,
            total_macros: { calories: 1200, protein: 95, carbs: 100, fat: 45 },
        });
    }

    return {
        days: mockDays,
        shopping_list: [
            {
                item: intake.locale === "pt-BR" ? "Ovos" : "Eggs",
                quantity: `${days * 2}`,
                category: intake.locale === "pt-BR" ? "Proteínas" : "Proteins",
            },
            {
                item: intake.locale === "pt-BR" ? "Peito de frango" : "Chicken breast",
                quantity: `${days * 150}g`,
                category: intake.locale === "pt-BR" ? "Proteínas" : "Proteins",
            },
            {
                item: intake.locale === "pt-BR" ? "Salmão" : "Salmon",
                quantity: `${days * 120}g`,
                category: intake.locale === "pt-BR" ? "Proteínas" : "Proteins",
            },
            {
                item: intake.locale === "pt-BR" ? "Arroz integral" : "Brown rice",
                quantity: `${days * 80}g`,
                category: intake.locale === "pt-BR" ? "Carboidratos" : "Carbs",
            },
            {
                item: intake.locale === "pt-BR" ? "Aveia" : "Oats",
                quantity: `${days * 30}g`,
                category: intake.locale === "pt-BR" ? "Carboidratos" : "Carbs",
            },
            {
                item: intake.locale === "pt-BR" ? "Brócolis" : "Broccoli",
                quantity: `${days * 100}g`,
                category: intake.locale === "pt-BR" ? "Vegetais" : "Vegetables",
            },
        ],
        macros_summary: {
            daily_average: {
                calories: 1200,
                protein: 95,
                carbs: 100,
                fat: 45,
                fiber: 25,
            },
            weekly_total: {
                calories: 1200 * days,
                protein: 95 * days,
                carbs: 100 * days,
                fat: 45 * days,
                fiber: 25 * days,
            },
        },
        notes:
            intake.locale === "pt-BR"
                ? "Este é um plano de teste. Ajuste as porções conforme sua necessidade. Beba bastante água e consulte um nutricionista para um plano personalizado."
                : "This is a test plan. Adjust portions as needed. Drink plenty of water and consult a nutritionist for a personalized plan.",
    };
}
