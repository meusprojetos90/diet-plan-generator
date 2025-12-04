/**
 * PDF Generator - Transforms AI-generated meal plan JSON into HTML and PDF
 */

import puppeteer from "puppeteer";
import { MealPlanOutput, DayPlan, Meal } from "./prompts";
import fs from "fs/promises";
import path from "path";

export interface PDFGenerationOptions {
    locale: "pt-BR" | "en";
    customerName: string;
    planDays: number;
    outputPath?: string;
}

/**
 * Generate PDF from meal plan data
 */
export async function generatePDF(
    mealPlan: MealPlanOutput,
    options: PDFGenerationOptions
): Promise<Buffer> {
    const html = renderHTML(mealPlan, options);

    const browser = await puppeteer.launch({
        headless: true,
        args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    try {
        const page = await browser.newPage();
        await page.setContent(html, { waitUntil: "networkidle0" });

        const pdfBuffer = await page.pdf({
            format: "A4",
            printBackground: true,
            margin: {
                top: "20mm",
                right: "15mm",
                bottom: "20mm",
                left: "15mm",
            },
        });

        return Buffer.from(pdfBuffer);
    } finally {
        await browser.close();
    }
}

/**
 * Render HTML from meal plan data
 */
export function renderHTML(
    mealPlan: MealPlanOutput,
    options: PDFGenerationOptions
): string {
    const { locale, customerName, planDays } = options;
    const t = getTranslations(locale);

    const coverPage = renderCoverPage(customerName, planDays, t);
    const daysHTML = mealPlan.days.map((day) => renderDay(day, t)).join("\n");
    const shoppingListHTML = renderShoppingList(mealPlan, t);
    const summaryHTML = renderSummary(mealPlan, t);

    return `
<!DOCTYPE html>
<html lang="${locale}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${t.title} - ${customerName}</title>
  <style>
    ${getStyles()}
  </style>
</head>
<body>
  ${coverPage}
  ${summaryHTML}
  ${daysHTML}
  ${shoppingListHTML}
  <div class="footer-notes">
    <p>${mealPlan.notes}</p>
  </div>
</body>
</html>
  `.trim();
}

/**
 * Render cover page
 */
function renderCoverPage(
    customerName: string,
    days: number,
    t: Translations
): string {
    return `
<div class="cover-page">
  <div class="cover-content">
    <h1 class="cover-title">${t.title}</h1>
    <div class="cover-subtitle">${t.personalizedFor}</div>
    <div class="cover-name">${customerName}</div>
    <div class="cover-duration">${days} ${t.days}</div>
    <div class="cover-footer">
      <p>${t.coverMessage}</p>
    </div>
  </div>
</div>
  `;
}

/**
 * Render summary page
 */
function renderSummary(mealPlan: MealPlanOutput, t: Translations): string {
    const { daily_average, weekly_total } = mealPlan.macros_summary;

    return `
<div class="summary-page">
  <h2 class="section-title">${t.nutritionalSummary}</h2>
  
  <div class="macros-grid">
    <div class="macro-card">
      <h3>${t.dailyAverage}</h3>
      <div class="macro-item">
        <span class="macro-label">${t.calories}:</span>
        <span class="macro-value">${daily_average.calories} kcal</span>
      </div>
      <div class="macro-item">
        <span class="macro-label">${t.protein}:</span>
        <span class="macro-value">${daily_average.protein}g</span>
      </div>
      <div class="macro-item">
        <span class="macro-label">${t.carbs}:</span>
        <span class="macro-value">${daily_average.carbs}g</span>
      </div>
      <div class="macro-item">
        <span class="macro-label">${t.fat}:</span>
        <span class="macro-value">${daily_average.fat}g</span>
      </div>
      ${daily_average.fiber
            ? `<div class="macro-item">
        <span class="macro-label">${t.fiber}:</span>
        <span class="macro-value">${daily_average.fiber}g</span>
      </div>`
            : ""
        }
    </div>

    <div class="macro-card">
      <h3>${t.weeklyTotal}</h3>
      <div class="macro-item">
        <span class="macro-label">${t.calories}:</span>
        <span class="macro-value">${weekly_total.calories.toLocaleString()} kcal</span>
      </div>
      <div class="macro-item">
        <span class="macro-label">${t.protein}:</span>
        <span class="macro-value">${weekly_total.protein}g</span>
      </div>
      <div class="macro-item">
        <span class="macro-label">${t.carbs}:</span>
        <span class="macro-value">${weekly_total.carbs}g</span>
      </div>
      <div class="macro-item">
        <span class="macro-label">${t.fat}:</span>
        <span class="macro-value">${weekly_total.fat}g</span>
      </div>
      ${weekly_total.fiber
            ? `<div class="macro-item">
        <span class="macro-label">${t.fiber}:</span>
        <span class="macro-value">${weekly_total.fiber}g</span>
      </div>`
            : ""
        }
    </div>
  </div>
</div>
  `;
}

/**
 * Render a single day
 */
function renderDay(day: DayPlan, t: Translations): string {
    const mealsHTML = day.meals.map((meal) => renderMeal(meal, t)).join("\n");

    return `
<div class="day-page">
  <div class="day-header">
    <h2 class="day-title">${t.day} ${day.day}</h2>
    ${day.date ? `<div class="day-date">${day.date}</div>` : ""}
    <div class="day-macros">
      <span>${t.totalCalories}: <strong>${day.total_calories} kcal</strong></span>
      <span>${t.protein}: <strong>${day.total_macros.protein}g</strong></span>
      <span>${t.carbs}: <strong>${day.total_macros.carbs}g</strong></span>
      <span>${t.fat}: <strong>${day.total_macros.fat}g</strong></span>
    </div>
  </div>
  
  <div class="meals-container">
    ${mealsHTML}
  </div>
</div>
  `;
}

/**
 * Render a single meal
 */
function renderMeal(meal: Meal, t: Translations): string {
    const ingredientsHTML = meal.ingredients
        .map(
            (ing) =>
                `<li>${ing.item} - ${ing.quantity}${ing.unit ? " " + ing.unit : ""}</li>`
        )
        .join("\n");

    const difficultyClass = `difficulty-${meal.difficulty}`;
    const difficultyLabel =
        t.difficulty[meal.difficulty as keyof typeof t.difficulty];

    return `
<div class="meal-card">
  <div class="meal-header">
    <div class="meal-time">${meal.time}</div>
    <h3 class="meal-name">${meal.name}</h3>
    <div class="meal-meta">
      <span class="${difficultyClass}">${difficultyLabel}</span>
      <span>${meal.preparation_time} ${t.minutes}</span>
    </div>
  </div>

  <div class="meal-macros">
    <span>${meal.macros.calories} kcal</span>
    <span>P: ${meal.macros.protein}g</span>
    <span>C: ${meal.macros.carbs}g</span>
    <span>G: ${meal.macros.fat}g</span>
  </div>

  <div class="meal-recipe">
    <h4>${t.preparation}</h4>
    <p>${meal.recipe}</p>
  </div>

  <div class="meal-ingredients">
    <h4>${t.ingredients}</h4>
    <ul>
      ${ingredientsHTML}
    </ul>
  </div>

  ${meal.tips
            ? `<div class="meal-tips">
    <h4>${t.tips}</h4>
    <p>${meal.tips}</p>
  </div>`
            : ""
        }
</div>
  `;
}

/**
 * Render shopping list
 */
function renderShoppingList(mealPlan: MealPlanOutput, t: Translations): string {
    // Group by category
    const grouped = mealPlan.shopping_list.reduce(
        (acc, item) => {
            if (!acc[item.category]) {
                acc[item.category] = [];
            }
            acc[item.category].push(item);
            return acc;
        },
        {} as Record<string, typeof mealPlan.shopping_list>
    );

    const categoriesHTML = Object.entries(grouped)
        .map(
            ([category, items]) => `
    <div class="shopping-category">
      <h3>${category}</h3>
      <ul>
        ${items.map((item) => `<li>${item.item} - ${item.quantity}</li>`).join("\n")}
      </ul>
    </div>
  `
        )
        .join("\n");

    return `
<div class="shopping-list-page">
  <h2 class="section-title">${t.shoppingList}</h2>
  <div class="shopping-grid">
    ${categoriesHTML}
  </div>
</div>
  `;
}

/**
 * Get CSS styles
 */
function getStyles(): string {
    return `
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      line-height: 1.6;
      color: #333;
      background: #fff;
    }

    /* Cover Page */
    .cover-page {
      height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      text-align: center;
      page-break-after: always;
    }

    .cover-title {
      font-size: 48px;
      font-weight: 700;
      margin-bottom: 20px;
    }

    .cover-subtitle {
      font-size: 20px;
      opacity: 0.9;
      margin-bottom: 10px;
    }

    .cover-name {
      font-size: 36px;
      font-weight: 600;
      margin: 20px 0;
    }

    .cover-duration {
      font-size: 24px;
      opacity: 0.9;
      margin-bottom: 40px;
    }

    .cover-footer {
      max-width: 600px;
      margin: 0 auto;
      font-size: 16px;
      opacity: 0.8;
    }

    /* Summary Page */
    .summary-page {
      page-break-after: always;
      padding: 40px 0;
    }

    .section-title {
      font-size: 32px;
      color: #667eea;
      margin-bottom: 30px;
      border-bottom: 3px solid #667eea;
      padding-bottom: 10px;
    }

    .macros-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 30px;
      margin-top: 30px;
    }

    .macro-card {
      background: #f8f9fa;
      padding: 25px;
      border-radius: 10px;
      border-left: 4px solid #667eea;
    }

    .macro-card h3 {
      font-size: 20px;
      margin-bottom: 15px;
      color: #667eea;
    }

    .macro-item {
      display: flex;
      justify-content: space-between;
      padding: 8px 0;
      border-bottom: 1px solid #e0e0e0;
    }

    .macro-item:last-child {
      border-bottom: none;
    }

    .macro-label {
      font-weight: 500;
    }

    .macro-value {
      font-weight: 700;
      color: #667eea;
    }

    /* Day Page */
    .day-page {
      page-break-after: always;
      padding: 20px 0;
    }

    .day-header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 25px;
      border-radius: 10px;
      margin-bottom: 30px;
    }

    .day-title {
      font-size: 28px;
      margin-bottom: 10px;
    }

    .day-date {
      font-size: 16px;
      opacity: 0.9;
      margin-bottom: 15px;
    }

    .day-macros {
      display: flex;
      gap: 20px;
      flex-wrap: wrap;
      font-size: 14px;
    }

    .day-macros span {
      background: rgba(255, 255, 255, 0.2);
      padding: 5px 12px;
      border-radius: 5px;
    }

    /* Meals */
    .meals-container {
      display: flex;
      flex-direction: column;
      gap: 25px;
    }

    .meal-card {
      background: #fff;
      border: 2px solid #e0e0e0;
      border-radius: 10px;
      padding: 20px;
      page-break-inside: avoid;
    }

    .meal-header {
      border-bottom: 2px solid #f0f0f0;
      padding-bottom: 15px;
      margin-bottom: 15px;
    }

    .meal-time {
      display: inline-block;
      background: #667eea;
      color: white;
      padding: 4px 12px;
      border-radius: 5px;
      font-size: 14px;
      font-weight: 600;
      margin-bottom: 8px;
    }

    .meal-name {
      font-size: 22px;
      color: #333;
      margin: 8px 0;
    }

    .meal-meta {
      display: flex;
      gap: 15px;
      font-size: 14px;
      margin-top: 8px;
    }

    .meal-meta span {
      padding: 4px 10px;
      border-radius: 5px;
      background: #f0f0f0;
    }

    .difficulty-easy { background: #d4edda !important; color: #155724; }
    .difficulty-medium { background: #fff3cd !important; color: #856404; }
    .difficulty-hard { background: #f8d7da !important; color: #721c24; }

    .meal-macros {
      display: flex;
      gap: 15px;
      margin-bottom: 15px;
      font-size: 14px;
      font-weight: 600;
      color: #667eea;
    }

    .meal-recipe,
    .meal-ingredients,
    .meal-tips {
      margin-bottom: 15px;
    }

    .meal-recipe h4,
    .meal-ingredients h4,
    .meal-tips h4 {
      font-size: 16px;
      color: #667eea;
      margin-bottom: 8px;
    }

    .meal-recipe p,
    .meal-tips p {
      line-height: 1.8;
      color: #555;
    }

    .meal-ingredients ul {
      list-style: none;
      padding-left: 0;
    }

    .meal-ingredients li {
      padding: 6px 0;
      padding-left: 20px;
      position: relative;
    }

    .meal-ingredients li:before {
      content: "•";
      color: #667eea;
      font-weight: bold;
      position: absolute;
      left: 0;
    }

    /* Shopping List */
    .shopping-list-page {
      page-break-after: always;
      padding: 20px 0;
    }

    .shopping-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 25px;
      margin-top: 30px;
    }

    .shopping-category {
      background: #f8f9fa;
      padding: 20px;
      border-radius: 10px;
      border-left: 4px solid #667eea;
    }

    .shopping-category h3 {
      font-size: 18px;
      color: #667eea;
      margin-bottom: 12px;
    }

    .shopping-category ul {
      list-style: none;
      padding: 0;
    }

    .shopping-category li {
      padding: 6px 0;
      border-bottom: 1px solid #e0e0e0;
    }

    .shopping-category li:last-child {
      border-bottom: none;
    }

    /* Footer Notes */
    .footer-notes {
      margin-top: 40px;
      padding: 25px;
      background: #f8f9fa;
      border-left: 4px solid #667eea;
      border-radius: 10px;
    }

    .footer-notes p {
      line-height: 1.8;
      color: #555;
    }

    @media print {
      .cover-page,
      .summary-page,
      .day-page,
      .shopping-list-page {
        page-break-after: always;
      }

      .meal-card {
        page-break-inside: avoid;
      }
    }
  `;
}

/**
 * Translations
 */
interface Translations {
    title: string;
    personalizedFor: string;
    days: string;
    coverMessage: string;
    nutritionalSummary: string;
    dailyAverage: string;
    weeklyTotal: string;
    calories: string;
    protein: string;
    carbs: string;
    fat: string;
    fiber: string;
    day: string;
    totalCalories: string;
    preparation: string;
    ingredients: string;
    tips: string;
    minutes: string;
    difficulty: {
        easy: string;
        medium: string;
        hard: string;
    };
    shoppingList: string;
}

function getTranslations(locale: "pt-BR" | "en"): Translations {
    if (locale === "pt-BR") {
        return {
            title: "Plano Alimentar Personalizado",
            personalizedFor: "Plano personalizado para",
            days: "dias",
            coverMessage:
                "Este plano foi desenvolvido especialmente para você. Siga as orientações e ajuste conforme necessário.",
            nutritionalSummary: "Resumo Nutricional",
            dailyAverage: "Média Diária",
            weeklyTotal: "Total Semanal",
            calories: "Calorias",
            protein: "Proteínas",
            carbs: "Carboidratos",
            fat: "Gorduras",
            fiber: "Fibras",
            day: "Dia",
            totalCalories: "Total de calorias",
            preparation: "Modo de Preparo",
            ingredients: "Ingredientes",
            tips: "Dicas",
            minutes: "min",
            difficulty: {
                easy: "Fácil",
                medium: "Médio",
                hard: "Difícil",
            },
            shoppingList: "Lista de Compras",
        };
    }

    return {
        title: "Personalized Meal Plan",
        personalizedFor: "Personalized plan for",
        days: "days",
        coverMessage:
            "This plan was developed especially for you. Follow the guidelines and adjust as needed.",
        nutritionalSummary: "Nutritional Summary",
        dailyAverage: "Daily Average",
        weeklyTotal: "Weekly Total",
        calories: "Calories",
        protein: "Protein",
        carbs: "Carbs",
        fat: "Fat",
        fiber: "Fiber",
        day: "Day",
        totalCalories: "Total calories",
        preparation: "Preparation",
        ingredients: "Ingredients",
        tips: "Tips",
        minutes: "min",
        difficulty: {
            easy: "Easy",
            medium: "Medium",
            hard: "Hard",
        },
        shoppingList: "Shopping List",
    };
}
