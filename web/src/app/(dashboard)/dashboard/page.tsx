import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Upload, Globe, Sparkles, TrendingUp } from "lucide-react";

export default async function DashboardPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return (
    <div className="space-y-8">
      {/* Quick Actions */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Link href="/dashboard/analyze">
          <Card className="hover:border-blue-300 transition-colors cursor-pointer">
            <CardHeader className="pb-3">
              <Sparkles className="h-8 w-8 text-blue-600 mb-2" />
              <CardTitle className="text-lg">Analyze Game</CardTitle>
            </CardHeader>
          </Card>
        </Link>

        <Link href="/dashboard/games">
          <Card className="hover:border-green-300 transition-colors cursor-pointer">
            <CardHeader className="pb-3">
              <Upload className="h-8 w-8 text-green-600 mb-2" />
              <CardTitle className="text-lg">My Games</CardTitle>
            </CardHeader>
          </Card>
        </Link>

        <Link href="/dashboard/chat">
          <Card className="hover:border-purple-300 transition-colors cursor-pointer">
            <CardHeader className="pb-3">
              <Globe className="h-8 w-8 text-purple-600 mb-2" />
              <CardTitle className="text-lg">Chat with AI</CardTitle>
            </CardHeader>
          </Card>
        </Link>

        <Card className="border-dashed">
          <CardHeader className="pb-3">
            <TrendingUp className="h-8 w-8 text-gray-400 mb-2" />
            <CardTitle className="text-lg text-gray-600">Progress</CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Your latest analyzed games</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12 text-gray-500">
            <p className="mb-4">No games analyzed yet</p>
            <Link href="/dashboard/analyze">
              <Button>Analyze Your First Game</Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardDescription className="text-black font-bold">Total Games</CardDescription>
            <CardTitle className="text-3xl">0</CardTitle>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader>
            <CardDescription className="text-black font-bold">Brilliant Moves</CardDescription>
            <CardTitle className="text-3xl text-green-600">0</CardTitle>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader>
            <CardDescription className="text-black font-bold">Blunders</CardDescription>
            <CardTitle className="text-3xl text-red-600">0</CardTitle>
          </CardHeader>
        </Card>
      </div>
    </div>
  );
}
