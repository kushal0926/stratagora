
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Upload, ExternalLink, Loader2 } from "lucide-react";
import Image from "next/image";
import { Label } from "./ui/label";

export default function QuickAnalyzeSection({
  isLoggedIn,
}: {
  isLoggedIn: boolean;
}) {
  const [activeTab, setActiveTab] = useState("chesscom");
  const [username, setUsername] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleAnalyze = async () => {
    setIsLoading(true);
    // TODO: Implement analysis logic (Day 8+)
    setTimeout(() => {
      alert("Analysis feature coming soon! This will work without login.");
      setIsLoading(false);
    }, 1000);
  };

  return (
    <Card className="max-w-4xl mx-auto bg-minimal border border-white/5 text-black space-y-5">
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3 rounded-xl mb-5 ">
            <TabsTrigger
              value="chesscom"
              className="flex items-center justify-center rounded-xl data-[state=active]:bg-chess  data-[state=active]:text-ink"
            >
              <Image src="/chess.svg" alt="" width={18} height={18} />
              <span className="hidden sm:inline font-bold">chess.com</span>
            </TabsTrigger>

            <TabsTrigger
              value="lichess"
              className="flex items-center justify-center gap-2 rounded-lg data-[state=active]:bg-chess data-[state=active]:text-ink"
            >
              <Image src="lichess.svg" alt="" width={18} height={18} />
              <span className="hidden sm:inline font-bold">lichess</span>
            </TabsTrigger>

            <TabsTrigger
              value="pgn"
              className="flex items-center justify-center gap-2 rounded-lg data-[state=active]:bg-chess data-[state=active]:text-ink"
            >
              🗁 <span className="hidden sm:inline font-bold">upload PGN</span>
            </TabsTrigger>
          </TabsList>

          {/* Chess.com Tab */}
          <TabsContent value="chesscom" className="space-y-4">
            <div className="space-y-2">
              <Label className="text-md font-bold text-gray-400">
                <span className="text-cream">chess.com</span> username
              </Label>
              <Input
                placeholder="enter your chess.com username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="p-5 bg-transparent text-cream border border-white/10 text-sm "
              />
            </div>
            <Button
              onClick={handleAnalyze}
              className="w-full p-5 bg-chess"
              disabled={!username || isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin text-cream" />
                  <span className="font-bold text-ink">Fetching Games...</span>
                </>
              ) : (
                <>
                  <ExternalLink className="h-4 w-4 text-ink" />
                  <span className="font-bold text-ink">
                    Fetch & Analyze Games
                  </span>
                </>
              )}
            </Button>
          </TabsContent>

          {/* Lichess Tab */}
          <TabsContent value="lichess" className="space-y-4">
            <div className="space-y-2">
              <Label className="text-md font-bold text-gray-400">
                <span className="text-cream">lichess</span> username
              </Label>
              <Input
                placeholder="enter your lichess username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="p-5 bg-transparent text-cream border border-white/10 text-sm"
              />
            </div>
            <Button
              onClick={handleAnalyze}
              className="w-full p-5 bg-chess"
              disabled={!username || isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin text-ink" />
                  <span className="font-bold text-ink">Fetching Games...</span>
                </>
              ) : (
                <>
                  <ExternalLink className=" h-4 w-4 text-ink" />
                  <span className="font-bold text-ink">
                    Fetch & Analyze Games
                  </span>
                </>
              )}
            </Button>
          </TabsContent>

          {/* PGN Upload Tab */}
          <TabsContent value="pgn" className="space-y-4">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors cursor-pointer">
              <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-sm font-font text-bold mb-2">
                Drop PGN file here or click to upload
              </p>
              <p className="text-xs text-cream">
                Supports .pgn files up to 10MB
              </p>
              <input
                type="file"
                accept=".pgn"
                className="hidden"
                id="pgn-upload"
              />
              <label htmlFor="pgn-upload">
                <Button
                  className="mt-4 bg-chess text-ink border border-white/5 rounded"
                  variant="outline"
                  asChild
                >
                  <span className="text-ink font-bold">Upload File</span>
                </Button>
              </label>
            </div>
          </TabsContent>
        </Tabs>

        {/* Login prompt for saving */}
        {!isLoggedIn && (
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-indigo-800 text-center">
              💡 <strong>Want to save your analysis?</strong> Create a free
              account to save games, chat with AI, and track your progress.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
