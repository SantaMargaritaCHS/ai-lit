import React, { useRef, useEffect, useState } from 'react';
import { Play, Pause, Volume2, VolumeX, Subtitles } from 'lucide-react';

interface Props {
  videoUrl: string;
  startTime: number;
  endTime: number;
  title: string;
  autoPlay: boolean;
  subtitlesUrl?: string;
  onComplete: () => void;
}

export default function VideoSegmentPlayer({ 
  videoUrl, 
  startTime, 
  endTime, 
  title, 
  autoPlay,
  subtitlesUrl,
  onComplete 
}: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [subtitlesEnabled, setSubtitlesEnabled] = useState(false);
  const [currentTime, setCurrentTime] = useState(startTime);
  const [duration, setDuration] = useState(endTime - startTime);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [videoError, setVideoError] = useState<string | null>(null);
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);

  // Set initial time and prevent seeking
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Set initial time
    video.currentTime = startTime;

    // Initialize volume control
    video.volume = volume;
    video.muted = isMuted;

    // Error handling
    const handleError = (e: Event) => {
      console.error('❌ Video error:', e);
      setVideoError('Failed to load video');
    };

    video.addEventListener('error', handleError);

    // Prevent seeking - CRITICAL but allow normal playback
    const preventSeeking = (e: Event) => {
      const video = e.target as HTMLVideoElement;
      // Only prevent if user manually sought to a significantly different time
      // Allow small time differences for normal playback
      if (Math.abs(video.currentTime - startTime) > 2 && 
          (video.currentTime < startTime || video.currentTime > endTime)) {
        console.log('Preventing seek outside segment bounds');
        video.currentTime = Math.max(startTime, Math.min(video.currentTime, endTime));
      }
    };

    video.addEventListener('seeked', preventSeeking);

    // Auto play
    if (autoPlay && !hasStarted) {
      const playPromise = video.play();
      playPromise?.then(() => {
        setIsPlaying(true);
        setHasStarted(true);
        console.log(`▶️ Video playing: "${title}" at ${startTime}s`);
      }).catch(err => {
        console.log("Autoplay prevented:", err);
      });
    }

    return () => {
      video.removeEventListener('seeked', preventSeeking);
      video.removeEventListener('error', handleError);
    };
  }, [startTime, endTime, autoPlay, hasStarted, title, volume, isMuted]);

  // Handle volume changes
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    
    video.volume = volume;
    video.muted = isMuted;
    console.log('🔊 Volume updated:', { volume: Math.round(volume * 100) + '%', muted: isMuted });
  }, [volume, isMuted]);

  // Handle subtitles
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Simple subtitle toggle - just change mode when user toggles
    if (video.textTracks && video.textTracks[0]) {
      const track = video.textTracks[0];
      track.mode = subtitlesEnabled ? 'showing' : 'hidden';
      console.log(`📝 Subtitles ${subtitlesEnabled ? 'ON' : 'OFF'}`);
    }
  }, [subtitlesEnabled]);

  // Handle time updates and completion
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => {
      const current = video.currentTime;
      setCurrentTime(current);
      
      // Check if we've reached the end
      if (endTime !== -1 && current >= endTime) {
        video.pause();
        onComplete();
      }
    };

    video.addEventListener('timeupdate', handleTimeUpdate);
    return () => video.removeEventListener('timeupdate', handleTimeUpdate);
  }, [endTime, onComplete]);

  const handlePlayPause = () => {
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      video.pause();
      setIsPlaying(false);
    } else {
      const playPromise = video.play();
      playPromise?.then(() => {
        setIsPlaying(true);
        setHasStarted(true);
      }).catch(err => {
        console.error("Play failed:", err);
      });
    }
  };

  const toggleSubtitles = () => {
    const newState = !subtitlesEnabled;
    setSubtitlesEnabled(newState);
    console.log(`📝 Toggling subtitles: ${newState ? 'ON' : 'OFF'}`);
    
    // Force immediate update of text tracks
    const video = videoRef.current;
    if (video && video.textTracks && video.textTracks[0]) {
      video.textTracks[0].mode = newState ? 'showing' : 'hidden';
      console.log('Text track mode set to:', video.textTracks[0].mode);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
    console.log('🔊 Volume changed to:', Math.round(newVolume * 100) + '%');
    
    // Save to localStorage for persistence
    localStorage.setItem('videoVolume', newVolume.toString());
  };

  const toggleMute = () => {
    const newMutedState = !isMuted;
    setIsMuted(newMutedState);
    console.log('🔊 Mute toggled:', newMutedState ? 'MUTED' : 'UNMUTED');
  };

  // Load saved volume on mount
  useEffect(() => {
    const savedVolume = localStorage.getItem('videoVolume');
    if (savedVolume) {
      const vol = parseFloat(savedVolume);
      setVolume(vol);
      setIsMuted(vol === 0);
    }
  }, []);

  // Calculate progress for this segment
  const segmentProgress = duration > 0 
    ? ((currentTime - startTime) / duration) * 100 
    : 0;

  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-xl p-8">
      <h2 className="text-2xl font-bold text-white mb-6">{title}</h2>
      
      <div className="relative bg-black rounded-lg overflow-hidden">
        <video
          ref={videoRef}
          className="w-full"
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          controlsList="nodownload nofullscreen" // Prevent download, allow volume
          disablePictureInPicture
          onContextMenu={(e) => e.preventDefault()} // Prevent right-click
          onError={(e) => {
            console.error('❌ Video error:', e);
            setVideoError('Failed to load video');
          }}
        >
          <source src={videoUrl} type="video/mp4" />
          {subtitlesUrl && (
            <track
              kind="subtitles"
              src={subtitlesUrl}
              srcLang="en"
              label="English"
              default={false}
            />
          )}
        </video>
        
        {/* Custom controls overlay */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
          {/* Progress bar - NOT CLICKABLE */}
          <div className="mb-3">
            <div className="bg-gray-700 h-1 rounded-full overflow-hidden">
              <div 
                className="bg-blue-500 h-full transition-all duration-300"
                style={{ width: `${segmentProgress}%` }}
              />
            </div>
          </div>

          {/* Control buttons */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {/* Play/Pause */}
              <button
                onClick={handlePlayPause}
                className="text-white hover:text-blue-400 transition-colors"
                aria-label={isPlaying ? 'Pause' : 'Play'}
              >
                {isPlaying ? (
                  <Pause className="w-6 h-6" />
                ) : (
                  <Play className="w-6 h-6" />
                )}
              </button>

              {/* Time display */}
              <span className="text-sm text-gray-300">
                {Math.floor((currentTime - startTime) / 60)}:
                {Math.floor((currentTime - startTime) % 60).toString().padStart(2, '0')} / 
                {Math.floor(duration / 60)}:
                {Math.floor(duration % 60).toString().padStart(2, '0')}
              </span>
            </div>

            <div className="flex items-center gap-4">
              {/* Volume Control */}
              <div 
                className="flex items-center gap-2 relative"
                onMouseEnter={() => setShowVolumeSlider(true)}
                onMouseLeave={() => setShowVolumeSlider(false)}
              >
                <button
                  onClick={toggleMute}
                  className="text-white hover:text-blue-400 transition-colors"
                  aria-label={isMuted ? 'Unmute' : 'Mute'}
                >
                  {isMuted || volume === 0 ? (
                    <VolumeX className="w-5 h-5" />
                  ) : (
                    <Volume2 className="w-5 h-5" />
                  )}
                </button>
                
                {/* Volume Slider */}
                <div className={`flex items-center gap-2 transition-all duration-200 ${
                  showVolumeSlider ? 'opacity-100 w-20' : 'opacity-0 w-0 overflow-hidden'
                }`}>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={volume}
                    onChange={handleVolumeChange}
                    className="volume-slider bg-gray-700 rounded-lg appearance-none cursor-pointer h-2"
                    aria-label="Volume control"
                    style={{
                      background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${volume * 100}%, #374151 ${volume * 100}%, #374151 100%)`
                    }}
                  />
                  <span className="text-xs text-gray-300 min-w-[2rem]">
                    {Math.round(volume * 100)}%
                  </span>
                </div>
              </div>
              
              {/* Subtitles toggle */}
              <button
                onClick={toggleSubtitles}
                className={`transition-colors ${
                  subtitlesEnabled 
                    ? 'text-yellow-400 bg-yellow-400/20' 
                    : 'text-gray-300 hover:text-white'
                } px-2 py-1 rounded`}
                aria-label="Toggle subtitles"
                title={subtitlesEnabled ? 'Turn off subtitles' : 'Turn on subtitles'}
              >
                <div className="flex items-center gap-1">
                  <Subtitles className="w-5 h-5" />
                  <span className="text-xs">CC</span>
                  {subtitlesEnabled && <span className="text-xs">ON</span>}
                </div>
              </button>
            </div>
          </div>
        </div>
        
        {/* Initial play overlay */}
        {!hasStarted && (
          <div 
            className="absolute inset-0 bg-black/50 flex items-center justify-center cursor-pointer"
            onClick={handlePlayPause}
          >
            <div className="bg-white/20 backdrop-blur-lg rounded-full p-6">
              <Play className="w-12 h-12 text-white" />
            </div>
          </div>
        )}
        
        {/* Error overlay */}
        {videoError && (
          <div className="absolute top-4 left-4 right-4 bg-red-900/90 backdrop-blur-sm text-white p-3 rounded-lg">
            <div className="flex items-center gap-2">
              <span className="text-red-300">⚠️</span>
              <span className="text-sm">{videoError}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}