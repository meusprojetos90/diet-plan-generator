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
        targetWeight: "",
        gender: "other" as "male" | "female" | "other",
        goals: [] as string[],
        restrictions: [] as string[],
        style: "",
        activityLevel: "",
        workoutLocation: "" as "home" | "gym" | "",
        injuries: [] as string[],
        preferredWorkoutTime: "",
        mealsPerDay: "4",
        budget: "medium" as "low" | "medium" | "high",
        cookingSkill: "intermediate" as "beginner" | "intermediate" | "advanced",
        abTestVariant: "A" as "A" | "B",
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

    // Total de etapas (agora 18 com as novas perguntas)
    const totalSteps = 18;

    // Inicializar teste A/B
    useEffect(() => {
        if (formData.abTestVariant === "A") {
            // Randomizar variante apenas uma vez
            const variant = Math.random() < 0.5 ? "A" : "B";
            setFormData(prev => ({ ...prev, abTestVariant: variant }));
        }
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Avançar para a etapa de loading
        setCurrentStep(18);
        setLoading(true);

        try {
            const intake = {
                ...formData,
                age: parseInt(formData.age),
                weight: parseFloat(formData.weight),
                height: parseFloat(formData.height),
                targetWeight: formData.targetWeight ? parseFloat(formData.targetWeight) : undefined,
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
            setCurrentStep(17); // Voltar para a última etapa em caso de erro
        } finally {
            setLoading(false);
        }
    };

    const updateField = (field: string, value: any) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const nextStep = () => {
        if (currentStep === 17) {
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
                return true; // Prova social (informativo)
            case 3:
                return formData.email.trim() !== "";
            case 4:
                return true; // Especialista (informativo)
            case 5:
                return formData.age !== "" && parseInt(formData.age) >= 10;
            case 6:
                return true; // Gender sempre tem um valor padrão
            case 7:
                return formData.weight !== "" && parseFloat(formData.weight) > 0;
            case 8:
                return formData.targetWeight !== "" && parseFloat(formData.targetWeight) > 0;
            case 9:
                return formData.height !== "" && parseFloat(formData.height) > 0;
            case 10:
                return formData.goals.length > 0;
            case 11:
                return formData.style !== "";
            case 12:
                return formData.activityLevel !== "";
            case 13:
                return formData.workoutLocation !== "";
            case 14:
                return true; // Lesões são opcionais
            case 15:
                return formData.preferredWorkoutTime !== "";
            case 16:
                return true; // Restrições são opcionais
            case 17:
                return true; // Budget e skill têm valores padrão
            case 18:
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
                    <div className="step-content social-proof">
                        <h2>{t.steps.socialProof.title}</h2>
                        <p className="step-description">{t.steps.socialProof.description}</p>
                        <div className="testimonials-grid">
                            {t.steps.socialProof.testimonials.map((testimonial: any, index: number) => (
                                <div key={index} className="testimonial-card">
                                    <div className="testimonial-header">
                                        <div className="avatar">{testimonial.avatar}</div>
                                        <div>
                                            <div className="name">{testimonial.name}</div>
                                            <div className="result">{testimonial.result}</div>
                                        </div>
                                    </div>
                                    <p className="testimonial-text">"{testimonial.text}"</p>
                                </div>
                            ))}
                        </div>
                        <div className="stats-row">
                            <div className="stat-item">
                                <div className="stat-number">10.000+</div>
                                <div className="stat-label">{t.steps.socialProof.stats.users}</div>
                            </div>
                            <div className="stat-item">
                                <div className="stat-number">4.9⭐</div>
                                <div className="stat-label">{t.steps.socialProof.stats.rating}</div>
                            </div>
                            <div className="stat-item">
                                <div className="stat-number">95%</div>
                                <div className="stat-label">{t.steps.socialProof.stats.success}</div>
                            </div>
                        </div>
                    </div>
                );

            case 3: // Was case 2
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

            case 4:
                return (
                    <div className="step-content expert-card">
                        <h2>{t.steps.expert.title}</h2>
                        <p className="step-description">{t.steps.expert.description}</p>
                        <div className="expert-profile">
                            <div className="expert-avatar">👨‍⚕️</div>
                            <div className="expert-info">
                                <h3>{t.steps.expert.expertName}</h3>
                                <p className="credentials">{t.steps.expert.credentials}</p>
                                <p className="experience">✨ {t.steps.expert.experience}</p>
                            </div>
                        </div>
                        <div className="specialties">
                            <h4>Especialidades:</h4>
                            <div className="specialties-grid">
                                {t.steps.expert.specialties.map((specialty: string, index: number) => (
                                    <div key={index} className="specialty-badge">
                                        ✓ {specialty}
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="expert-message">
                            <p>"{t.steps.expert.message}"</p>
                        </div>
                    </div>
                );

            case 5:
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

            case 6:
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

            case 7:
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

            case 8:
                const weightDiff = formData.targetWeight && formData.weight
                    ? Math.abs(parseFloat(formData.targetWeight) - parseFloat(formData.weight))
                    : 0;
                const isGaining = formData.targetWeight && formData.weight
                    ? parseFloat(formData.targetWeight) > parseFloat(formData.weight)
                    : false;

                return (
                    <div className="step-content">
                        <h2>{t.steps.targetWeight.title}</h2>
                        <p className="step-description">{t.steps.targetWeight.description}</p>
                        <div className="input-with-unit">
                            <input
                                type="number"
                                value={formData.targetWeight}
                                onChange={(e) => updateField("targetWeight", e.target.value)}
                                placeholder="65"
                                min="30"
                                max="300"
                                step="0.1"
                                autoFocus
                                className="input-large"
                            />
                            <span className="unit">kg</span>
                        </div>
                        {formData.weight && formData.targetWeight && (
                            <div className="weight-journey">
                                <h3>{t.steps.targetWeight.journey}</h3>
                                <div className="journey-cards">
                                    <div className="journey-card">
                                        <div className="card-label">{t.steps.targetWeight.current}</div>
                                        <div className="card-value">{formData.weight}kg</div>
                                    </div>
                                    <div className="journey-arrow">→</div>
                                    <div className="journey-card target">
                                        <div className="card-label">{t.steps.targetWeight.target}</div>
                                        <div className="card-value">{formData.targetWeight}kg</div>
                                    </div>
                                </div>
                                <div className="journey-difference">
                                    <strong>{t.steps.targetWeight.difference}:</strong> {weightDiff.toFixed(1)}kg {isGaining ? t.steps.targetWeight.toGain : t.steps.targetWeight.toLose}
                                </div>
                            </div>
                        )}
                    </div>
                );

            case 9:
                const calculateBMI = () => {
                    if (formData.weight && formData.height) {
                        const heightInMeters = parseFloat(formData.height) / 100;
                        const bmi = parseFloat(formData.weight) / (heightInMeters * heightInMeters);
                        return bmi.toFixed(1);
                    }
                    return null;
                };

                const getBMIClassification = (bmi: string | null) => {
                    if (!bmi) return "";
                    const bmiNum = parseFloat(bmi);
                    if (bmiNum < 18.5) return t.steps.bmi.underweight;
                    if (bmiNum < 25) return t.steps.bmi.normal;
                    if (bmiNum < 30) return t.steps.bmi.overweight;
                    return t.steps.bmi.obese;
                };

                const getBMIColor = (bmi: string | null) => {
                    if (!bmi) return "#667eea";
                    const bmiNum = parseFloat(bmi);
                    if (bmiNum < 18.5) return "#3b82f6";
                    if (bmiNum < 25) return "#10b981";
                    if (bmiNum < 30) return "#f59e0b";
                    return "#ef4444";
                };

                const bmi = calculateBMI();

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
                        {bmi && (
                            <div className="bmi-calculator">
                                <h3>{t.steps.bmi.title}</h3>
                                <div className="bmi-display">
                                    <div className="bmi-value" style={{ color: getBMIColor(bmi) }}>
                                        {bmi}
                                    </div>
                                    <div className="bmi-classification">
                                        <strong>{t.steps.bmi.classification}:</strong> {getBMIClassification(bmi)}
                                    </div>
                                </div>
                                <div className="bmi-scale">
                                    <div className="scale-bar">
                                        <div className="scale-segment underweight"></div>
                                        <div className="scale-segment normal"></div>
                                        <div className="scale-segment overweight"></div>
                                        <div className="scale-segment obese"></div>
                                        <div
                                            className="scale-indicator"
                                            style={{
                                                left: `${Math.min(Math.max((parseFloat(bmi) - 15) / 25 * 100, 0), 100)}%`,
                                                backgroundColor: getBMIColor(bmi)
                                            }}
                                        ></div>
                                    </div>
                                    <div className="scale-labels">
                                        <span>15</span>
                                        <span>18.5</span>
                                        <span>25</span>
                                        <span>30</span>
                                        <span>40</span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                );

            case 10:
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

            case 11:
                const styleData = formData.abTestVariant === "B" ? t.steps.styleVariantB : t.steps.style;

                return (
                    <div className="step-content">
                        <h2>{styleData.title}</h2>
                        <p className="step-description">{styleData.description}</p>
                        <div className="options-grid">
                            {styleData.options.map((option) => (
                                <button
                                    key={option.value}
                                    type="button"
                                    className={`option-card ${formData.style === option.value ? "selected" : ""}`}
                                    onClick={() => updateField("style", option.value)}
                                >
                                    <span className="option-icon">{option.icon}</span>
                                    <span className="option-label">{option.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                );

            case 12:
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

            case 13:
                return (
                    <div className="step-content">
                        <h2>{t.steps.workoutLocation.title}</h2>
                        <p className="step-description">{t.steps.workoutLocation.description}</p>
                        <div className="options-grid">
                            <button
                                type="button"
                                className={`option-card ${formData.workoutLocation === "home" ? "selected" : ""}`}
                                onClick={() => updateField("workoutLocation", "home")}
                            >
                                <span className="option-icon">🏠</span>
                                <span className="option-label">{t.steps.workoutLocation.home}</span>
                            </button>
                            <button
                                type="button"
                                className={`option-card ${formData.workoutLocation === "gym" ? "selected" : ""}`}
                                onClick={() => updateField("workoutLocation", "gym")}
                            >
                                <span className="option-icon">🏋️</span>
                                <span className="option-label">{t.steps.workoutLocation.gym}</span>
                            </button>
                        </div>
                    </div>
                );

            case 14:
                return (
                    <div className="step-content">
                        <h2>{t.steps.injuries.title}</h2>
                        <p className="step-description">{t.steps.injuries.description}</p>
                        <div className="options-grid">
                            {t.steps.injuries.options.map((option: any) => (
                                <button
                                    key={option.value}
                                    type="button"
                                    className={`option-card ${formData.injuries.includes(option.value) ? "selected" : ""}`}
                                    onClick={() => {
                                        if (option.value === "nenhum" || option.value === "none") {
                                            updateField("injuries", [option.value]);
                                        } else {
                                            if (formData.injuries.includes(option.value)) {
                                                updateField(
                                                    "injuries",
                                                    formData.injuries.filter((i: string) => i !== option.value)
                                                );
                                            } else {
                                                const newInjuries = formData.injuries.filter((i: string) => i !== "nenhum" && i !== "none");
                                                updateField("injuries", [...newInjuries, option.value]);
                                            }
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

            case 15:
                return (
                    <div className="step-content">
                        <h2>{t.steps.workoutTime.title}</h2>
                        <p className="step-description">{t.steps.workoutTime.description}</p>
                        <div className="options-list">
                            {t.steps.workoutTime.options.map((option: any) => (
                                <button
                                    key={option.value}
                                    type="button"
                                    className={`option-list-item ${formData.preferredWorkoutTime === option.value ? "selected" : ""}`}
                                    onClick={() => updateField("preferredWorkoutTime", option.value)}
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

            case 16:
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

            case 17:
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

            case 18:
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

                {currentStep !== 18 && (
                    <div className="button-container">
                        {currentStep > 1 && (
                            <button type="button" onClick={prevStep} className="btn-back">
                                ← {t.back}
                            </button>
                        )}

                        {currentStep < 17 ? (
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

                /* Social Proof Styles */
                .social-proof {
                    max-width: 900px;
                    margin: 0 auto;
                }

                .social-proof h2 {
                    font-size: 2rem;
                    text-align: center;
                    margin-bottom: 10px;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                }

                .social-proof .step-description {
                    text-align: center;
                    font-size: 1.1rem;
                    margin-bottom: 40px;
                    color: #666;
                }

                .testimonials-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
                    gap: 25px;
                    margin: 40px 0;
                }

                .testimonial-card {
                    background: white;
                    padding: 25px;
                    border-radius: 20px;
                    box-shadow: 0 10px 30px rgba(102, 126, 234, 0.15);
                    border: 2px solid transparent;
                    transition: all 0.3s ease;
                    position: relative;
                    overflow: hidden;
                }

                .testimonial-card::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    height: 4px;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                }

                .testimonial-card:hover {
                    transform: translateY(-5px);
                    box-shadow: 0 15px 40px rgba(102, 126, 234, 0.25);
                    border-color: #667eea;
                }

                .testimonial-header {
                    display: flex;
                    align-items: center;
                    gap: 15px;
                    margin-bottom: 15px;
                }

                .testimonial-card .avatar {
                    font-size: 2.5rem;
                    width: 65px;
                    height: 65px;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
                }

                .testimonial-card .name {
                    font-weight: 700;
                    font-size: 1.15rem;
                    color: #333;
                    margin-bottom: 3px;
                }

                .testimonial-card .result {
                    font-size: 0.9rem;
                    color: #667eea;
                    font-weight: 600;
                    background: #f0f4ff;
                    padding: 4px 12px;
                    border-radius: 20px;
                    display: inline-block;
                    margin-top: 5px;
                }

                .testimonial-text {
                    font-style: italic;
                    line-height: 1.7;
                    color: #555;
                    font-size: 0.95rem;
                    margin-top: 15px;
                    position: relative;
                    padding-left: 15px;
                }

                .testimonial-text::before {
                    content: '"';
                    position: absolute;
                    left: 0;
                    top: -5px;
                    font-size: 2rem;
                    color: #667eea;
                    opacity: 0.3;
                }

                .stats-row {
                    display: flex;
                    justify-content: space-around;
                    gap: 30px;
                    margin-top: 50px;
                    padding: 30px;
                    background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
                    border-radius: 20px;
                    box-shadow: 0 5px 20px rgba(0, 0, 0, 0.05);
                }

                .stat-item {
                    text-align: center;
                    flex: 1;
                }

                .stat-number {
                    font-size: 2.5rem;
                    font-weight: 800;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                    margin-bottom: 8px;
                    display: block;
                }

                .stat-label {
                    font-size: 0.95rem;
                    color: #666;
                    font-weight: 500;
                }

                @media (max-width: 768px) {
                    .testimonials-grid {
                        grid-template-columns: 1fr;
                    }

                    .stats-row {
                        flex-direction: column;
                        gap: 20px;
                    }

                    .social-proof h2 {
                        font-size: 1.6rem;
                    }
                }

                /* Expert Card Styles */
                .expert-profile {
                    display: flex;
                    align-items: center;
                    gap: 20px;
                    padding: 25px;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    border-radius: 15px;
                    color: white;
                    margin: 20px 0;
                }

                .expert-avatar {
                    font-size: 4rem;
                    width: 100px;
                    height: 100px;
                    background: rgba(255, 255, 255, 0.2);
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .expert-info h3 {
                    margin: 0 0 10px 0;
                    font-size: 1.5rem;
                }

                .expert-info .credentials,
                .expert-info .experience {
                    margin: 5px 0;
                    opacity: 0.95;
                }

                .specialties {
                    margin: 20px 0;
                }

                .specialties h4 {
                    margin-bottom: 15px;
                    color: #333;
                }

                .specialties-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                    gap: 10px;
                }

                .specialty-badge {
                    padding: 12px 15px;
                    background: #f0f4ff;
                    border-radius: 10px;
                    color: #667eea;
                    font-weight: 500;
                }

                .expert-message {
                    padding: 20px;
                    background: #f8f9fa;
                    border-left: 4px solid #667eea;
                    border-radius: 10px;
                    font-style: italic;
                    margin-top: 20px;
                }

                /* Weight Journey Styles */
                .weight-journey {
                    margin-top: 30px;
                    padding: 25px;
                    background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
                    border-radius: 15px;
                }

                .weight-journey h3 {
                    margin: 0 0 20px 0;
                    color: #333;
                    text-align: center;
                }

                .journey-cards {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 20px;
                    flex-wrap: wrap;
                }

                .journey-card {
                    padding: 20px 30px;
                    background: white;
                    border-radius: 12px;
                    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
                    text-align: center;
                    min-width: 150px;
                }

                .journey-card.target {
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                }

                .journey-card .card-label {
                    font-size: 0.9rem;
                    opacity: 0.8;
                    margin-bottom: 8px;
                }

                .journey-card .card-value {
                    font-size: 2rem;
                    font-weight: 700;
                }

                .journey-arrow {
                    font-size: 2rem;
                    color: #667eea;
                }

                .journey-difference {
                    text-align: center;
                    margin-top: 20px;
                    font-size: 1.1rem;
                    color: #333;
                }

                /* BMI Calculator Styles */
                .bmi-calculator {
                    margin-top: 30px;
                    padding: 25px;
                    background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
                    border-radius: 15px;
                }

                .bmi-calculator h3 {
                    margin: 0 0 20px 0;
                    color: #333;
                    text-align: center;
                }

                .bmi-display {
                    text-align: center;
                    margin-bottom: 25px;
                }

                .bmi-value {
                    font-size: 3.5rem;
                    font-weight: 700;
                    margin-bottom: 10px;
                }

                .bmi-classification {
                    font-size: 1.1rem;
                    color: #555;
                }

                .bmi-scale {
                    margin-top: 20px;
                }

                .scale-bar {
                    position: relative;
                    height: 40px;
                    border-radius: 20px;
                    overflow: hidden;
                    display: flex;
                    margin-bottom: 10px;
                }

                .scale-segment {
                    flex: 1;
                    height: 100%;
                }

                .scale-segment.underweight {
                    background: #3b82f6;
                }

                .scale-segment.normal {
                    background: #10b981;
                }

                .scale-segment.overweight {
                    background: #f59e0b;
                }

                .scale-segment.obese {
                    background: #ef4444;
                }

                .scale-indicator {
                    position: absolute;
                    top: -5px;
                    width: 4px;
                    height: 50px;
                    background: white;
                    border: 2px solid #333;
                    border-radius: 2px;
                    transform: translateX(-50%);
                    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
                }

                .scale-labels {
                    display: flex;
                    justify-content: space-between;
                    font-size: 0.85rem;
                    color: #666;
                    padding: 0 5px;
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
            socialProof: {
                title: "Junte-se a milhares de pessoas transformando suas vidas! 🎉",
                description: "Veja o que nossos clientes alcançaram",
                testimonials: [
                    {
                        avatar: "👨",
                        name: "Carlos M.",
                        result: "Perdeu 15kg em 3 meses",
                        text: "Finalmente encontrei um plano que funciona! Perdi peso sem passar fome."
                    },
                    {
                        avatar: "👩",
                        name: "Ana P.",
                        result: "Ganhou 8kg de massa muscular",
                        text: "Os treinos personalizados fizeram toda a diferença. Estou mais forte que nunca!"
                    },
                    {
                        avatar: "👨",
                        name: "Roberto S.",
                        result: "Melhorou saúde e energia",
                        text: "Minha disposição aumentou muito. Não sinto mais aquele cansaço do meio do dia."
                    }
                ],
                stats: {
                    users: "Usuários ativos",
                    rating: "Avaliação média",
                    success: "Taxa de sucesso"
                }
            },
            expert: {
                title: "Seu plano será criado por especialistas 👨‍⚕️",
                description: "Conheça quem vai cuidar da sua transformação",
                expertName: "Dr. Nutrição IA",
                credentials: "Nutricionista Especializado • CRN 12345",
                experience: "Mais de 10.000 planos personalizados criados",
                specialties: [
                    "Emagrecimento saudável",
                    "Ganho de massa muscular",
                    "Nutrição esportiva",
                    "Reeducação alimentar"
                ],
                message: "Vou criar um plano 100% personalizado baseado nas suas necessidades, objetivos e preferências. Cada refeição e treino será pensado especialmente para você!"
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
            targetWeight: {
                title: "Qual é o seu peso desejado?",
                description: "Vamos traçar sua jornada de transformação",
                current: "Peso Atual",
                target: "Peso Desejado",
                difference: "Diferença",
                toGain: "a ganhar",
                toLose: "a perder",
                journey: "Sua Jornada",
            },
            bmi: {
                title: "Seu IMC (Índice de Massa Corporal)",
                description: "Baseado no seu peso e altura",
                underweight: "Abaixo do peso",
                normal: "Peso normal",
                overweight: "Sobrepeso",
                obese: "Obesidade",
                classification: "Classificação",
            },
            injuries: {
                title: "Você tem algum problema de articulação ou lesão?",
                description: "Vamos adaptar os exercícios para você treinar com segurança",
                options: [
                    { value: "joelho", label: "Joelho", icon: "🦵" },
                    { value: "ombro", label: "Ombro", icon: "💪" },
                    { value: "coluna", label: "Coluna/Lombar", icon: "🔙" },
                    { value: "punho", label: "Punho", icon: "✋" },
                    { value: "tornozelo", label: "Tornozelo", icon: "🦶" },
                    { value: "cotovelo", label: "Cotovelo", icon: "💪" },
                    { value: "nenhum", label: "Nenhum problema", icon: "✅" },
                ],
            },
            workoutTime: {
                title: "Qual o melhor horário para você treinar?",
                description: "Vamos personalizar os horários dos seus treinos",
                options: [
                    { value: "manha", label: "Manhã", description: "6h - 10h", icon: "🌅" },
                    { value: "meio-dia", label: "Meio-dia", description: "10h - 14h", icon: "☀️" },
                    { value: "tarde", label: "Tarde", description: "14h - 18h", icon: "🌤️" },
                    { value: "noite", label: "Noite", description: "18h - 22h", icon: "🌙" },
                    { value: "flexivel", label: "Flexível", description: "Qualquer horário", icon: "🔄" },
                ],
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
            styleVariantB: {
                title: "Que tipo de alimentação vai te levar aos seus resultados?",
                description: "Escolha o estilo que mais combina com seu objetivo",
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
            workoutLocation: {
                title: "Onde você vai treinar?",
                description: "Vamos personalizar os exercícios para o seu local de treino",
                home: "Em casa",
                gym: "Na academia",
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
            socialProof: {
                title: "Join thousands transforming their lives! 🎉",
                description: "See what our clients have achieved",
                testimonials: [
                    {
                        avatar: "👨",
                        name: "John D.",
                        result: "Lost 33lbs in 3 months",
                        text: "Finally found a plan that works! Lost weight without starving."
                    },
                    {
                        avatar: "👩",
                        name: "Sarah M.",
                        result: "Gained 18lbs of muscle",
                        text: "The personalized workouts made all the difference. I'm stronger than ever!"
                    },
                    {
                        avatar: "👨",
                        name: "Mike R.",
                        result: "Improved health & energy",
                        text: "My energy levels increased dramatically. No more afternoon crashes."
                    }
                ],
                stats: {
                    users: "Active users",
                    rating: "Average rating",
                    success: "Success rate"
                }
            },
            expert: {
                title: "Your plan will be created by experts 👨‍⚕️",
                description: "Meet who will take care of your transformation",
                expertName: "Dr. AI Nutrition",
                credentials: "Specialized Nutritionist • CRN 12345",
                experience: "Over 10,000 personalized plans created",
                specialties: [
                    "Healthy weight loss",
                    "Muscle gain",
                    "Sports nutrition",
                    "Nutritional reeducation"
                ],
                message: "I'll create a 100% personalized plan based on your needs, goals, and preferences. Every meal and workout will be designed especially for you!"
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
            targetWeight: {
                title: "What's your target weight?",
                description: "Let's map your transformation journey",
                current: "Current Weight",
                target: "Target Weight",
                difference: "Difference",
                toGain: "to gain",
                toLose: "to lose",
                journey: "Your Journey",
            },
            bmi: {
                title: "Your BMI (Body Mass Index)",
                description: "Based on your weight and height",
                underweight: "Underweight",
                normal: "Normal weight",
                overweight: "Overweight",
                obese: "Obesity",
                classification: "Classification",
            },
            injuries: {
                title: "Do you have any joint problems or injuries?",
                description: "We'll adapt exercises so you can train safely",
                options: [
                    { value: "knee", label: "Knee", icon: "🦵" },
                    { value: "shoulder", label: "Shoulder", icon: "💪" },
                    { value: "back", label: "Back/Lower back", icon: "🔙" },
                    { value: "wrist", label: "Wrist", icon: "✋" },
                    { value: "ankle", label: "Ankle", icon: "🦶" },
                    { value: "elbow", label: "Elbow", icon: "💪" },
                    { value: "none", label: "No problems", icon: "✅" },
                ],
            },
            workoutTime: {
                title: "What's the best time for you to workout?",
                description: "We'll personalize your workout schedule",
                options: [
                    { value: "morning", label: "Morning", description: "6am - 10am", icon: "🌅" },
                    { value: "midday", label: "Midday", description: "10am - 2pm", icon: "☀️" },
                    { value: "afternoon", label: "Afternoon", description: "2pm - 6pm", icon: "🌤️" },
                    { value: "evening", label: "Evening", description: "6pm - 10pm", icon: "🌙" },
                    { value: "flexible", label: "Flexible", description: "Any time", icon: "🔄" },
                ],
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
            styleVariantB: {
                title: "What type of diet will lead you to your results?",
                description: "Choose the style that best matches your goal",
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
            workoutLocation: {
                title: "Where will you work out?",
                description: "Let's customize exercises for your training location",
                home: "At home",
                gym: "At the gym",
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
