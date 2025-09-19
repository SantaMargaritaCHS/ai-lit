import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Play, Pause, Volume2, VolumeX, Maximize
} from 'lucide-react';
import { VideoSegment } from '@/services/videoSegments';

interface VideoControlsProps {
  videoRef: React.RefObject<HTMLVideoElement>;
  currentSegment: VideoSegment;
  isPaused: boolean;
  progress: number;
  currentTime: number;
  duration: number;
  volume: number;
  muted: boolean;
  onPlayPause: () => void;
  onSeek?: (time: number) => void; // Make optional since we'll disable seeking
  onVolumeChange: (volume: number) => void;
  onMuteToggle: () => void;
  onFullscreen: () => void;
  allowSeeking?: boolean; // Add prop to control seeking
}

export function VideoControls({
  videoRef,
  currentSegment,
  isPaused,
  progress,
  currentTime,
  duration,
  volume,
  muted,
  onPlayPause,
  onSeek,
  onVolumeChange,
  onMuteToggle,
  onFullscreen,
  allowSeeking = false
}: VideoControlsProps) {
  const [showControls, setShowControls] = useState(true);
  const [showTooltip, setShowTooltip] = useState<number | null>(null);
  const [isHovering, setIsHovering] = useState(false);

  // Auto-hide controls
  useEffect(() => {
    let hideTimer: NodeJS.Timeout;
    
    const resetTimer = () => {
      setShowControls(true);
      clearTimeout(hideTimer);
      hideTimer = setTimeout(() => {
        if (!isPaused && !isHovering) {
          setShowControls(false);
        }
      }, 3000);
    };
    
    resetTimer();
    const handleMouseMove = () => resetTimer();
    
    document.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      clearTimeout(hideTimer);
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, [isPaused, isHovering]);
  
  const formatTime = (time: number): string => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!currentSegment) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickPercent = clickX / rect.width;
    
    // Calculate new time within segment bounds
    const segmentDuration = duration;
    const newTime = segmentDuration * clickPercent;
    
    // For mandatory segments, restrict seeking beyond watched portion
    if (currentSegment.mandatory) {
      const watchedProgress = progress / 100;
      const maxAllowedTime = segmentDuration * watchedProgress;
      onSeek(Math.min(newTime, maxAllowedTime));
    } else {
      onSeek(newTime);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value) / 100;
    onVolumeChange(newVolume);
  };

  return (
    <motion.div 
      className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent text-white p-4 rounded-b-lg"
      initial={{ opacity: 0, y: 20 }}
      animate={{ 
        opacity: showControls ? 1 : 0,
        y: showControls ? 0 : 20
      }}
      transition={{ duration: 0.3 }}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {/* Progress Bar */}
      <div className="mb-3">
        <div 
          className={`relative w-full h-2 bg-white/30 rounded-lg transition-all duration-200 ${
            allowSeeking ? 'cursor-pointer hover:h-3' : 'cursor-not-allowed'
          }`}
          onClick={allowSeeking ? handleProgressClick : undefined}
        >
          <div 
            className="absolute top-0 left-0 h-full bg-white rounded-lg transition-all duration-200"
            style={{ width: `${progress}%` }}
          />
          
          {/* Buffered progress indicator */}
          <div 
            className="absolute top-0 left-0 h-full bg-white/40 rounded-lg"
            style={{ width: `${Math.min(progress + 10, 100)}%` }}
          />
          
          {/* Chapter markers */}
          {currentSegment?.chapters?.map((chapter, index) => {
            if (!duration) return null;
            
            const markerPosition = (chapter.time / duration) * 100;
            
            return (
              <div
                key={index}
                className="absolute top-0 w-1 h-full bg-yellow-400 rounded cursor-pointer hover:w-2 transition-all duration-200"
                style={{ left: `${markerPosition}%` }}
                onMouseEnter={() => setShowTooltip(index)}
                onMouseLeave={() => setShowTooltip(null)}
                onClick={(e) => {
                  e.stopPropagation();
                  if (allowSeeking && onSeek) {
                    onSeek(chapter.time);
                  }
                }}
              >
                {showTooltip === index && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-black/90 text-white text-xs px-2 py-1 rounded whitespace-nowrap"
                  >
                    {chapter.title}
                  </motion.div>
                )}
              </div>
            );
          })}
          
          {/* Progress indicator handle */}
          <div 
            className="absolute top-1/2 transform -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-lg opacity-0 hover:opacity-100 transition-opacity duration-200"
            style={{ left: `${progress}%`, marginLeft: '-6px' }}
          />
        </div>
        <div className="flex justify-between text-xs mt-2 opacity-75">
          <span>{formatTime(currentTime)}</span>
          <motion.span 
            className="text-center font-medium px-3 py-2 bg-black/90 rounded text-white video-title"
            key={currentSegment?.title}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2 }}
          >
            {currentSegment?.title || 'Loading...'}
          </motion.span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      {/* Main Controls */}
      <div className="flex items-center justify-between">
        {/* Left Controls */}
        <div className="flex items-center gap-2">
          {/* Segment Navigation */}
          <Button
            variant="ghost"
            size="sm"
            onClick={onPreviousSegment}
            disabled={!canGoBack}
            className="text-white hover:text-white hover:bg-white/20 disabled:opacity-30"
          >
            <SkipBack className="h-4 w-4" />
          </Button>

          {/* Skip Backward */}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleSkipBackward}
            className="text-white hover:text-white hover:bg-white/20"
          >
            <Rewind className="h-4 w-4" />
          </Button>

          {/* Play/Pause */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              variant="ghost"
              size="lg"
              onClick={onPlayPause}
              className="text-white hover:text-white hover:bg-white/20 px-4"
            >
              <motion.div
                key={isPaused ? 'play' : 'pause'}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.2 }}
              >
                {isPaused ? <Play className="h-6 w-6" /> : <Pause className="h-6 w-6" />}
              </motion.div>
            </Button>
          </motion.div>

          {/* Skip Forward */}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleSkipForward}
            className="text-white hover:text-white hover:bg-white/20"
          >
            <FastForward className="h-4 w-4" />
          </Button>

          {/* Next Segment */}
          <Button
            variant="ghost"
            size="sm"
            onClick={onNextSegment}
            disabled={!canGoForward}
            className="text-white hover:text-white hover:bg-white/20 disabled:opacity-30"
          >
            <SkipForward className="h-4 w-4" />
          </Button>
        </div>

        {/* Right Controls */}
        <div className="flex items-center gap-3">
          {/* Volume Controls */}
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={onMuteToggle}
              className="text-white hover:text-white hover:bg-white/20"
            >
              {muted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
            </Button>
            <input
              type="range"
              min="0"
              max="100"
              value={muted ? 0 : volume * 100}
              onChange={handleVolumeChange}
              className="w-16 h-1 bg-white/30 rounded-lg appearance-none cursor-pointer slider-thumb"
            />
          </div>

          {/* Fullscreen */}
          <Button
            variant="ghost"
            size="sm"
            onClick={onFullscreen}
            className="text-white hover:text-white hover:bg-white/20"
          >
            <Maximize className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Chapter Navigation (if available) */}
      {currentSegment?.chapters && currentSegment.chapters.length > 0 && (
        <motion.div 
          className="mt-3 pt-3 border-t border-white/20"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: showControls ? 1 : 0, height: showControls ? 'auto' : 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex flex-wrap gap-1">
            {currentSegment.chapters.map((chapter, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onSeek(chapter.time)}
                  className="text-xs text-white hover:text-white hover:bg-white/20 px-2 py-1"
                >
                  {chapter.title}
                </Button>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}

export default VideoControls;