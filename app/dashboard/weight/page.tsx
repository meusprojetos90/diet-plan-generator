import { stackServerApp } from "@/stack"
import { redirect } from "next/navigation"
import { getWeightHistory, getUserHeightFromPlan, getUserPlan } from "../actions"
import WeightClient from "./WeightClient"

export default async function WeightPage() {
    const user = await stackServerApp.getUser()

    if (!user) {
        redirect("/login")
    }

    const weightHistory = await getWeightHistory()
    const userHeight = await getUserHeightFromPlan()
    const planData = await getUserPlan()

    // Get initial weight from plan intake if available
    const initialWeight = planData?.plan?.intake?.weight || null

    return (
        <WeightClient
            userEmail={user.primaryEmail || ""}
            weightHistory={weightHistory}
            userHeight={userHeight}
            initialWeight={initialWeight}
        />
    )
}
