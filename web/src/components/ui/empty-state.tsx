import { ReactNode } from "react";
import { Card, CardContent } from "./card";

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
}

export default function EmptyState({
  icon,
  title,
  description,
  action,
}: EmptyStateProps) {
  return (
    <Card className="bg-minimal border border-white/5">
      <CardContent className="flex flex-col items-center justify-center py-16 px-4 text-center">
        {icon && <div className="mb-4">{icon}</div>}
        <h3 className="text-xl font-semibold text-cream mb-2">{title}</h3>
        {description && (
          <p className="text-gray-400 text-sm mb-6 max-w-md">{description}</p>
        )}
        {action && <div>{action}</div>}
      </CardContent>
    </Card>
  );
}
