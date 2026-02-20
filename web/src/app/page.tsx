import Navbar from "@/components/navbar";
import { Suspense } from "react";
import SessionGate from "./SessionGate";

export default async function Home() {
  return (
    <div className="min-h-screen text-black bg-kala space-y-10">
      <Navbar />
      <div className="mt-10">
        <Suspense fallback="null">
          <SessionGate />
        </Suspense>
      </div>
    </div>
  );
}
