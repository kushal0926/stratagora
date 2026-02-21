"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BotMessageSquare, Sparkles } from "lucide-react";

export default function ChatModalContent() {
  return (
    <div className="p-6">
      <Card className="bg-minimal border border-white/5">
        <CardHeader>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center">
              <BotMessageSquare className="w-6 h-6 text-purple-400" />
            </div>
            <div>
              <CardTitle className="text-cream">AI Chess Coach</CardTitle>
              <p className="text-sm text-gray-400">Powered by Claude AI</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center py-12">
            <Sparkles className="w-16 h-16 text-purple-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-cream mb-3">
              Coming in Week 4!
            </h3>
            <p className="text-gray-400 max-w-md mx-auto">
              Chat with Claude AI about your games, get strategic advice, learn
              openings, and understand your mistakes.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
