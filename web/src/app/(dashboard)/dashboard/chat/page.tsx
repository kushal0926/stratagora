import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function ChatPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-cream">AI Chess Coach</h1>
        <p className="text-gray-400 mt-2">
          Chat with Claude AI about your games
        </p>
      </div>

      <Card className="border border-white/5 bg-minimal rounded">
        <CardHeader>
          <CardTitle className="text-cream text-3xl">AI Chat</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12 text-gray-500">
            <p>🤖 AI Chat feature under construction</p>
            <p className="text-sm mt-2">
              We&apos;ll integrate Claude AI later!
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
