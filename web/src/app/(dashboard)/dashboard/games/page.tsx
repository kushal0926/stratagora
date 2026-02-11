import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Upload } from "lucide-react";

export default function GamesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-cream">My Games</h1>
        <p className="text-gray-400 font-bold mt-2">
          View and manage your analyzed chess games
        </p>
      </div>

      <Card className="bg-minimal border border-white/5 rounded">
        <CardHeader>
          <CardTitle className="text-cream text-2xl">
            Your Game Library
          </CardTitle>
          <CardDescription className="text-gray-400 font-bold">
            All your uploaded and analyzed games
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <Upload className="w-12 h-12 mx-auto mb-4 text-cream" />
            <p className="mb-4 text-gray-400">No games yet</p>
            <Link href="/dashboard/analyze">
              <Button className="bg-chess hover:bg-cream font-bold text-ink">
                Upload Your First Game
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
