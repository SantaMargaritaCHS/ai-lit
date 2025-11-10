import React from 'react';
import { LucideIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

/**
 * EmptyState - Helpful empty state component
 *
 * Phase 4.3: UI/UX Polish
 *
 * Provides guidance when components have no content yet
 *
 * Usage:
 * <EmptyState
 *   icon={Video}
 *   title="No videos yet"
 *   description="Add your first video to get started"
 *   actionLabel="Add Video"
 *   onAction={handleAddVideo}
 * />
 */

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  secondaryActionLabel?: string;
  onSecondaryAction?: () => void;
}

export default function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
  secondaryActionLabel,
  onSecondaryAction,
}: EmptyStateProps) {
  return (
    <Card className="border-2 border-dashed border-gray-300 bg-gray-50">
      <CardContent className="flex flex-col items-center justify-center py-16 text-center">
        <div className="bg-gray-100 rounded-full p-4 mb-4">
          <Icon className="w-12 h-12 text-gray-400" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
        <p className="text-sm text-gray-600 max-w-md mb-6">{description}</p>
        {actionLabel && onAction && (
          <div className="flex gap-3">
            <Button
              onClick={onAction}
              className="bg-purple-600 hover:bg-purple-700 text-white"
            >
              {actionLabel}
            </Button>
            {secondaryActionLabel && onSecondaryAction && (
              <Button
                onClick={onSecondaryAction}
                variant="outline"
                className="border-gray-300 text-gray-700 hover:bg-gray-100"
              >
                {secondaryActionLabel}
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
