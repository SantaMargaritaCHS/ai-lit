// Enhanced VideoSegment with subtitles, volume control, and auto-start

import React, { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, RotateCw, Volume2, VolumeX, Subtitles } from 'lucide-react';

interface Props {
  videoUrl: string;
  startTime: number;
  endTime: number;
  title: string;
  onComplete: () => void;
}

export default function VideoSegment({ videoUrl, startTime, endTime, title, onComplete }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(startTime);
  const [hasWatched, setHasWatched] = useState(false);
  const [volume, setVolume] = useState(0.8);
  const [isMuted, setIsMuted] = useState(true); // Start muted for auto-play
  const [showSubtitles, setShowSubtitles] = useState(false);
  const [controlsVisible, setControlsVisible] = useState(true);
  const [hasAutoPlayed, setHasAutoPlayed] = useState(false);

  // Setup video on load
  useEffect(() => {
    if (videoRef.current) {
      const video = videoRef.current;
      video.currentTime = startTime;
      video.volume = volume;
    }
  }, [startTime, volume]);

  // Handle video load and auto-play
  const handleVideoLoad = () => {
    if (videoRef.current) {
      const video = videoRef.current;
      video.currentTime = startTime;
      video.volume = 0; // Start muted for auto-play
    }
  };

  // Handle when video starts playing (auto-unmute after auto-play)
  const handleVideoPlay = () => {
    setIsPlaying(true);
    if (!hasAutoPlayed && videoRef.current) {
      // Auto-unmute after 1 second of auto-play
      setTimeout(() => {
        if (videoRef.current && isMuted) {
          videoRef.current.volume = volume;
          setIsMuted(false);
        }
      }, 1000);
      setHasAutoPlayed(true);
    }
  };

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => {
      setCurrentTime(video.currentTime);
      
      // Stop at endTime if specified
      if (endTime > 0 && video.currentTime >= endTime) {
        video.pause();
        setIsPlaying(false);
        if (!hasWatched) {
          setHasWatched(true);
        }
      }
    };

    const handleEnded = () => {
      setIsPlaying(false);
      if (!hasWatched) {
        setHasWatched(true);
      }
    };

    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('ended', handleEnded);

    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('ended', handleEnded);
    };
  }, [endTime, hasWatched]);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const restart = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = startTime;
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  const handleVolumeChange = (newVolume: number) => {
    setVolume(newVolume);
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
      setIsMuted(newVolume === 0);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      if (isMuted) {
        videoRef.current.volume = volume;
        setIsMuted(false);
      } else {
        videoRef.current.volume = 0;
        setIsMuted(true);
      }
    }
  };

  const toggleSubtitles = () => {
    setShowSubtitles(!showSubtitles);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto"
    >
      <div className="bg-white/10 backdrop-blur-lg rounded-xl overflow-hidden">
        <div className="p-6 border-b border-white/10">
          <h2 className="text-2xl font-bold text-white">{title}</h2>
          <p className="text-blue-200 mt-1">
            Duration: {formatTime(endTime - startTime)}
          </p>
        </div>

        <div className="relative bg-black">
          <video
            ref={videoRef}
            src={videoUrl}
            className="w-full"
            onClick={togglePlay}
            crossOrigin="anonymous"
            autoPlay
            muted={isMuted}
            onLoadedData={handleVideoLoad}
            onPlay={handleVideoPlay}
            onPause={() => setIsPlaying(false)}
          >
            {/* Subtitles Track */}
            <track
              kind="subtitles"
              src="/subtitles/understanding-llms.srt"
              srcLang="en"
              label="English"
              default={showSubtitles}
            />
          </video>
          
          {/* Custom Controls Overlay */}
          <motion.div 
            className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-4"
            initial={{ opacity: 1 }}
            animate={{ opacity: controlsVisible ? 1 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-center gap-4">
              {/* Play/Pause Button */}
              <button
                onClick={togglePlay}
                className="bg-white/20 hover:bg-white/30 rounded-full p-3 transition-colors"
              >
                {isPlaying ? (
                  <Pause className="w-6 h-6 text-white" />
                ) : (
                  <Play className="w-6 h-6 text-white" />
                )}
              </button>
              
              {/* Restart Button */}
              <button
                onClick={restart}
                className="bg-white/20 hover:bg-white/30 rounded-full p-2 transition-colors"
              >
                <RotateCw className="w-4 h-4 text-white" />
              </button>

              {/* Volume Controls */}
              <div className="flex items-center gap-2">
                <button
                  onClick={toggleMute}
                  className="bg-white/20 hover:bg-white/30 rounded-full p-2 transition-colors"
                >
                  {isMuted || volume === 0 ? (
                    <VolumeX className="w-4 h-4 text-white" />
                  ) : (
                    <Volume2 className="w-4 h-4 text-white" />
                  )}
                </button>
                
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={isMuted ? 0 : volume}
                  onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                  className="w-16 h-1 bg-white/20 rounded-lg appearance-none slider"
                />
              </div>

              {/* Progress Bar */}
              <div className="flex-1">
                <div className="bg-white/20 rounded-full h-2">
                  <div
                    className="bg-blue-500 h-full rounded-full transition-all"
                    style={{
                      width: `${((currentTime - startTime) / (endTime - startTime)) * 100}%`
                    }}
                  />
                </div>
              </div>

              {/* Time Display */}
              <span className="text-white text-sm">
                {formatTime(currentTime - startTime)} / {formatTime(endTime - startTime)}
              </span>

              {/* Subtitle Toggle */}
              <button
                onClick={toggleSubtitles}
                className={`rounded-full p-2 transition-colors ${
                  showSubtitles 
                    ? 'bg-blue-500/50 hover:bg-blue-500/70' 
                    : 'bg-white/20 hover:bg-white/30'
                }`}
              >
                <Subtitles className="w-4 h-4 text-white" />
              </button>
            </div>
          </motion.div>
        </div>

        <div className="p-6">
          <button
            onClick={onComplete}
            disabled={!hasWatched}
            className={`w-full py-3 rounded-lg font-medium transition-all ${
              hasWatched
                ? 'bg-blue-600 hover:bg-blue-700 text-white'
                : 'bg-gray-700 text-gray-400 cursor-not-allowed'
            }`}
          >
            {hasWatched ? 'Continue to Next Activity' : 'Watch the video to continue'}
          </button>
        </div>
      </div>
    </motion.div>
  );
}