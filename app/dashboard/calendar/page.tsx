import { stackServerApp } from "@/stack"
import { redirect } from "next/navigation"
import CalendarPageClient from "./CalendarPageClient"

export default async function CalendarPage() {
    const user = await stackServerApp.getUser()

    if (!user) {
        redirect("/login")
    }

    return <CalendarPageClient />
}
