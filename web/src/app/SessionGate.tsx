import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import QuickAnalyzeSection from "@/components/quick-analyze-section";

export default async function SessionGate() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return <QuickAnalyzeSection isLoggedIn={!!session} />;
}
