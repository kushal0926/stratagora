import { Card, CardContent } from '@/components/ui/card';
import { BookOpen } from 'lucide-react';

interface OpeningDisplayProps {
  opening?: string | null;
}

export default function OpeningDisplay({ opening }: OpeningDisplayProps) {
  if (!opening) return null;

  return (
    <Card className="bg-minimal border border-white/5">
      <CardContent className="p-4">
        <div className="flex items-center gap-3">
          <BookOpen className="w-5 h-5 text-cream" />
          <div>
            <p className="text-xs text-gray-500">Opening</p>
            <p className="text-sm font-medium text-cream">{opening}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}