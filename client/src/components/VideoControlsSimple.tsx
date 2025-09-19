import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { 
  Play, Pause, Volume2, VolumeX, Maximize, Captions
} from 'lucide-react';
import { VideoSegment } from '@/services/videoSegments';

interface VideoControlsSimpleProps {
  videoRef: React.RefObject<HTMLVideoElement>;
  currentSegment: VideoSegment;
  isPaused: boolean;
  progress: number;
  currentTime: number;
  duration: number;
  volume: number;
  muted: boolean;
  onPlayPause: () => void;
  onVolumeChange: (volume: number) => void;
  onMuteToggle: () => void;
  onFullscreen: () => void;
  allowSeeking?: boolean;
  maxWatchedProgress?: number;
  onSeek?: (time: number) => void;
  enableSubtitles?: boolean;
  subtitlesEnabled?: boolean;
  onSubtitleToggle?: () => void;
}

export function VideoControlsSimple({
  videoRef,
  currentSegment,
  isPaused,
  progress,
  currentTime,
  duration,
  volume,
  muted,
  onPlayPause,
  onVolumeChange,
  onMuteToggle,
  onFullscreen,
  allowSeeking = false,
  maxWatchedProgress = 0,
  onSeek,
  enableSubtitles = false,
  subtitlesEnabled = false,
  onSubtitleToggle
}: VideoControlsSimpleProps) {
  const [showControls, setShowControls] = useState(true);
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

  const formatTime = (seconds: number): string => {
    if (!seconds || isNaN(seconds)) return '0:00';
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value) / 100;
    onVolumeChange(newVolume);
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!onSeek || !allowSeeking) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickProgress = (clickX / rect.width) * 100;
    
    // Allow seeking backward to any already-watched portion
    // Restrict forward seeking beyond current progress
    const targetProgress = Math.min(clickProgress, Math.max(progress, maxWatchedProgress));
    const targetTime = (targetProgress / 100) * duration;
    
    onSeek(targetTime);
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
      {/* Progress Bar - Allow backward seeking to watched portions */}
      <div className="mb-4">
        <div 
          className={`relative w-full h-2 bg-white/30 rounded-lg ${allowSeeking ? 'cursor-pointer' : 'cursor-not-allowed'}`}
          onClick={handleProgressClick}
        >
          {/* Watched portion (seekable backward) */}
          <div 
            className="absolute top-0 left-0 h-full bg-white/50 rounded-lg"
            style={{ width: `${maxWatchedProgress}%` }}
          />
          
          {/* Current progress */}
          <div 
            className="absolute top-0 left-0 h-full bg-white rounded-lg transition-all duration-200"
            style={{ width: `${progress}%` }}
          />
          
          {/* Buffered progress indicator */}
          <div 
            className="absolute top-0 left-0 h-full bg-white/40 rounded-lg"
            style={{ width: `${Math.min(progress + 5, 100)}%` }}
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
        {/* Left Controls - Play/Pause Only */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="lg"
            onClick={onPlayPause}
            className="text-white hover:text-white hover:bg-white/20 rounded-full p-3 transition-all duration-200"
          >
            {isPaused ? (
              <Play className="h-8 w-8" />
            ) : (
              <Pause className="h-8 w-8" />
            )}
          </Button>
        </div>

        {/* Center - Current Video Title */}
        <div className="flex-1 text-center">
          <div className="text-xs text-white/70">
            Educational Content
          </div>
        </div>

        {/* Right Controls */}
        <div className="flex items-center gap-2">
          {/* Volume Controls */}
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={onMuteToggle}
              className="text-white hover:text-white hover:bg-white/20"
            >
              {muted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
            </Button>
            <input
              type="range"
              min="0"
              max="100"
              value={muted ? 0 : volume * 100}
              onChange={handleVolumeChange}
              className="w-20 h-1 bg-white/30 rounded-lg appearance-none cursor-pointer volume-slider"
              style={{
                background: `linear-gradient(to right, white 0%, white ${muted ? 0 : volume * 100}%, rgba(255,255,255,0.3) ${muted ? 0 : volume * 100}%, rgba(255,255,255,0.3) 100%)`
              }}
            />
          </div>
          
          {/* Subtitle Toggle - Always show when enableSubtitles is true */}
          {enableSubtitles && onSubtitleToggle && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onSubtitleToggle}
              className={`text-white hover:text-white hover:bg-white/20 transition-all duration-200 ${
                subtitlesEnabled ? 'bg-blue-500/50 ring-2 ring-blue-400' : 'bg-white/10'
              }`}
              title={subtitlesEnabled ? 'Hide subtitles (CC Off)' : 'Show subtitles (CC On)'}
            >
              <Captions className={`h-5 w-5 ${subtitlesEnabled ? 'text-blue-200' : 'text-white/70'}`} />
            </Button>
          )}
          
          {/* Fullscreen */}
          <Button
            variant="ghost"
            size="sm"
            onClick={onFullscreen}
            className="text-white hover:text-white hover:bg-white/20"
          >
            <Maximize className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </motion.div>
  );
}