/**
 * AI Prompt Templates for Meal Plan Generation
 * Supports PT-BR and EN with structured JSON output
 */

export interface UserIntake {
  name: string;
  age: number;
  weight: number; // kg
  height: number; // cm
  gender: "male" | "female" | "other";
  goals: string[]; // e.g., ["perder peso", "ganhar massa"] - pode ter múltiplos
  restrictions: string[]; // e.g., ["lactose", "gluten"]
  style: string; // e.g., "vegetariano", "vegano", "onívoro", "flexível"
  activityLevel: string; // sedentário, leve, moderado, intenso
  mealsPerDay: number;
  preferredMealTimes?: string[]; // e.g., ["08:00", "12:00", "15:00", "19:00"]
  budget?: "low" | "medium" | "high";
  cookingSkill?: "beginner" | "intermediate" | "advanced";
  locale: "pt-BR" | "en";
}

export interface MealPlanOutput {
  days: DayPlan[];
  shopping_list: ShoppingItem[];
  notes: string;
  macros_summary: MacrosSummary;
}

export interface DayPlan {
  day: number;
  date?: string;
  total_calories: number;
  total_macros: Macros;
  meals: Meal[];
}

export interface Meal {
  time: string;
  name: string;
  recipe: string;
  ingredients: Ingredient[];
  macros: Macros;
  preparation_time: number; // minutes
  difficulty: "easy" | "medium" | "hard";
  tips?: string;
}

export interface Ingredient {
  item: string;
  quantity: string;
  unit: string;
}

export interface Macros {
  calories: number;
  protein: number; // g
  carbs: number; // g
  fat: number; // g
  fiber?: number; // g
}

export interface ShoppingItem {
  item: string;
  quantity: string;
  category: string; // e.g., "Proteínas", "Vegetais", "Grãos"
}

export interface MacrosSummary {
  daily_average: Macros;
  weekly_total: Macros;
}

/**
 * Generate the AI prompt based on user intake and locale
 */
export function generatePrompt(intake: UserIntake, days: number): string {
  if (intake.locale === "pt-BR") {
    return generatePromptPTBR(intake, days);
  }
  return generatePromptEN(intake, days);
}

/**
 * Portuguese (Brazil) Prompt
 */
