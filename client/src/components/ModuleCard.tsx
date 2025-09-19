import { Check, Play, Clock, BookOpen, Award } from 'lucide-react';
import { ModuleProgress } from '@shared/schema';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

interface Module {
  id: string;
  title: string;
  description: string;
  emoji: string;
  sessionId: number;
  estimatedTime: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

interface ModuleCardProps {
  module: Module;
  progress?: ModuleProgress;
  onClick: () => void;
}

export default function ModuleCard({ module, progress, onClick }: ModuleCardProps) {
  const isCompleted = progress?.completed || false;
  const progressPercentage = progress?.score || 0;
  
  const getDifficultyColor = () => {
    switch (module.difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'advanced': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  return (
    <Card 
      onClick={onClick}
      className="cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-[1.02] border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
    >
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="text-3xl">{module.emoji}</div>
            <div>
              <h3 className="font-semibold text-lg text-gray-900 dark:text-white">
                {module.title}
              </h3>
              <Badge className={`text-xs ${getDifficultyColor()}`}>
                {module.difficulty}
              </Badge>
            </div>
          </div>
          {isCompleted && (
            <div className="bg-green-100 dark:bg-green-900 rounded-full p-2">
              <Check className="h-4 w-4 text-green-600 dark:text-green-400" />
            </div>
          )}
        </div>

        <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-2">
          {module.description}
        </p>

        {progress && (
          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                Progress
              </span>
              <span className="text-xs font-medium text-gray-900 dark:text-white">
                {progressPercentage}%
              </span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
          </div>
        )}

        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center text-gray-500 dark:text-gray-400">
            <Clock className="h-4 w-4 mr-1" />
            {module.estimatedTime}
          </div>
          
          <div className="flex items-center space-x-2">
            {isCompleted ? (
              <div className="flex items-center text-green-600 dark:text-green-400">
                <Award className="h-4 w-4 mr-1" />
                <span className="text-xs font-medium">Completed</span>
              </div>
            ) : (
              <div className="flex items-center text-blue-600 dark:text-blue-400">
                <Play className="h-4 w-4 mr-1" />
                <span className="text-xs font-medium">Start</span>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}