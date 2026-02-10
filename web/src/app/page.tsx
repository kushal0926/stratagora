import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import Navbar from "@/components/navbar";
import QuickAnalyzeSection from "@/components/quick-analyze-section";

export default async function Home() {
    const session = await auth.api.getSession({
        headers: await headers(),
    });
    return (
        <div className="min-h-screen text-black bg-cream space-y-10">
            <Navbar />
            <div className="mt-10">
            <QuickAnalyzeSection isLoggedIn={!!session} />
            </div>
        </div>
    );
}
