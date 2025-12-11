/**
 * Complete test script to compare gpt-5-mini vs gpt-4o-mini
 * Generates full 7-day meal plan + workout with all form data
 * Run: npx ts-node scripts/test-models-complete.ts
 */

require('dotenv').config({ path: '.env.local' });
const OpenAI = require('openai');
const fs = require('fs');

const openai = new OpenAI.default({
    apiKey: process.env.OPENAI_API_KEY,
});

// Complete intake data matching the quiz form
const intake = {
    age: 30,
    gender: "male",
    height: 175,
    weight: 85,
    target_weight: 75,
    goal: "lose_weight",
    activity_level: "moderate",
    dietary_restrictions: ["lactose_free"],
    preferred_foods: ["frango", "peixe", "arroz", "vegetais", "frutas"],
    disliked_foods: ["fígado", "beterraba"],
    meals_per_day: 5,
    water_intake: "1-2L",
    sleep_hours: 7,
    stress_level: "medium",
    has_gym_access: true,
    workout_experience: "intermediate",
    workout_days_per_week: 4,
    available_time_minutes: 60,
    health_conditions: [],
    locale: "pt-BR"
};

const userPrompt = `
Você é um nutricionista e personal trainer profissional. Crie um plano alimentar E de treino personalizado para 7 dias com base nos seguintes dados do cliente:

## DADOS DO CLIENTE:
- Idade: ${intake.age} anos
- Sexo: ${intake.gender === 'male' ? 'Masculino' : 'Feminino'}
- Altura: ${intake.height}cm
- Peso atual: ${intake.weight}kg
- Peso desejado: ${intake.target_weight}kg
- Objetivo: Perder peso
- Nível de atividade: Moderado
- Restrições alimentares: ${intake.dietary_restrictions.join(', ')}
- Alimentos preferidos: ${intake.preferred_foods.join(', ')}
- Alimentos que não gosta: ${intake.disliked_foods.join(', ')}
- Refeições por dia: ${intake.meals_per_day}
- Consumo de água: ${intake.water_intake}
- Horas de sono: ${intake.sleep_hours}h
- Nível de estresse: ${intake.stress_level}
- Acesso à academia: ${intake.has_gym_access ? 'Sim' : 'Não'}
- Experiência com treino: ${intake.workout_experience}
- Dias de treino por semana: ${intake.workout_days_per_week}
- Tempo disponível por treino: ${intake.available_time_minutes} minutos

## INSTRUÇÕES:
1. Calcule as calorias diárias para atingir o objetivo
2. Crie um cardápio detalhado para 7 dias com 5 refeições cada
3. Inclua macros para cada refeição
4. Crie um plano de treino para 4 dias por semana
5. Inclua uma lista de compras semanal
6. Adicione 5 dicas personalizadas

## FORMATO DE RESPOSTA (JSON):
{
  "daily_calories": number,
  "daily_macros": { "protein": number, "carbs": number, "fat": number },
  "days": [
    {
      "day": 1,
      "date_name": "Segunda-feira",
      "total_calories": number,
      "meals": [
        {
          "time": "07:00",
          "name": "Café da manhã",
          "foods": [{ "name": "Ovo mexido", "quantity": "2 unidades", "calories": 140 }],
          "macros": { "calories": 400, "protein": 25, "carbs": 40, "fat": 15 }
        }
      ]
    }
  ],
  "workout_plan": {
    "days": [
      {
        "day": 1,
        "name": "Treino A - Peito e Tríceps",
        "duration": 60,
        "exercises": [{ "name": "Supino reto", "sets": 4, "reps": "10-12", "rest": "60s" }]
      }
    ]
  },
  "shopping_list": [{ "category": "Proteínas", "items": ["Frango 1kg", "Ovos 12 unidades"] }],
  "tips": ["Dica 1", "Dica 2"]
}
`;

