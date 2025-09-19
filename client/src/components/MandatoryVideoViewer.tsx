import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  CheckCircle2,
  Clock,
  AlertCircle,
  Play,
  BookOpen
} from 'lucide-react';

interface KeyMoment {
  time: number;
  title: string;
  description?: string;
}

interface MandatoryVideoViewerProps {
  videoUrl: string;
  videoTitle: string;
  transcript: string;
  keyMoments: KeyMoment[];
  duration: number; // in seconds
  onComplete: (completed: boolean) => void;
  completionThreshold?: number; // percentage (default 95%)
}

export function MandatoryVideoViewer({
  videoUrl,
  videoTitle,
  transcript,
  keyMoments,
  duration,
  onComplete,
  completionThreshold = 95
}: MandatoryVideoViewerProps) {
  const [watchTime, setWatchTime] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [showTranscript, setShowTranscript] = useState(false);
  const [isVideoFocused, setIsVideoFocused] = useState(false);
  const [lastActivityTime, setLastActivityTime] = useState(Date.now());
  const [hasStarted, setHasStarted] = useState(false);
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const videoContainerRef = useRef<HTMLDivElement>(null);
  
  const watchPercentage = Math.round((watchTime / duration) * 100);
  const requiredTime = Math.round((duration * completionThreshold) / 100);

  // Track video container focus and activity
  useEffect(() => {
    const handleMouseEnter = () => {
      setIsVideoFocused(true);
      setLastActivityTime(Date.now());
      if (!hasStarted) setHasStarted(true);
    };

    const handleMouseLeave = () => {
      setIsVideoFocused(false);
    };

    const handleMouseMove = () => {
      setLastActivityTime(Date.now());
    };

    const handleClick = () => {
      setLastActivityTime(Date.now());
      if (!hasStarted) setHasStarted(true);
    };

    const handleKeyPress = () => {
      setLastActivityTime(Date.now());
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        setIsVideoFocused(false);
      } else {
        setLastActivityTime(Date.now());
      }
    };

    const container = videoContainerRef.current;
    if (container) {
      container.addEventListener('mouseenter', handleMouseEnter);
      container.addEventListener('mouseleave', handleMouseLeave);
      container.addEventListener('mousemove', handleMouseMove);
      container.addEventListener('click', handleClick);
    }

    document.addEventListener('keydown', handleKeyPress);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      if (container) {
        container.removeEventListener('mouseenter', handleMouseEnter);
        container.removeEventListener('mouseleave', handleMouseLeave);
        container.removeEventListener('mousemove', handleMouseMove);
        container.removeEventListener('click', handleClick);
      }
      document.removeEventListener('keydown', handleKeyPress);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [hasStarted]);

  // Watch time tracking with anti-cheat measures
  useEffect(() => {
    if (hasStarted && !completed && !document.hidden) {
      intervalRef.current = setInterval(() => {
        const now = Date.now();
        const timeSinceActivity = now - lastActivityTime;
        
        // Only count time if:
        // 1. Video area is focused OR recent activity (within 30 seconds)
        // 2. Page is visible
        // 3. Not idle for more than 60 seconds
        if ((isVideoFocused || timeSinceActivity < 30000) && timeSinceActivity < 60000) {
          setWatchTime(prev => {
            const newTime = prev + 1;
            
            if (newTime >= requiredTime) {
              setCompleted(true);
              onComplete(true);
              if (intervalRef.current) {
                clearInterval(intervalRef.current);
              }
            }
            
            return newTime;
          });
        }
      }, 1000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [hasStarted, completed, isVideoFocused, lastActivityTime, requiredTime, onComplete]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Instructions and Progress */}
      {!completed && (
        <Card className="border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/10">
          <CardContent className="p-4">
            <div className="flex items-start space-x-3">
              <AlertCircle className="w-5 h-5 text-blue-500 mt-0.5" />
              <div className="flex-1">
                <div className="font-semibold text-blue-800 dark:text-blue-200 mb-2">
                  Video Completion Required: {completionThreshold}%
                </div>
                <div className="text-sm text-blue-700 dark:text-blue-300 mb-3">
                  {!hasStarted ? (
                    "Click on the video area to begin tracking your watch time. Stay engaged - move your mouse or interact with the video to keep tracking active."
                  ) : (
                    `Keep watching! Time counts when you're actively viewing (${isVideoFocused ? 'currently tracking' : 'hover over video to track'}).`
                  )}
                </div>
                <Progress value={watchPercentage} className="h-3 mb-2" />
                <div className="flex justify-between text-sm text-blue-600 dark:text-blue-300">
                  <span>Watched: {formatTime(watchTime)} / {formatTime(requiredTime)}</span>
                  <span>{watchPercentage}% complete</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Video Player */}
      <Card className="overflow-hidden">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <Play className="w-5 h-5" />
              <span>{videoTitle}</span>
              {completed && <CheckCircle2 className="w-5 h-5 text-green-500" />}
            </CardTitle>
            <Badge variant={completed ? "default" : "secondary"}>
              {completed ? 'Completed' : `${watchPercentage}% watched`}
            </Badge>
          </div>
        </CardHeader>
        
        <CardContent className="p-0">
          <div 
            ref={videoContainerRef}
            className={`relative bg-black aspect-video overflow-hidden border-4 transition-all duration-300 ${
              isVideoFocused ? 'border-blue-500 shadow-lg' : 'border-transparent'
            }`}
          >
            {/* Video iframe */}
            <iframe
              src={videoUrl}
              className="w-full h-full"
              allow="autoplay; fullscreen"
              allowFullScreen
              title={videoTitle}
            />
            
            {/* Tracking overlay */}
            {!hasStarted && (
              <div className="absolute inset-0 bg-black/80 flex items-center justify-center">
                <div className="text-center text-white p-6">
                  <Play className="w-12 h-12 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Click to Start Watching</h3>
                  <p className="text-sm opacity-80">
                    You must watch {completionThreshold}% ({formatTime(requiredTime)}) to continue
                  </p>
                </div>
              </div>
            )}
            
            {/* Progress overlay */}
            {hasStarted && !completed && (
              <div className="absolute top-4 right-4 bg-black/80 text-white px-3 py-2 rounded-lg text-sm">
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4" />
                  <span>{formatTime(watchTime)} / {formatTime(requiredTime)}</span>
                </div>
                <div className="w-32 bg-gray-600 rounded-full h-1 mt-1">
                  <div 
                    className="bg-blue-400 h-1 rounded-full transition-all duration-300"
                    style={{ width: `${Math.min(100, (watchTime / requiredTime) * 100)}%` }}
                  />
                </div>
              </div>
            )}
            
            {/* Activity indicator */}
            {hasStarted && !completed && (
              <div className="absolute bottom-4 left-4">
                <div className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  isVideoFocused ? 'bg-green-400 animate-pulse' : 'bg-gray-400'
                }`} />
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Progress Statistics */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Clock className="w-5 h-5 text-blue-500" />
              <div>
                <div className="text-sm font-semibold">Watch Time</div>
                <div className="text-2xl font-bold">{formatTime(watchTime)}</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              {isVideoFocused ? (
                <div className="w-5 h-5 bg-green-500 rounded-full animate-pulse" />
              ) : (
                <div className="w-5 h-5 bg-gray-400 rounded-full" />
              )}
              <div>
                <div className="text-sm font-semibold">Tracking</div>
                <div className="text-sm">
                  {isVideoFocused ? 'Active' : 'Paused'}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              {completed ? (
                <CheckCircle2 className="w-5 h-5 text-green-500" />
              ) : (
                <AlertCircle className="w-5 h-5 text-orange-500" />
              )}
              <div>
                <div className="text-sm font-semibold">Progress</div>
                <div className="text-sm">
                  {completed ? 'Complete!' : `${Math.max(0, requiredTime - watchTime)}s left`}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className={`w-5 h-5 rounded-full ${completed ? 'bg-green-500' : 'bg-blue-500'}`} />
              <div>
                <div className="text-sm font-semibold">Completion</div>
                <div className="text-sm">{watchPercentage}% / {completionThreshold}%</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Key Moments and Transcript */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Key Moments */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <span>Key Moments</span>
              <Badge variant="outline">{keyMoments.length} chapters</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {keyMoments.map((moment, index) => (
              <div
                key={index}
                className="p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-sm">{moment.title}</div>
                    {moment.description && (
                      <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                        {moment.description}
                      </div>
                    )}
                  </div>
                  <div className="text-xs text-gray-500 ml-2">
                    {formatTime(moment.time)}
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Transcript */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center space-x-2">
                <BookOpen className="w-5 h-5" />
                <span>Video Transcript</span>
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowTranscript(!showTranscript)}
              >
                {showTranscript ? 'Hide' : 'Show'}
              </Button>
            </div>
          </CardHeader>
          {showTranscript && (
            <CardContent className="max-h-96 overflow-y-auto">
              <div className="space-y-3 text-sm leading-relaxed">
                {transcript.split('\n\n').map((paragraph, index) => (
                  <p key={index} className="text-gray-700 dark:text-gray-300">
                    {paragraph}
                  </p>
                ))}
              </div>
            </CardContent>
          )}
        </Card>
      </div>

      {/* Completion Message */}
      {completed && (
        <Card className="border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/10">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <CheckCircle2 className="w-5 h-5 text-green-500" />
              <div>
                <div className="font-semibold text-green-800 dark:text-green-200">
                  Video completed successfully!
                </div>
                <div className="text-sm text-green-600 dark:text-green-300">
                  You watched {formatTime(watchTime)} and can now proceed to the next section.
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export default MandatoryVideoViewer;