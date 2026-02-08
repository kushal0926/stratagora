import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import Navbar from "@/components/navbar";
import QuickAnalyzeSection from "@/components/quick-analyze-section";

export default async function Home() {
    const session = await auth.api.getSession({
        headers: await headers(),
    });
    return (
        <div className="min-h-screen text-black bg-[#F9f6F0] space-y-10">
            <Navbar />
            <QuickAnalyzeSection isLoggedIn={!!session} />
        </div>
    );
}
