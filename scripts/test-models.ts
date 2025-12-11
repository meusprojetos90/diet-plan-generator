/**
 * Test script to compare gpt-5-mini vs gpt-4o-mini
 * Run: npx ts-node scripts/test-models.ts
 */

require('dotenv').config({ path: '.env.local' });
const OpenAI = require('openai');
const fs = require('fs');

const openai = new OpenAI.default({
    apiKey: process.env.OPENAI_API_KEY,
});

const testIntake = {
    age: 30,
    gender: "male",
    height: 175,
    weight: 80,
    goal: "lose_weight",
    activity_level: "moderate",
    dietary_restrictions: [],
    meals_per_day: 5,
    locale: "pt-BR"
};

const promptText = `Crie um plano alimentar personalizado para 7 dias com as seguintes características:
- Idade: ${testIntake.age} anos
- Sexo: ${testIntake.gender === 'male' ? 'Masculino' : 'Feminino'}
- Altura: ${testIntake.height}cm
- Peso: ${testIntake.weight}kg
- Objetivo: Perder peso
- Nível de atividade: Moderado
- Refeições por dia: 5

Retorne um JSON com a seguinte estrutura:
{
  "days": [
    {
      "day": 1,
      "total_calories": 1800,
      "meals": [
        {
          "time": "07:00",
          "name": "Café da manhã",
          "foods": ["item1", "item2"],
          "macros": { "calories": 400, "protein": 20, "carbs": 50, "fat": 15 }
        }
      ]
    }
  ],
  "shopping_list": ["item1", "item2"],
  "tips": ["dica1", "dica2"]
}`;

async function testModel(modelName: string): Promise<any> {
    console.log(`\n🔄 Testando ${modelName}...`);
    const startTime = Date.now();

    try {
        const completion = await openai.chat.completions.create({
            model: modelName,
            messages: [
                {
                    role: "system",
                    content: "Você é um nutricionista profissional. Sempre retorne JSON válido."
                },
                {
                    role: "user",
                    content: promptText
                }
            ],
            temperature: 0.7,
            response_format: { type: "json_object" },
        });

        const endTime = Date.now();
        const duration = (endTime - startTime) / 1000;

        const usage = completion.usage;
        const content = completion.choices[0].message.content;

        console.log(`✅ ${modelName} completou em ${duration.toFixed(2)}s`);
        console.log(`   Tokens: ${usage?.prompt_tokens} in, ${usage?.completion_tokens} out`);

        return {
            model: modelName,
            duration,
            tokens: {
                input: usage?.prompt_tokens,
                output: usage?.completion_tokens,
                total: usage?.total_tokens
            },
            content: JSON.parse(content || '{}')
        };
    } catch (error: any) {
        console.error(`❌ Erro com ${modelName}:`, error.message);
        return {
            model: modelName,
            error: error.message
        };
    }
}

async function main() {
    console.log('🧪 Comparando modelos OpenAI para geração de plano alimentar\n');
    console.log('='.repeat(60));

    const models = ['gpt-4o-mini', 'gpt-5-mini'];
    const results: any[] = [];

    for (const model of models) {
        const result = await testModel(model);
        results.push(result);
    }

    console.log('\n' + '='.repeat(60));
    console.log('📊 RESULTADOS\n');

    for (const result of results) {
        console.log(`\n📌 ${result.model}`);
        if (result.error) {
            console.log(`   ❌ Erro: ${result.error}`);
        } else {
            console.log(`   ⏱️  Tempo: ${result.duration.toFixed(2)}s`);
            console.log(`   🔢 Tokens: ${result.tokens.total} (${result.tokens.input} in + ${result.tokens.output} out)`);
            console.log(`   📅 Dias gerados: ${result.content?.days?.length || 0}`);
            console.log(`   🛒 Itens na lista: ${result.content?.shopping_list?.length || 0}`);
            console.log(`   💡 Dicas: ${result.content?.tips?.length || 0}`);
        }
    }

    // Save results to file
    const outputPath = './test-results-models.json';
    fs.writeFileSync(outputPath, JSON.stringify(results, null, 2));
    console.log(`\n💾 Resultados salvos em ${outputPath}`);
}

main().catch(console.error);
