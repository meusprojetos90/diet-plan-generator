"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import "./quiz.css";

export default function QuizPage() {
    const router = useRouter();
    const [locale, setLocale] = useState<"pt-BR" | "en">("pt-BR");
    const [currentStep, setCurrentStep] = useState(1);
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        age: "",
        weight: "",
        height: "",
        gender: "other" as "male" | "female" | "other",
        goals: [] as string[],
        restrictions: [] as string[],
        style: "",
        activityLevel: "",
        mealsPerDay: "4",
        budget: "medium" as "low" | "medium" | "high",
        cookingSkill: "intermediate" as "beginner" | "intermediate" | "advanced",
    });

    // Detectar idioma do navegador
    useEffect(() => {
        const browserLang = navigator.language;
        if (browserLang.startsWith("pt")) {
            setLocale("pt-BR");
        } else {
            setLocale("en");
        }
    }, []);

    const t = translations[locale];

    // Total de etapas (agora 12 com a etapa de loading)
    const totalSteps = 12;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Avançar para a etapa de loading
        setCurrentStep(12);
        setLoading(true);

        try {
            const intake = {
                ...formData,
                age: parseInt(formData.age),
                weight: parseFloat(formData.weight),
                height: parseFloat(formData.height),
                mealsPerDay: parseInt(formData.mealsPerDay),
                locale,
            };

            localStorage.setItem("intake", JSON.stringify(intake));

            const response = await fetch("/api/preview", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(intake),
            });

            if (!response.ok) {
                throw new Error("Failed to generate preview");
            }

            const preview = await response.json();
            localStorage.setItem("preview", JSON.stringify(preview));

            router.push("/preview");
        } catch (error) {
            console.error("Error:", error);
            alert(t.error);
            setCurrentStep(11); // Voltar para a última etapa em caso de erro
        } finally {
            setLoading(false);
        }
    };

    const updateField = (field: string, value: any) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const nextStep = () => {
        if (currentStep === 11) {
            // Na última etapa, submeter o formulário
            handleSubmit(new Event('submit') as any);
        } else {
            setCurrentStep((s) => Math.min(s + 1, totalSteps));
        }
    };

    const prevStep = () => {
        setCurrentStep((s) => Math.max(s - 1, 1));
    };

    const canProceed = () => {
        switch (currentStep) {
            case 1:
                return formData.name.trim() !== "";
            case 2:
                return formData.email.trim() !== "";
            case 3:
                return formData.age !== "" && parseInt(formData.age) >= 10;
            case 4:
                return true; // Gender sempre tem um valor padrão
            case 5:
                return formData.weight !== "" && parseFloat(formData.weight) > 0;
            case 6:
                return formData.height !== "" && parseFloat(formData.height) > 0;
            case 7:
                return formData.goals.length > 0;
            case 8:
                return formData.style !== "";
            case 9:
                return formData.activityLevel !== "";
            case 10:
                return true; // Restrições são opcionais
            case 11:
                return true; // Budget e skill têm valores padrão
            case 12:
                return false; // Etapa de loading, não pode avançar
            default:
                return false;
        }
    };

    const renderStep = () => {
        switch (currentStep) {
            case 1:
                return (
                    <div className="step-content">
                        <h2>{t.steps.name.title}</h2>
                        <p className="step-description">{t.steps.name.description}</p>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => updateField("name", e.target.value)}
                            placeholder={t.steps.name.placeholder}
                            autoFocus
                            className="input-large"
                        />
                    </div>
                );

            case 2:
                return (
                    <div className="step-content">
                        <h2>{t.steps.email.title}</h2>
                        <p className="step-description">{t.steps.email.description}</p>
                        <input
                            type="email"
                            value={formData.email}
                            onChange={(e) => updateField("email", e.target.value)}
                            placeholder={t.steps.email.placeholder}
                            autoFocus
                            className="input-large"
                        />
                    </div>
                );

            case 3:
                return (
                    <div className="step-content">
                        <h2>{t.steps.age.title}</h2>
                        <p className="step-description">{t.steps.age.description}</p>
                        <input
                            type="number"
                            value={formData.age}
                            onChange={(e) => updateField("age", e.target.value)}
                            placeholder="25"
                            min="10"
                            max="100"
                            autoFocus
                            className="input-large"
                        />
                    </div>
                );

            case 4:
                return (
                    <div className="step-content">
                        <h2>{t.steps.gender.title}</h2>
                        <p className="step-description">{t.steps.gender.description}</p>
                        <div className="options-grid">
                            <button
                                type="button"
                                className={`option-card ${formData.gender === "male" ? "selected" : ""}`}
                                onClick={() => updateField("gender", "male")}
                            >
                                <span className="option-icon">👨</span>
                                <span className="option-label">{t.steps.gender.male}</span>
                            </button>
                            <button
                                type="button"
                                className={`option-card ${formData.gender === "female" ? "selected" : ""}`}
                                onClick={() => updateField("gender", "female")}
                            >
                                <span className="option-icon">👩</span>
                                <span className="option-label">{t.steps.gender.female}</span>
                            </button>
                            <button
                                type="button"
                                className={`option-card ${formData.gender === "other" ? "selected" : ""}`}
                                onClick={() => updateField("gender", "other")}
                            >
                                <span className="option-icon">⚧️</span>
                                <span className="option-label">{t.steps.gender.other}</span>
                            </button>
                        </div>
                    </div>
                );

            case 5:
                return (
                    <div className="step-content">
                        <h2>{t.steps.weight.title}</h2>
                        <p className="step-description">{t.steps.weight.description}</p>
                        <div className="input-with-unit">
                            <input
                                type="number"
                                value={formData.weight}
                                onChange={(e) => updateField("weight", e.target.value)}
                                placeholder="70"
                                min="30"
                                max="300"
                                step="0.1"
                                autoFocus
                                className="input-large"
                            />
                            <span className="unit">kg</span>
                        </div>
                    </div>
                );

            case 6:
                return (
                    <div className="step-content">
                        <h2>{t.steps.height.title}</h2>
                        <p className="step-description">{t.steps.height.description}</p>
                        <div className="input-with-unit">
                            <input
                                type="number"
                                value={formData.height}
                                onChange={(e) => updateField("height", e.target.value)}
                                placeholder="170"
                                min="100"
                                max="250"
                                autoFocus
                                className="input-large"
                            />
                            <span className="unit">cm</span>
                        </div>
                    </div>
                );

            case 7:
                return (
                    <div className="step-content">
                        <h2>{t.steps.goals.title}</h2>
                        <p className="step-description">{t.steps.goals.description}</p>
                        <div className="options-grid">
                            {t.steps.goals.options.map((option) => (
                                <button
                                    key={option.value}
                                    type="button"
                                    className={`option-card ${formData.goals.includes(option.value) ? "selected" : ""
                                        }`}
                                    onClick={() => {
                                        if (formData.goals.includes(option.value)) {
                                            updateField(
                                                "goals",
                                                formData.goals.filter((g) => g !== option.value)
                                            );
                                        } else {
                                            updateField("goals", [...formData.goals, option.value]);
                                        }
                                    }}
                                >
                                    <span className="option-icon">{option.icon}</span>
                                    <span className="option-label">{option.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                );

            case 8:
                return (
                    <div className="step-content">
                        <h2>{t.steps.style.title}</h2>
                        <p className="step-description">{t.steps.style.description}</p>
                        <div className="options-grid">
                            {t.steps.style.options.map((option) => (
                                <button
                                    key={option.value}
                                    type="button"
                                    className={`option-card ${formData.style === option.value ? "selected" : ""
                                        }`}
                                    onClick={() => updateField("style", option.value)}
                                >
                                    <span className="option-icon">{option.icon}</span>
                                    <span className="option-label">{option.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                );

            case 9:
                return (
                    <div className="step-content">
                        <h2>{t.steps.activity.title}</h2>
                        <p className="step-description">{t.steps.activity.description}</p>
                        <div className="options-list">
                            {t.steps.activity.options.map((option) => (
                                <button
                                    key={option.value}
                                    type="button"
                                    className={`option-list-item ${formData.activityLevel === option.value ? "selected" : ""
                                        }`}
                                    onClick={() => updateField("activityLevel", option.value)}
                                >
                                    <span className="option-icon">{option.icon}</span>
                                    <div className="option-text">
                                        <span className="option-label">{option.label}</span>
                                        <span className="option-description">{option.description}</span>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                );

            case 10:
                return (
                    <div className="step-content">
                        <h2>{t.steps.restrictions.title}</h2>
                        <p className="step-description">{t.steps.restrictions.description}</p>
                        <div className="options-grid small">
                            {t.steps.restrictions.options.map((option) => (
                                <button
                                    key={option.value}
                                    type="button"
                                    className={`option-card small ${formData.restrictions.includes(option.value) ? "selected" : ""
                                        }`}
                                    onClick={() => {
                                        if (formData.restrictions.includes(option.value)) {
                                            updateField(
                                                "restrictions",
                                                formData.restrictions.filter((r) => r !== option.value)
                                            );
                                        } else {
                                            updateField("restrictions", [
                                                ...formData.restrictions,
                                                option.value,
                                            ]);
                                        }
                                    }}
                                >
                                    <span className="option-label">{option.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                );

            case 11:
                return (
                    <div className="step-content">
                        <h2>{t.steps.final.title}</h2>
                        <p className="step-description">{t.steps.final.description}</p>

                        <div className="final-options">
                            <div className="option-group">
                                <label>{t.steps.final.meals}</label>
                                <select
                                    value={formData.mealsPerDay}
                                    onChange={(e) => updateField("mealsPerDay", e.target.value)}
                                    className="input-large"
                                >
                                    <option value="3">3</option>
                                    <option value="4">4</option>
                                    <option value="5">5</option>
                                    <option value="6">6</option>
                                </select>
                            </div>

                            <div className="option-group">
                                <label>{t.steps.final.budget}</label>
                                <div className="button-group-inline">
                                    {t.steps.final.budgetOptions.map((option) => (
                                        <button
                                            key={option.value}
                                            type="button"
                                            className={`btn-option ${formData.budget === option.value ? "selected" : ""
                                                }`}
                                            onClick={() => updateField("budget", option.value)}
                                        >
                                            {option.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="option-group">
                                <label>{t.steps.final.skill}</label>
                                <div className="button-group-inline">
                                    {t.steps.final.skillOptions.map((option) => (
                                        <button
                                            key={option.value}
                                            type="button"
                                            className={`btn-option ${formData.cookingSkill === option.value ? "selected" : ""
                                                }`}
                                            onClick={() => updateField("cookingSkill", option.value)}
                                        >
                                            {option.label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                );

            case 12:
                return (
                    <div className="step-content loading-step">
                        <div className="loading-animation">
                            <div className="spinner"></div>
                        </div>
                        <h2>{t.steps.loading.title}</h2>
                        <p className="step-description">{t.steps.loading.description}</p>
                        <div className="loading-messages">
                            <p>✨ {t.steps.loading.messages[0]}</p>
                            <p>🧮 {t.steps.loading.messages[1]}</p>
                            <p>🥗 {t.steps.loading.messages[2]}</p>
                            <p>📋 {t.steps.loading.messages[3]}</p>
                        </div>
                    </div>
                );

            default:
                return null;
        }
    };

    return (
        <div className="quiz-container">
            <div className="quiz-header">
                <h1>{t.title}</h1>
                <div className="progress-container">
                    <div className="progress-bar">
                        <div
                            className="progress-fill"
                            style={{ width: `${(currentStep / totalSteps) * 100}%` }}
                        />
                    </div>
                    <p className="progress-text">
                        {t.step} {currentStep} {t.of} {totalSteps}
                    </p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="quiz-form">
                {renderStep()}

                {currentStep !== 12 && (
                    <div className="button-container">
                        {currentStep > 1 && (
                            <button type="button" onClick={prevStep} className="btn-back">
                                ← {t.back}
                            </button>
                        )}

                        {currentStep < 11 ? (
                            <button
                                type="button"
                                onClick={nextStep}
                                className="btn-next"
                                disabled={!canProceed()}
                            >
                                {t.next} →
                            </button>
                        ) : (
                            <button
                                type="button"
                                onClick={nextStep}
                                className="btn-submit"
                                disabled={loading || !canProceed()}
                            >
                                {t.submit}
                            </button>
                        )}
                    </div>
                )}
            </form>

            <style jsx>{`
                .loading-step {
                    text-align: center;
                    padding: 40px 20px;
                }

                .loading-animation {
                    margin-bottom: 30px;
                }

                .spinner {
                    width: 80px;
                    height: 80px;
                    margin: 0 auto;
                    border: 6px solid #f3f3f3;
                    border-top: 6px solid #667eea;
                    border-radius: 50%;
                    animation: spin 1s linear infinite;
                }

                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }

                .loading-messages {
                    margin-top: 40px;
                    display: flex;
                    flex-direction: column;
                    gap: 15px;
                }

                .loading-messages p {
                    font-size: 1.1rem;
                    color: #555;
                    animation: fadeIn 0.5s ease-in;
                }

                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </div>
    );
}

const translations = {
    "pt-BR": {
        title: "Crie seu Plano Alimentar",
        step: "Etapa",
        of: "de",
        back: "Voltar",
        next: "Próximo",
        submit: "Gerar Prévia",
        generating: "Gerando...",
        error: "Erro ao gerar prévia. Tente novamente.",
        steps: {
            name: {
                title: "Qual é o seu nome?",
                description: "Vamos personalizar sua experiência",
                placeholder: "Digite seu nome completo",
            },
            email: {
                title: "Qual é o seu email?",
                description: "Enviaremos seu plano alimentar para este endereço",
                placeholder: "seu@email.com",
            },
            age: {
                title: "Qual é a sua idade?",
                description: "Isso nos ajuda a calcular suas necessidades nutricionais",
            },
            gender: {
                title: "Qual é o seu sexo?",
                description: "Selecione a opção que melhor te representa",
                male: "Masculino",
                female: "Feminino",
                other: "Outro",
            },
            weight: {
                title: "Qual é o seu peso atual?",
                description: "Em quilogramas (kg)",
            },
            height: {
                title: "Qual é a sua altura?",
                description: "Em centímetros (cm)",
            },
            goals: {
                title: "Quais são seus objetivos?",
                description: "Você pode selecionar mais de um",
                options: [
                    { value: "perder peso", label: "Perder peso", icon: "📉" },
                    { value: "ganhar massa muscular", label: "Ganhar massa", icon: "💪" },
                    { value: "manter peso", label: "Manter peso", icon: "⚖️" },
                    { value: "melhorar saúde", label: "Melhorar saúde", icon: "❤️" },
                    { value: "aumentar energia", label: "Mais energia", icon: "⚡" },
                    { value: "melhorar digestão", label: "Melhorar digestão", icon: "🌿" },
                ],
            },
            style: {
                title: "Qual é o seu estilo alimentar?",
                description: "Escolha o que melhor se encaixa com você",
                options: [
                    { value: "flexível - como de tudo", label: "Como de tudo", icon: "🍽️" },
                    { value: "onívoro", label: "Onívoro", icon: "🥩" },
                    { value: "vegetariano", label: "Vegetariano", icon: "🥗" },
                    { value: "vegano", label: "Vegano", icon: "🌱" },
                    { value: "low carb", label: "Low Carb", icon: "🥑" },
                    { value: "keto", label: "Keto", icon: "🥓" },
                ],
            },
            activity: {
                title: "Qual é o seu nível de atividade física?",
                description: "Isso afeta suas necessidades calóricas",
                options: [
                    {
                        value: "sedentário",
                        label: "Sedentário",
                        description: "Pouco ou nenhum exercício",
                        icon: "🛋️",
                    },
                    {
                        value: "leve",
                        label: "Leve",
                        description: "Exercício 1-2x por semana",
                        icon: "🚶",
                    },
                    {
                        value: "moderado",
                        label: "Moderado",
                        description: "Exercício 3-4x por semana",
                        icon: "🏃",
                    },
                    {
                        value: "intenso",
                        label: "Intenso",
                        description: "Exercício 5-7x por semana",
                        icon: "🏋️",
                    },
                ],
            },
            restrictions: {
                title: "Você tem alguma restrição alimentar?",
                description: "Selecione todas que se aplicam (opcional)",
                options: [
                    { value: "lactose", label: "Lactose" },
                    { value: "glúten", label: "Glúten" },
                    { value: "nozes e castanhas", label: "Nozes" },
                    { value: "frutos do mar", label: "Frutos do mar" },
                    { value: "soja", label: "Soja" },
                    { value: "ovos", label: "Ovos" },
                ],
            },
            final: {
                title: "Últimos detalhes",
                description: "Personalize ainda mais seu plano",
                meals: "Quantas refeições por dia?",
                budget: "Orçamento",
                budgetOptions: [
                    { value: "low", label: "Econômico" },
                    { value: "medium", label: "Médio" },
                    { value: "high", label: "Alto" },
                ],
                skill: "Habilidade culinária",
                skillOptions: [
                    { value: "beginner", label: "Iniciante" },
                    { value: "intermediate", label: "Intermediário" },
                    { value: "advanced", label: "Avançado" },
                ],
            },
            loading: {
                title: "Gerando seu plano personalizado...",
                description: "Por favor, aguarde enquanto criamos seu plano alimentar perfeito",
                messages: [
                    "Analisando suas informações",
                    "Calculando necessidades nutricionais",
                    "Selecionando receitas personalizadas",
                    "Finalizando seu plano",
                ],
            },
        },
    },
    en: {
        title: "Create Your Meal Plan",
        step: "Step",
        of: "of",
        back: "Back",
        next: "Next",
        submit: "Generate Preview",
        generating: "Generating...",
        error: "Error generating preview. Please try again.",
        steps: {
            name: {
                title: "What's your name?",
                description: "Let's personalize your experience",
                placeholder: "Enter your full name",
            },
            email: {
                title: "What's your email?",
                description: "We'll send your meal plan to this address",
                placeholder: "your@email.com",
            },
            age: {
                title: "What's your age?",
                description: "This helps us calculate your nutritional needs",
            },
            gender: {
                title: "What's your gender?",
                description: "Select the option that best represents you",
                male: "Male",
                female: "Female",
                other: "Other",
            },
            weight: {
                title: "What's your current weight?",
                description: "In kilograms (kg)",
            },
            height: {
                title: "What's your height?",
                description: "In centimeters (cm)",
            },
            goals: {
                title: "What are your goals?",
                description: "You can select more than one",
                options: [
                    { value: "lose weight", label: "Lose weight", icon: "📉" },
                    { value: "gain muscle", label: "Gain muscle", icon: "💪" },
                    { value: "maintain weight", label: "Maintain weight", icon: "⚖️" },
                    { value: "improve health", label: "Improve health", icon: "❤️" },
                    { value: "increase energy", label: "More energy", icon: "⚡" },
                    { value: "improve digestion", label: "Better digestion", icon: "🌿" },
                ],
            },
            style: {
                title: "What's your dietary style?",
                description: "Choose what fits you best",
                options: [
                    { value: "flexible - eat everything", label: "Eat everything", icon: "🍽️" },
                    { value: "omnivore", label: "Omnivore", icon: "🥩" },
                    { value: "vegetarian", label: "Vegetarian", icon: "🥗" },
                    { value: "vegan", label: "Vegan", icon: "🌱" },
                    { value: "low carb", label: "Low Carb", icon: "🥑" },
                    { value: "keto", label: "Keto", icon: "🥓" },
                ],
            },
            activity: {
                title: "What's your activity level?",
                description: "This affects your caloric needs",
                options: [
                    {
                        value: "sedentary",
                        label: "Sedentary",
                        description: "Little or no exercise",
                        icon: "🛋️",
                    },
                    {
                        value: "light",
                        label: "Light",
                        description: "Exercise 1-2x per week",
                        icon: "🚶",
                    },
                    {
                        value: "moderate",
                        label: "Moderate",
                        description: "Exercise 3-4x per week",
                        icon: "🏃",
                    },
                    {
                        value: "intense",
                        label: "Intense",
                        description: "Exercise 5-7x per week",
                        icon: "🏋️",
                    },
                ],
            },
            restrictions: {
                title: "Do you have any dietary restrictions?",
                description: "Select all that apply (optional)",
                options: [
                    { value: "lactose", label: "Lactose" },
                    { value: "gluten", label: "Gluten" },
                    { value: "nuts", label: "Nuts" },
                    { value: "seafood", label: "Seafood" },
                    { value: "soy", label: "Soy" },
                    { value: "eggs", label: "Eggs" },
                ],
            },
            final: {
                title: "Final details",
                description: "Customize your plan even more",
                meals: "How many meals per day?",
                budget: "Budget",
                budgetOptions: [
                    { value: "low", label: "Budget-friendly" },
                    { value: "medium", label: "Medium" },
                    { value: "high", label: "Premium" },
                ],
                skill: "Cooking skill",
                skillOptions: [
                    { value: "beginner", label: "Beginner" },
                    { value: "intermediate", label: "Intermediate" },
                    { value: "advanced", label: "Advanced" },
                ],
            },
            loading: {
                title: "Generating your personalized plan...",
                description: "Please wait while we create your perfect meal plan",
                messages: [
                    "Analyzing your information",
                    "Calculating nutritional needs",
                    "Selecting personalized recipes",
                    "Finalizing your plan",
                ],
            },
        },
    },
};
