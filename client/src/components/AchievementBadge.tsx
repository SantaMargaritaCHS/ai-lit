import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';

interface Achievement {
  id: string;
  name: string;
  description: string;
  emoji: string;
  unlocked?: boolean;
  progress?: number;
  total?: number;
}

interface AchievementBadgeProps {
  achievement: Achievement;
}

export default function AchievementBadge({ achievement }: AchievementBadgeProps) {
  const { unlocked = false, progress, total } = achievement;
  const isInProgress = progress !== undefined && total !== undefined && !unlocked;
  const progressPercentage = progress && total ? (progress / total) * 100 : 0;

  return (
    <Card className={`transition-all duration-200 hover:shadow-md ${
      unlocked ? 'border-green-200 dark:border-green-700' : 'border-gray-200 dark:border-gray-700'
    } ${!unlocked ? 'opacity-60' : ''}`}>
      <CardContent className="p-4 text-center">
        <div className={`text-3xl mb-2 ${unlocked ? 'animate-pulse' : ''}`}>
          {achievement.emoji}
        </div>
        
        <h4 className="font-semibold text-sm text-gray-900 dark:text-white mb-1">
          {achievement.name}
        </h4>
        
        <p className="text-xs text-gray-600 dark:text-gray-300 mb-2">
          {achievement.description}
        </p>

        {unlocked && (
          <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 text-xs">
            Unlocked
          </Badge>
        )}

        {isInProgress && total && progress !== undefined && (
          <div className="mt-2">
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs text-gray-500 dark:text-gray-400">
                Progress
              </span>
              <span className="text-xs text-gray-900 dark:text-white">
                {progress}/{total}
              </span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
          </div>
        )}

        {!unlocked && !isInProgress && (
          <Badge className="bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400 text-xs">
            Locked
          </Badge>
        )}
      </CardContent>
    </Card>
  );
}