function generatePromptPTBR(intake: UserIntake, days: number): string {
  const {
    name,
    age,
    weight,
    height,
    gender,
    goals,
    restrictions,
    style,
    activityLevel,
    mealsPerDay,
    preferredMealTimes,
    budget,
    cookingSkill,
  } = intake;

  const goalsText = goals.length > 0 ? goals.join(" e ") : "manter saúde";
  const restrictionsText =
    restrictions.length > 0 ? restrictions.join(", ") : "nenhuma";
  const timesText = preferredMealTimes?.join(", ") || "flexível";
  const budgetText = budget || "médio";
  const skillText = cookingSkill || "intermediário";

  return `Você é um nutricionista especializado em criar planos alimentares personalizados e detalhados.

**DADOS DO CLIENTE:**
- Nome: ${name}
- Idade: ${age} anos
- Peso: ${weight} kg
- Altura: ${height} cm
- Gênero: ${gender}
- Objetivos: ${goalsText}
- Restrições alimentares: ${restrictionsText}
- Estilo alimentar: ${style}
- Nível de atividade física: ${activityLevel}
- Refeições por dia: ${mealsPerDay}
- Horários preferenciais: ${timesText}
- Orçamento: ${budgetText}
- Habilidade culinária: ${skillText}

**TAREFA:**
Crie um plano alimentar completo e personalizado para ${days} dias. O plano deve:

1. **Ser nutricionalmente balanceado** com base nos objetivos do cliente (${goalsText})
2. **Respeitar todas as restrições** alimentares mencionadas
3. **Incluir receitas detalhadas** com modo de preparo passo a passo
4. **Calcular macros precisos** (calorias, proteínas, carboidratos, gorduras, fibras)
5. **Variar os alimentos** ao longo dos dias para evitar monotonia
6. **Ser prático e realista** considerando a habilidade culinária e orçamento
7. **Incluir dicas úteis** de preparo, substituições e armazenamento
8. **IMPORTANTE: A lista de compras deve conter TODOS os ingredientes necessários para os ${days} dias completos do plano**

**FORMATO DE SAÍDA (JSON):**
Retorne APENAS um objeto JSON válido, sem texto adicional, seguindo exatamente esta estrutura:

{
  "days": [
    {
      "day": 1,
      "date": "2024-01-01",
      "total_calories": 2000,
      "total_macros": {
        "calories": 2000,
        "protein": 150,
        "carbs": 200,
        "fat": 65,
        "fiber": 30
      },
      "meals": [
        {
          "time": "08:00",
          "name": "Café da Manhã",
          "recipe": "Omelete de 3 ovos com espinafre e tomate. Bata os ovos, adicione espinafre picado e tomate em cubos. Cozinhe em fogo médio com azeite até firmar. Sirva com 2 fatias de pão integral.",
          "ingredients": [
            { "item": "Ovos", "quantity": "3", "unit": "unidades" },
            { "item": "Espinafre", "quantity": "50", "unit": "g" },
            { "item": "Tomate", "quantity": "1", "unit": "unidade" },
            { "item": "Pão integral", "quantity": "2", "unit": "fatias" },
            { "item": "Azeite", "quantity": "1", "unit": "colher de sopa" }
          ],
          "macros": {
            "calories": 450,
            "protein": 28,
            "carbs": 35,
            "fat": 18,
            "fiber": 6
          },
          "preparation_time": 15,
          "difficulty": "easy",
          "tips": "Você pode adicionar queijo branco para mais proteína. O espinafre pode ser substituído por couve."
        }
      ]
    }
  ],
  "shopping_list": [
    {
      "item": "Ovos",
      "quantity": "2 dúzias",
      "category": "Proteínas"
    },
    {
      "item": "Espinafre",
      "quantity": "300g",
      "category": "Vegetais"
    }
  ],
  "notes": "Este plano foi desenvolvido para ${goalsText}. Beba pelo menos 2 litros de água por dia. Ajuste as porções conforme sua fome e saciedade. Consulte um nutricionista para acompanhamento personalizado.",
  "macros_summary": {
    "daily_average": {
      "calories": 2000,
      "protein": 150,
      "carbs": 200,
      "fat": 65,
      "fiber": 30
    },
    "weekly_total": {
      "calories": 14000,
      "protein": 1050,
      "carbs": 1400,
      "fat": 455,
      "fiber": 210
    }
  }
}

**IMPORTANTE:**
- Retorne SOMENTE o JSON, sem markdown, sem explicações adicionais
- Todos os valores numéricos devem ser números, não strings
- Inclua ${mealsPerDay} refeições por dia
- Varie os alimentos entre os dias
- Seja específico nas receitas e quantidades
- Calcule os macros com precisão
- **CRÍTICO: A shopping_list deve incluir TODOS os ingredientes para os ${days} dias completos, com quantidades totais somadas**
- Se o plano é de 7 dias, a lista deve ter ingredientes para 7 dias
- Se o plano é de 30 dias, a lista deve ter ingredientes para 30 dias
- Se o plano é de 90 dias, a lista deve ter ingredientes para 90 dias (pode dividir em compras mensais se necessário)`;
}

/**
 * English Prompt
 */
