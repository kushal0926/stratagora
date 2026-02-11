import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function DashboardPage() {
  return (
    <div className="space-y-8">
      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card className="bg-minimal hover:bg-[#222222] border border-white/5 rounded">
          <CardHeader className="text-center">
            <CardDescription className="text-cream font-bold text-2xl">
              Total Games
            </CardDescription>
            <CardTitle className="text-3xl text-cream">0</CardTitle> 
          </CardHeader>
        </Card>

        <Card className="bg-minimal hover:bg-[#222222] border border-white/5 rounded">
          <CardHeader className="text-center">
            <CardDescription className="text-cream font-bold text-2xl">
              Brilliant Moves
            </CardDescription>
            <CardTitle className="text-3xl text-green-600">0</CardTitle>
          </CardHeader>
        </Card>

        <Card className="bg-minimal hover:bg-[#222222] border border-white/5 rounded">
          <CardHeader className="text-center text-red">
            <CardDescription className="text-cream text-2xl font-bold">
              Blunders
            </CardDescription>
            <CardTitle className="text-3xl text-red-600">0</CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card className="bg-minimal border border-white/5 rounded">
        <CardHeader>
          <CardTitle className="text-cream">Recent Activity</CardTitle>
          <CardDescription className="text-gray-400">
            Recently analyzed games
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12 text-gray-500">
            <p className="mb-4 text-gray-400">No games analyzed yet</p>
            <Link href="/dashboard/analyze">
              <Button className="bg-chess text-ink font-bold hover:bg-cream">
                Analyze Your First Game
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
