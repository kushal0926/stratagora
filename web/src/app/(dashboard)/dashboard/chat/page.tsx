import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function ChatPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">AI Chess Coach</h1>
        <p className="text-gray-600 mt-2">
          Chat with Claude AI about your games
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>AI Chat</CardTitle>
          <CardDescription>Coming in Day 22-26</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12 text-gray-500">
            <p>🤖 AI Chat feature under construction</p>
            <p className="text-sm mt-2">We&apos;ll integrate Claude AI later!</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
