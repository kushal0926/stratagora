import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import Navbar from "@/components/navbar";
import QuickAnalyzeSection from "@/components/quick-analyze-section";
import { Suspense } from "react";


export default async function Home() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  return (
    <div className="min-h-screen text-black bg-kala space-y-10">
      <Navbar />
      <div className="mt-10">
        <Suspense fallback="null">
        <QuickAnalyzeSection isLoggedIn={!!session} />
          
        </Suspense>
      </div>
    </div>
  );
}
