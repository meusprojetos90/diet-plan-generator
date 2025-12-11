import pool from "@/lib/db";
import { sendWelcomeEmail, sendAccountCreatedEmail } from "@/lib/email";
import { stackServerApp } from "@/stack";
import { generateMealPlan } from "@/lib/openai";
import { UserIntake } from "@/lib/prompts";

export async function processSuccessfulOrder(
    sessionId: string,
    paymentIntentId: string | null | undefined,
    orderId: string,
    amountTotal: number | null,
    currency: string
) {
    console.log(`Processing Order ${orderId} for Session ${sessionId}`);

    // 1. Fetch Order
    const orderRes = await pool.query("SELECT * FROM orders WHERE id = $1", [orderId]);
    const order = orderRes.rows[0];

    if (!order) {
        throw new Error(`Order not found: ${orderId}`);
    }

    // Idempotency check: If already paid, skip
    if (order.status === 'paid') {
        console.log(`Order ${orderId} is already paid. Skipping processing.`);
        return;
    }

    // 2. Update Order Status
    await pool.query(
        `UPDATE orders 
         SET status = 'paid', 
             stripe_session_id = $1, 
             stripe_payment_intent_id = $2, 
             updated_at = NOW() 
         WHERE id = $3`,
        [sessionId, paymentIntentId, orderId]
    );

    // 3. Fetch Intake Data
    const intakeRes = await pool.query("SELECT * FROM intakes WHERE id = $1", [order.intake_id]);
    const intakeData = intakeRes.rows[0]?.payload_json;

    if (!intakeData) {
        throw new Error("Missing intake data for order");
    }

    // 4. Check if meal plan exists, if not generate it
    const planRes = await pool.query("SELECT * FROM meal_plans WHERE order_id = $1", [orderId]);
    let mealPlanData = planRes.rows[0]?.plan_json;

    if (!mealPlanData || Object.keys(mealPlanData).length === 0) {
        console.log(`Generating meal plan for order ${orderId}...`);

        try {
            // Convert intake to UserIntake format
            const userIntake: UserIntake = {
                age: intakeData.age || 30,
                gender: intakeData.gender || 'male',
                height: intakeData.height || 170,
                weight: intakeData.weight || 70,
                goal: intakeData.goal || 'maintenance',
                activity: intakeData.activity_level || 'moderate',
                dietary_restrictions: intakeData.dietary_restrictions || [],
                allergies: intakeData.allergies || [],
                preferred_foods: intakeData.preferred_foods || [],
                disliked_foods: intakeData.disliked_foods || [],
                meals_per_day: intakeData.meals_per_day || 5,
                locale: intakeData.locale || 'pt-BR',
                has_gym_access: intakeData.has_gym_access ?? true,
                workout_experience: intakeData.workout_experience || 'intermediate',
                workout_days_per_week: intakeData.workout_days_per_week || 4,
                available_time_minutes: intakeData.available_time_minutes || 60,
            };

            // Generate meal plan using OpenAI
            mealPlanData = await generateMealPlan(userIntake, order.days, orderId);

            // Save generated meal plan to database
            if (planRes.rows.length > 0) {
                await pool.query(
                    "UPDATE meal_plans SET plan_json = $1, updated_at = NOW() WHERE order_id = $2",
                    [JSON.stringify(mealPlanData), orderId]
                );
            } else {
                await pool.query(
                    "INSERT INTO meal_plans (order_id, plan_json) VALUES ($1, $2)",
                    [orderId, JSON.stringify(mealPlanData)]
                );
            }

            console.log(`Meal plan generated and saved for order ${orderId}`);
        } catch (error) {
            console.error("Error generating meal plan:", error);
            throw new Error("Failed to generate meal plan");
        }
    }

    // 5. Ensure Customer & Profile Linked
    const customerRes = await pool.query("SELECT * FROM customers WHERE id = $1", [order.customer_id]);
    const customer = customerRes.rows[0];

    let profileId: string;
    let isNewUser = false;
    const profileRes = await pool.query("SELECT id FROM profiles WHERE email = $1", [customer.email]);

    if (profileRes.rows.length > 0) {
        profileId = profileRes.rows[0].id;
    } else {
        // Create profile
        const newProfile = await pool.query(
            "INSERT INTO profiles (email, name) VALUES ($1, $2) RETURNING id",
            [customer.email, customer.name]
        );
        profileId = newProfile.rows[0].id;
        isNewUser = true;
    }

    // 6. Create Stack Auth user if new
    if (isNewUser) {
        try {
            const existingUsers = await stackServerApp.listUsers();
            const userExists = existingUsers.some((u) => u.primaryEmail === customer.email);

            if (!userExists) {
                await stackServerApp.createUser({
                    primaryEmail: customer.email,
                    displayName: customer.name || undefined,
                    primaryEmailAuthEnabled: true,
                });
                console.log(`Stack Auth user created for ${customer.email}`);
            }
        } catch (error) {
            console.error("Error creating Stack Auth user:", error);
        }
    }

    // 7. Create User Plan (Active)
    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + order.days);

    // Extract workout_plan from generated meal plan
    const workoutPlan = mealPlanData.workout_plan || {};

    await pool.query(`
        INSERT INTO user_plans (
            user_id, intake, meal_plan, workout_plan, days, 
            start_date, end_date, subscription_status, 
            stripe_session_id, stripe_payment_intent_id, amount_paid, currency
        ) VALUES (
            $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12
        )`,
        [
            profileId,
            JSON.stringify(intakeData),
            JSON.stringify(mealPlanData),
            JSON.stringify(workoutPlan),
            order.days,
            startDate.toISOString().split('T')[0],
            endDate.toISOString().split('T')[0],
            "active",
            sessionId,
            paymentIntentId,
            amountTotal ? amountTotal / 100 : 0,
            currency
        ]
    );

    console.log(`Plan activated successfully for Order ${orderId}`);

    // 8. Send Email
    if (isNewUser) {
        await sendAccountCreatedEmail(customer.email, customer.name);
    } else {
        await sendWelcomeEmail(customer.email, customer.name);
    }
}
