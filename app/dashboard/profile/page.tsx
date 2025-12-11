import { stackServerApp } from "@/stack"
import { getUserPlan, getPaymentHistory } from "../actions"
import { redirect } from "next/navigation"
import ProfileClient from "./ProfileClient"

export default async function ProfilePage() {
    const user = await stackServerApp.getUser()

    if (!user) {
        redirect("/login")
    }

    const planData = await getUserPlan()
    const payments = await getPaymentHistory()

    const activePlan = planData?.plan
    let expirationDate = "N/A"
    let status = "Inativo"

    if (activePlan) {
        status = activePlan.subscription_status === 'active' ? "Ativo" : "Expirado"
        if (activePlan.end_date) {
            expirationDate = new Date(activePlan.end_date).toLocaleDateString('pt-BR')
        }
    }

    const profileUser = {
        name: user.displayName,
        email: user.primaryEmail
    }

    return (
        <ProfileClient
            user={profileUser}
            activePlan={activePlan}
            status={status}
            expirationDate={expirationDate}
            payments={payments}
        />
    )
}
