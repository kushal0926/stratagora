import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function AnalyzePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Analyze Game</h1>
        <p className="text-gray-600 mt-2">
          Upload PGN files or import from Chess.com/Lichess
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Game Analysis</CardTitle>
          <CardDescription>Coming in Day 8-9</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12 text-gray-500">
            <p>🚧 Analysis feature under construction</p>
            <p className="text-sm mt-2">We&apos;ll build this in the next few days!</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}