function generatePromptEN(intake: UserIntake, days: number): string {
  const {
    name,
    age,
    weight,
    height,
    gender,
    goals,
    restrictions,
    style,
    activityLevel,
    mealsPerDay,
    preferredMealTimes,
    budget,
    cookingSkill,
  } = intake;

  const goalsText = goals.length > 0 ? goals.join(" and ") : "maintain health";
  const restrictionsText =
    restrictions.length > 0 ? restrictions.join(", ") : "none";
  const timesText = preferredMealTimes?.join(", ") || "flexible";
  const budgetText = budget || "medium";
  const skillText = cookingSkill || "intermediate";

  return `You are a nutritionist specialized in creating personalized and detailed meal plans.

**CLIENT DATA:**
- Name: ${name}
- Age: ${age} years
- Weight: ${weight} kg
- Height: ${height} cm
- Gender: ${gender}
- Goals: ${goalsText}
- Dietary restrictions: ${restrictionsText}
- Dietary style: ${style}
- Activity level: ${activityLevel}
- Meals per day: ${mealsPerDay}
- Preferred meal times: ${timesText}
- Budget: ${budgetText}
- Cooking skill: ${skillText}

**TASK:**
Create a complete and personalized meal plan for ${days} days. The plan must:

1. **Be nutritionally balanced** based on the client's goal
2. **Respect all dietary restrictions** mentioned
3. **Include detailed recipes** with step-by-step preparation instructions
4. **Calculate precise macros** (calories, protein, carbs, fat, fiber)
5. **Vary foods** throughout the days to avoid monotony
6. **Be practical and realistic** considering cooking skill and budget
7. **Include useful tips** for preparation, substitutions, and storage

**OUTPUT FORMAT (JSON):**
Return ONLY a valid JSON object, without additional text, following exactly this structure:

{
  "days": [
    {
      "day": 1,
      "date": "2024-01-01",
      "total_calories": 2000,
      "total_macros": {
        "calories": 2000,
        "protein": 150,
        "carbs": 200,
        "fat": 65,
        "fiber": 30
      },
      "meals": [
        {
          "time": "08:00",
          "name": "Breakfast",
          "recipe": "3-egg omelet with spinach and tomato. Beat eggs, add chopped spinach and diced tomato. Cook on medium heat with olive oil until set. Serve with 2 slices of whole wheat bread.",
          "ingredients": [
            { "item": "Eggs", "quantity": "3", "unit": "units" },
            { "item": "Spinach", "quantity": "50", "unit": "g" },
            { "item": "Tomato", "quantity": "1", "unit": "unit" },
            { "item": "Whole wheat bread", "quantity": "2", "unit": "slices" },
            { "item": "Olive oil", "quantity": "1", "unit": "tablespoon" }
          ],
          "macros": {
            "calories": 450,
            "protein": 28,
            "carbs": 35,
            "fat": 18,
            "fiber": 6
          },
          "preparation_time": 15,
          "difficulty": "easy",
          "tips": "You can add cottage cheese for more protein. Spinach can be substituted with kale."
        }
      ]
    }
  ],
  "shopping_list": [
    {
      "item": "Eggs",
      "quantity": "2 dozen",
      "category": "Proteins"
    },
    {
      "item": "Spinach",
      "quantity": "300g",
      "category": "Vegetables"
    }
  ],
  "notes": "This plan was developed for ${goalsText}. Drink at least 2 liters of water per day. Adjust portions according to your hunger and satiety. Consult a nutritionist for personalized follow-up.",
  "macros_summary": {
    "daily_average": {
      "calories": 2000,
      "protein": 150,
      "carbs": 200,
      "fat": 65,
      "fiber": 30
    },
    "weekly_total": {
      "calories": 14000,
      "protein": 1050,
      "carbs": 1400,
      "fat": 455,
      "fiber": 210
    }
  }
}

**IMPORTANT:**
- Return ONLY the JSON, without markdown, without additional explanations
- All numeric values must be numbers, not strings
- Include ${mealsPerDay} meals per day
- Vary foods between days
- Be specific in recipes and quantities
- Calculate macros accurately`;
}

/**
 * Generate a preview (1-day sample) prompt
 */
export function generatePreviewPrompt(intake: UserIntake): string {
  return generatePrompt(intake, 1);
}