function generateMarkdown(result: any): string {
    if (result.error) {
        return `# Resultado: ${result.model}\n\n❌ **Erro:** ${result.error}\n`;
    }

    const c = result.content;
    let md = `# Plano Gerado por ${result.model}\n\n`;
    md += `**Tempo de geração:** ${result.duration.toFixed(1)}s | **Tokens:** ${result.tokens.total}\n\n`;
    md += `---\n\n`;
    md += `## 📊 Resumo Nutricional\n\n`;
    md += `- **Calorias diárias:** ${c.daily_calories} kcal\n`;
    if (c.daily_macros) {
        md += `- **Proteínas:** ${c.daily_macros.protein}g\n`;
        md += `- **Carboidratos:** ${c.daily_macros.carbs}g\n`;
        md += `- **Gorduras:** ${c.daily_macros.fat}g\n`;
    }
    md += `\n---\n\n`;

    // Days
    md += `## 🍽️ Cardápio Semanal\n\n`;
    if (c.days) {
        for (const day of c.days) {
            md += `### Dia ${day.day}${day.date_name ? ` - ${day.date_name}` : ''}\n\n`;
            if (day.meals) {
                for (const meal of day.meals) {
                    md += `**${meal.time} - ${meal.name}** (${meal.macros?.calories || '?'} kcal)\n`;
                    if (meal.foods) {
                        for (const food of meal.foods) {
                            md += `- ${food.name}: ${food.quantity}\n`;
                        }
                    }
                    md += `\n`;
                }
            }
        }
    }

    // Workout
    md += `---\n\n## 💪 Plano de Treino\n\n`;
    if (c.workout_plan?.days) {
        for (const day of c.workout_plan.days) {
            md += `### ${day.name || `Treino Dia ${day.day}`} (${day.duration || 60} min)\n\n`;
            if (day.exercises) {
                md += `| Exercício | Séries | Repetições | Descanso |\n`;
                md += `|-----------|--------|------------|----------|\n`;
                for (const ex of day.exercises) {
                    md += `| ${ex.name} | ${ex.sets} | ${ex.reps} | ${ex.rest || '60s'} |\n`;
                }
                md += `\n`;
            }
        }
    }

    // Shopping list
    md += `---\n\n## 🛒 Lista de Compras\n\n`;
    if (c.shopping_list) {
        for (const cat of c.shopping_list) {
            md += `**${cat.category}:**\n`;
            for (const item of cat.items) {
                md += `- ${item}\n`;
            }
            md += `\n`;
        }
    }

    // Tips
    md += `---\n\n## 💡 Dicas\n\n`;
    if (c.tips) {
        for (let i = 0; i < c.tips.length; i++) {
            md += `${i + 1}. ${c.tips[i]}\n`;
        }
    }

    return md;
}

async function testModel(modelName: string): Promise<any> {
    console.log(`\n🔄 Testando ${modelName}...`);
    const startTime = Date.now();

    try {
        const isGpt5 = modelName.includes('gpt-5');

        const params: any = {
            model: modelName,
            messages: [
                { role: "system", content: "Você é um nutricionista e personal trainer profissional brasileiro. Sempre retorne JSON válido e completo." },
                { role: "user", content: userPrompt }
            ],
            response_format: { type: "json_object" },
        };

        // GPT-5 uses different parameters
        if (isGpt5) {
            params.max_completion_tokens = 16000;
            // GPT-5 only supports temperature=1
        } else {
            params.max_tokens = 16000;
            params.temperature = 0.7;
        }

        const completion = await openai.chat.completions.create(params);
        const endTime = Date.now();
        const duration = (endTime - startTime) / 1000;
        const usage = completion.usage;
        const content = completion.choices[0].message.content;
        const parsedContent = JSON.parse(content || '{}');

        console.log(`✅ ${modelName} completou em ${duration.toFixed(2)}s`);
        console.log(`   Tokens: ${usage?.prompt_tokens} in, ${usage?.completion_tokens} out`);

        const result = {
            model: modelName,
            duration,
            tokens: { input: usage?.prompt_tokens, output: usage?.completion_tokens, total: usage?.total_tokens },
            content: parsedContent
        };

        // Save JSON
        const jsonFile = `./resultado-${modelName.replace(/[^a-z0-9]/gi, '-')}.json`;
        fs.writeFileSync(jsonFile, JSON.stringify(parsedContent, null, 2), 'utf-8');
        console.log(`   💾 JSON: ${jsonFile}`);

        // Save Markdown
        const mdFile = `./resultado-${modelName.replace(/[^a-z0-9]/gi, '-')}.md`;
        fs.writeFileSync(mdFile, generateMarkdown(result), 'utf-8');
        console.log(`   📝 Markdown: ${mdFile}`);

        return result;
    } catch (error: any) {
        console.error(`❌ Erro com ${modelName}:`, error.message);
        return { model: modelName, error: error.message };
    }
}

async function main() {
    console.log('🧪 TESTE COMPLETO: Comparando modelos OpenAI\n');
    console.log('='.repeat(60));

    const results: any[] = [];

    results.push(await testModel('gpt-4o-mini'));
    results.push(await testModel('gpt-5-mini'));

    console.log('\n' + '='.repeat(60));
    console.log('📊 COMPARAÇÃO FINAL\n');

    for (const r of results) {
        if (r.error) {
            console.log(`❌ ${r.model}: ${r.error}`);
        } else {
            console.log(`✅ ${r.model}: ${r.duration.toFixed(1)}s | ${r.tokens.total} tokens | ${r.content?.days?.length || 0} dias`);
        }
    }

    fs.writeFileSync('./comparacao-modelos.json', JSON.stringify(results, null, 2));
    console.log('\n� Arquivos salvos: resultado-*.json e resultado-*.md');
}

main().catch(console.error);
