import React, { useEffect, useState, forwardRef, useImperativeHandle } from 'react';
import { VideoSegment } from '@/types/developerMode';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Play, Pause, SkipForward, Volume2 } from 'lucide-react';

interface SegmentedVideoPlayerProps {
  src: string;
  segments: VideoSegment[];
  currentSegmentIndex: number;
  onSegmentComplete?: (segmentIndex: number) => void;
  onVideoEnd?: () => void;
  isDevMode?: boolean;
  className?: string;
  autoPlay?: boolean;
  showSegmentNavigation?: boolean;
  title?: string;
}

export interface SegmentedVideoPlayerRef {
  getCurrentTime: () => number;
  setCurrentTime: (time: number) => void;
  play: () => void;
  pause: () => void;
  getCurrentSegment: () => VideoSegment | null;
  skipToSegmentEnd: (offsetSeconds?: number) => void;
}

/**
 * Enhanced video player with segment awareness and Universal Developer Mode integration
 * 
 * Features:
 * - Automatic segment detection and progression
 * - Developer mode overlay with segment information
 * - Intelligent video navigation for testing
 * - Visual segment progress indicators
 * - Integration with Universal Developer Mode system
 */
export const SegmentedVideoPlayer = forwardRef<SegmentedVideoPlayerRef, SegmentedVideoPlayerProps>(({
  src,
  segments,
  currentSegmentIndex,
  onSegmentComplete,
  onVideoEnd,
  isDevMode = false,
  className = '',
  autoPlay = false,
  showSegmentNavigation = true,
  title
}, ref) => {
  const [videoElement, setVideoElement] = useState<HTMLVideoElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);

  const currentSegment = segments[currentSegmentIndex];

  // Expose methods through ref for Universal Developer Mode integration
  useImperativeHandle(ref, () => ({
    getCurrentTime: () => videoElement?.currentTime || 0,
    setCurrentTime: (time: number) => {
      if (videoElement) {
        videoElement.currentTime = time;
      }
    },
    play: () => videoElement?.play(),
    pause: () => videoElement?.pause(),
    getCurrentSegment: () => currentSegment || null,
    skipToSegmentEnd: (offsetSeconds = 5) => {
      if (videoElement && currentSegment) {
        const targetTime = Math.max(
          currentSegment.endTime - offsetSeconds,
          currentSegment.startTime
        );
        videoElement.currentTime = targetTime;
        console.log(`🎬 Skipped to segment end -${offsetSeconds}s: ${targetTime}s`);
      }
    }
  }), [videoElement, currentSegment]);

  // Video event handlers
  useEffect(() => {
    if (!videoElement) return;

    const handleTimeUpdate = () => {
      const time = videoElement.currentTime;
      setCurrentTime(time);

      // Check if current segment is complete
      if (currentSegment && time >= currentSegment.endTime) {
        console.log(`Segment ${currentSegmentIndex} completed at ${time}s`);
        onSegmentComplete?.(currentSegmentIndex);
      }
    };

    const handleLoadedMetadata = () => {
      setDuration(videoElement.duration);
    };

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleEnded = () => {
      setIsPlaying(false);
      onVideoEnd?.();
    };

    const handleVolumeChange = () => {
      setVolume(videoElement.volume);
    };

    videoElement.addEventListener('timeupdate', handleTimeUpdate);
    videoElement.addEventListener('loadedmetadata', handleLoadedMetadata);
    videoElement.addEventListener('play', handlePlay);
    videoElement.addEventListener('pause', handlePause);
    videoElement.addEventListener('ended', handleEnded);
    videoElement.addEventListener('volumechange', handleVolumeChange);

    return () => {
      videoElement.removeEventListener('timeupdate', handleTimeUpdate);
      videoElement.removeEventListener('loadedmetadata', handleLoadedMetadata);
      videoElement.removeEventListener('play', handlePlay);
      videoElement.removeEventListener('pause', handlePause);
      videoElement.removeEventListener('ended', handleEnded);
      videoElement.removeEventListener('volumechange', handleVolumeChange);
    };
  }, [videoElement, currentSegment, currentSegmentIndex, onSegmentComplete, onVideoEnd]);

  // Auto-start segment when changed
  useEffect(() => {
    if (videoElement && currentSegment && autoPlay) {
      videoElement.currentTime = currentSegment.startTime;
      videoElement.play();
    }
  }, [videoElement, currentSegment, autoPlay]);

  const togglePlayPause = () => {
    if (videoElement) {
      if (isPlaying) {
        videoElement.pause();
      } else {
        videoElement.play();
      }
    }
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!videoElement || !duration) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickRatio = clickX / rect.width;
    const seekTime = duration * clickRatio;
    
    videoElement.currentTime = seekTime;
  };

  // Calculate progress within current segment
  const getSegmentProgress = () => {
    if (!currentSegment) return 0;
    const segmentDuration = currentSegment.endTime - currentSegment.startTime;
    const segmentElapsed = Math.max(0, currentTime - currentSegment.startTime);
    return Math.min(100, (segmentElapsed / segmentDuration) * 100);
  };

  // Calculate overall video progress
  const getOverallProgress = () => {
    return duration > 0 ? (currentTime / duration) * 100 : 0;
  };

  return (
    <Card className={`relative overflow-hidden ${className}`}>
      {/* Video Element */}
      <div className="relative aspect-video bg-black">
        <video
          ref={setVideoElement}
          src={src}
          className="w-full h-full"
          controls={isDevMode} // Enable native controls in dev mode for debugging
          playsInline
          preload="metadata"
        >
          <source src={src} type="video/mp4" />
          Your browser does not support the video tag.
        </video>

        {/* Developer Mode Overlay */}
        {isDevMode && currentSegment && (
          <div className="absolute top-4 right-4 bg-red-900/95 text-white p-3 rounded-lg shadow-lg border border-red-700">
            <div className="text-xs font-mono space-y-1">
              <div className="font-semibold text-red-200">🔧 Developer Mode</div>
              <div>Segment: {currentSegmentIndex + 1}/{segments.length}</div>
              <div>Range: {currentSegment.startTime}s - {currentSegment.endTime}s</div>
              <div>Current: {currentTime.toFixed(1)}s</div>
              {currentSegment.title && (
                <div className="text-red-200 text-xs mt-1">"{currentSegment.title}"</div>
              )}
              <div className="text-red-300 text-xs mt-2 border-t border-red-700 pt-1">
                Use "Next Task" to skip to segment end
              </div>
            </div>
          </div>
        )}

        {/* Custom Play/Pause Overlay (when not in dev mode) */}
        {!isDevMode && (
          <div className="absolute inset-0 flex items-center justify-center">
            <Button
              onClick={togglePlayPause}
              size="lg"
              variant="secondary"
              className="bg-black/50 hover:bg-black/70 text-white border-white/20"
            >
              {isPlaying ? <Pause className="w-8 h-8" /> : <Play className="w-8 h-8" />}
            </Button>
          </div>
        )}
      </div>

      {/* Video Information Header */}
      {title && (
        <div className="p-4 border-b">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">{title}</h3>
            <div className="flex items-center space-x-2">
              {currentSegment && (
                <Badge variant="outline">
                  Segment {currentSegmentIndex + 1} of {segments.length}
                </Badge>
              )}
              {isDevMode && (
                <Badge variant="destructive" className="text-xs">
                  Dev Mode
                </Badge>
              )}
            </div>
          </div>
          {currentSegment?.description && (
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {currentSegment.description}
            </p>
          )}
        </div>
      )}

      {/* Custom Controls (when not using native controls) */}
      {!isDevMode && (
        <div className="p-4 space-y-3">
          {/* Progress Bar */}
          <div>
            <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
              <span>{Math.floor(currentTime / 60)}:{Math.floor(currentTime % 60).toString().padStart(2, '0')}</span>
              <span>{Math.floor(duration / 60)}:{Math.floor(duration % 60).toString().padStart(2, '0')}</span>
            </div>
            <div 
              className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 cursor-pointer"
              onClick={handleSeek}
            >
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-150"
                style={{ width: `${getOverallProgress()}%` }}
              />
            </div>
          </div>

          {/* Current Segment Progress */}
          {currentSegment && (
            <div>
              <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                <span>Segment Progress</span>
                <span>{currentSegment.title || `Segment ${currentSegmentIndex + 1}`}</span>
              </div>
              <Progress value={getSegmentProgress()} className="h-1" />
            </div>
          )}

          {/* Control Buttons */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Button onClick={togglePlayPause} size="sm" variant="outline">
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              </Button>
              
              {currentSegment && (
                <Button 
                  onClick={() => {
                    if (videoElement) {
                      videoElement.currentTime = currentSegment.endTime - 1;
                    }
                  }}
                  size="sm" 
                  variant="outline"
                  title="Skip to segment end"
                >
                  <SkipForward className="w-4 h-4" />
                </Button>
              )}
            </div>

            <div className="flex items-center space-x-2">
              <Volume2 className="w-4 h-4 text-gray-500" />
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={volume}
                onChange={(e) => {
                  const newVolume = parseFloat(e.target.value);
                  setVolume(newVolume);
                  if (videoElement) {
                    videoElement.volume = newVolume;
                  }
                }}
                className="w-20"
              />
            </div>
          </div>
        </div>
      )}

      {/* Segment Navigation */}
      {showSegmentNavigation && segments.length > 1 && (
        <div className="p-4 border-t bg-gray-50 dark:bg-gray-800">
          <div className="text-sm font-medium mb-2">Video Segments</div>
          <div className="flex flex-wrap gap-2">
            {segments.map((segment, index) => (
              <Button
                key={segment.id}
                onClick={() => {
                  if (videoElement) {
                    videoElement.currentTime = segment.startTime;
                  }
                }}
                size="sm"
                variant={index === currentSegmentIndex ? "default" : "outline"}
                className="text-xs"
              >
                {index + 1}. {segment.title || `Segment ${index + 1}`}
                {index <= currentSegmentIndex && " ✓"}
              </Button>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
});

SegmentedVideoPlayer.displayName = 'SegmentedVideoPlayer';

export default SegmentedVideoPlayer;