"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function PreviewPage() {
  const router = useRouter();
  const [preview, setPreview] = useState<any>(null);
  const [intake, setIntake] = useState<any>(null);
  const [selectedPlan, setSelectedPlan] = useState<string>("30");
  const [loading, setLoading] = useState(false);
  const [locale, setLocale] = useState<"pt-BR" | "en">("pt-BR");
  const [currency, setCurrency] = useState<"BRL" | "USD">("BRL");

  useEffect(() => {
    const storedPreview = localStorage.getItem("preview");
    const storedIntake = localStorage.getItem("intake");

    if (!storedPreview || !storedIntake) {
      router.push("/quiz");
      return;
    }

    const previewData = JSON.parse(storedPreview);
    const intakeData = JSON.parse(storedIntake);

    setPreview(previewData);
    setIntake(intakeData);
    setLocale(intakeData.locale || "pt-BR");
    setCurrency(intakeData.locale === "pt-BR" ? "BRL" : "USD");
  }, [router]);

  const t = translations[locale];
  const prices = pricingPlans[currency];

  const handleCheckout = async () => {
    setLoading(true);

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          days: selectedPlan,
          customerEmail: intake.email,
          customerName: intake.name,
          currency,
          intakeId: "temp-" + Date.now(), // In production, save to DB first
          intake: intake,
          preview: preview,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create checkout session");
      }

      const { url } = await response.json();
      window.location.href = url; // Redirect to Stripe
    } catch (error) {
      console.error("Error:", error);
      alert(t.error);
    } finally {
      setLoading(false);
    }
  };

  if (!preview || !intake) {
    return <div className="loading">{t?.loading || "Loading..."}</div>;
  }

  const day = preview.days[0];

  return (
    <div className="preview-container">
      <div className="preview-header">
        <h1>{t.title}</h1>
        <p>{t.subtitle}</p>
      </div>

      <div className="preview-content">
        <div className="preview-card">
          <h2>
            {t.day} 1 - {t.sample}
          </h2>

          <div className="day-summary">
            <div className="summary-item">
              <span className="label">{t.calories}:</span>
              <span className="value">{day.total_calories} kcal</span>
            </div>
            <div className="summary-item">
              <span className="label">{t.protein}:</span>
              <span className="value">{day.total_macros.protein}g</span>
            </div>
            <div className="summary-item">
              <span className="label">{t.carbs}:</span>
              <span className="value">{day.total_macros.carbs}g</span>
            </div>
            <div className="summary-item">
              <span className="label">{t.fat}:</span>
              <span className="value">{day.total_macros.fat}g</span>
            </div>
          </div>

          <div className="meals">
            {day.meals.map((meal: any, index: number) => (
              <div key={index} className="meal">
                <div className="meal-header">
                  <span className="meal-time">{meal.time}</span>
                  <h3>{meal.name}</h3>
                </div>
                <p className="recipe">{meal.recipe}</p>
                <div className="meal-macros">
                  <span>{meal.macros.calories} kcal</span>
                  <span>P: {meal.macros.protein}g</span>
                  <span>C: {meal.macros.carbs}g</span>
                  <span>G: {meal.macros.fat}g</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {day.workout && (
          <div className="preview-card workout-card">
            <h2>
              {t.workout.title} - {day.workout.focus}
            </h2>
            <div className="workout-summary">
              <div className="summary-item">
                <span className="label">{t.workout.duration}:</span>
                <span className="value">{day.workout.duration} min</span>
              </div>
              <div className="summary-item">
                <span className="label">{t.workout.exercises}:</span>
                <span className="value">{day.workout.exercises.length}</span>
              </div>
            </div>

            <div className="exercises">
              {day.workout.exercises.map((exercise: any, index: number) => (
                <div key={index} className="exercise">
                  <div className="exercise-header">
                    <h3>{exercise.name}</h3>
                    {exercise.equipment && (
                      <span className="equipment">{exercise.equipment}</span>
                    )}
                  </div>
                  <div className="exercise-details">
                    <span className="detail-item">
                      <strong>{t.workout.sets}:</strong> {exercise.sets}
                    </span>
                    <span className="detail-item">
                      <strong>{t.workout.reps}:</strong> {exercise.reps}
                    </span>
                    <span className="detail-item">
                      <strong>{t.workout.rest}:</strong> {exercise.rest}s
                    </span>
                  </div>
                  {exercise.technique && (
                    <p className="technique">
                      <strong>{t.workout.technique}:</strong> {exercise.technique}
                    </p>
                  )}
                </div>
              ))}
            </div>

            {day.workout.notes && (
              <div className="workout-notes">
                <strong>{t.workout.notes}:</strong> {day.workout.notes}
              </div>
            )}
          </div>
        )}

        <div className="pricing-section">
          <h2>{t.pricing.title}</h2>
          <p>{t.pricing.subtitle}</p>

          <div className="plan-options">
            {prices.map((plan) => (
              <label
                key={plan.days}
                className={`plan-option ${selectedPlan === plan.days.toString() ? "selected" : ""
                  }`}
              >
                <input
                  type="radio"
                  name="plan"
                  value={plan.days}
                  checked={selectedPlan === plan.days.toString()}
                  onChange={(e) => setSelectedPlan(e.target.value)}
                />
                <div className="plan-info">
                  <span className="plan-days">
                    {plan.days} {t.pricing.days}
                  </span>
                  <span className="plan-price">
                    {currency === "BRL" ? "R$" : "$"}
                    {plan.price}
                  </span>
                </div>
              </label>
            ))}
          </div>

          <button
            onClick={handleCheckout}
            disabled={loading}
            className="checkout-button"
          >
            {loading ? t.processing : t.checkout}
          </button>

          <Link href="/quiz" className="back-link">
            {t.back}
          </Link>
        </div>
      </div>

      <style jsx>{`
        .preview-container {
          min-height: 100vh;
          background: #f8f9fa;
          padding: 40px 20px;
        }

        .preview-header {
          max-width: 1200px;
          margin: 0 auto 40px;
          text-align: center;
        }

        .preview-header h1 {
          font-size: 2.5rem;
          color: #333;
          margin-bottom: 10px;
        }

        .preview-header p {
          font-size: 1.2rem;
          color: #666;
        }

        .preview-content {
          max-width: 1200px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: 30px;
        }

        .preview-card,
        .pricing-section {
          background: white;
          padding: 40px;
          border-radius: 15px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
        }

        .preview-card h2 {
          font-size: 1.8rem;
          color: #667eea;
          margin-bottom: 25px;
        }

        .day-summary {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 15px;
          margin-bottom: 30px;
          padding: 20px;
          background: #f8f9ff;
          border-radius: 10px;
        }

        .summary-item {
          text-align: center;
        }

        .summary-item .label {
          display: block;
          font-size: 0.9rem;
          color: #666;
          margin-bottom: 5px;
        }

        .summary-item .value {
          display: block;
          font-size: 1.3rem;
          font-weight: 700;
          color: #667eea;
        }

        .meals {
          display: flex;
          flex-direction: column;
          gap: 25px;
        }

        .meal {
          border: 2px solid #e0e0e0;
          border-radius: 10px;
          padding: 20px;
        }

        .meal-header {
          margin-bottom: 15px;
        }

        .meal-time {
          display: inline-block;
          background: #667eea;
          color: white;
          padding: 4px 12px;
          border-radius: 5px;
          font-size: 0.9rem;
          font-weight: 600;
          margin-bottom: 8px;
        }

        .meal h3 {
          font-size: 1.3rem;
          color: #333;
          margin-top: 8px;
        }

        .recipe {
          color: #555;
          line-height: 1.6;
          margin: 15px 0;
        }

        .meal-macros {
          display: flex;
          gap: 15px;
          font-size: 0.9rem;
          font-weight: 600;
          color: #667eea;
        }

        .workout-card {
          margin-top: 30px;
        }

        .workout-card h2 {
          font-size: 1.8rem;
          color: #667eea;
          margin-bottom: 25px;
        }

        .workout-summary {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 15px;
          margin-bottom: 30px;
          padding: 20px;
          background: #fff5f5;
          border-radius: 10px;
        }

        .exercises {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .exercise {
          border: 2px solid #e0e0e0;
          border-radius: 10px;
          padding: 20px;
          background: #fafafa;
        }

        .exercise-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 15px;
        }

        .exercise-header h3 {
          font-size: 1.2rem;
          color: #333;
          margin: 0;
        }

        .equipment {
          display: inline-block;
          background: #ff6b6b;
          color: white;
          padding: 4px 10px;
          border-radius: 5px;
          font-size: 0.85rem;
          font-weight: 600;
        }

        .exercise-details {
          display: flex;
          gap: 20px;
          margin-bottom: 12px;
          flex-wrap: wrap;
        }

        .detail-item {
          font-size: 0.95rem;
          color: #555;
        }

        .detail-item strong {
          color: #667eea;
        }

        .technique {
          color: #666;
          line-height: 1.6;
          margin: 10px 0 0;
          padding: 12px;
          background: white;
          border-left: 3px solid #667eea;
          border-radius: 5px;
        }

        .workout-notes {
          margin-top: 20px;
          padding: 15px;
          background: #fff9e6;
          border-left: 4px solid #ffc107;
          border-radius: 5px;
          color: #666;
        }

        .pricing-section h2 {
          font-size: 1.5rem;
          color: #333;
          margin-bottom: 10px;
        }

        .pricing-section p {
          color: #666;
          margin-bottom: 25px;
        }

        .plan-options {
          display: flex;
          flex-direction: column;
          gap: 15px;
          margin-bottom: 30px;
        }

        .plan-option {
          display: flex;
          align-items: center;
          padding: 20px;
          border: 2px solid #e0e0e0;
          border-radius: 10px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .plan-option:hover {
          border-color: #667eea;
          background: #f8f9ff;
        }

        .plan-option.selected {
          border-color: #667eea;
          background: #f8f9ff;
        }

        .plan-option input {
          margin-right: 15px;
        }

        .plan-info {
          display: flex;
          justify-content: space-between;
          flex: 1;
          align-items: center;
        }

        .plan-days {
          font-weight: 600;
          color: #333;
        }

        .plan-price {
          font-size: 1.5rem;
          font-weight: 700;
          color: #667eea;
        }

        .checkout-button {
          width: 100%;
          padding: 18px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border: none;
          border-radius: 50px;
          font-size: 1.1rem;
          font-weight: 600;
          cursor: pointer;
          transition: transform 0.2s;
          margin-bottom: 15px;
        }

        .checkout-button:hover:not(:disabled) {
          transform: translateY(-2px);
        }

        .checkout-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .back-link {
          display: block;
          text-align: center;
          color: #667eea;
          font-weight: 600;
        }

        .loading {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.5rem;
          color: #667eea;
        }

        @media (max-width: 968px) {
          .preview-content {
            grid-template-columns: 1fr;
          }

          .day-summary {
            grid-template-columns: repeat(2, 1fr);
          }
        }
      `}</style>
    </div >
  );
}

const translations = {
  "pt-BR": {
    title: "Prévia do seu Plano",
    subtitle: "Veja um exemplo de 1 dia do seu plano personalizado",
    day: "Dia",
    sample: "Amostra",
    calories: "Calorias",
    protein: "Proteínas",
    carbs: "Carboidratos",
    fat: "Gorduras",
    pricing: {
      title: "Escolha seu plano completo",
      subtitle: "Receba seu plano completo por email em até 3 horas",
      days: "dias",
    },
    workout: {
      title: "Treino do Dia",
      duration: "Duração",
      exercises: "Exercícios",
      sets: "Séries",
      reps: "Repetições",
      rest: "Descanso",
      technique: "Técnica",
      notes: "Observações",
    },
    checkout: "Finalizar Compra",
    processing: "Processando...",
    back: "← Voltar ao questionário",
    error: "Erro ao processar pagamento. Tente novamente.",
    loading: "Carregando...",
  },
  en: {
    title: "Your Plan Preview",
    subtitle: "See a 1-day sample of your personalized plan",
    day: "Day",
    sample: "Sample",
    calories: "Calories",
    protein: "Protein",
    carbs: "Carbs",
    fat: "Fat",
    pricing: {
      title: "Choose your full plan",
      subtitle: "Receive your complete plan via email within 3 hours",
      days: "days",
    },
    workout: {
      title: "Daily Workout",
      duration: "Duration",
      exercises: "Exercises",
      sets: "Sets",
      reps: "Reps",
      rest: "Rest",
      technique: "Technique",
      notes: "Notes",
    },
    checkout: "Checkout",
    processing: "Processing...",
    back: "← Back to quiz",
    error: "Error processing payment. Please try again.",
    loading: "Loading...",
  },
};

const pricingPlans = {
  BRL: [
    { days: 7, price: 19 },
    { days: 14, price: 29 },
    { days: 30, price: 39 },
    { days: 90, price: 59 },
  ],
  USD: [
    { days: 7, price: 9 },
    { days: 14, price: 19 },
    { days: 30, price: 29 },
    { days: 90, price: 39 },
  ],
};
