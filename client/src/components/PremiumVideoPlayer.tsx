import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { AlertCircle, Captions, FastForward } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getVideoUrl, videoSources } from '@/services/videoService';
import { videoSegments, VideoSegment, getNextSegment } from '@/services/videoSegments';
import { VideoControlsSimple } from './VideoControlsSimple';
import { InteractivePauseActivity, InteractivePause } from './InteractivePauseActivity';
import InteractiveOverlay from './InteractiveOverlay';
import SegmentNavigator from './SegmentNavigator';
import { videoAnalytics } from '@/services/videoAnalytics';
import { videoErrorHandler } from '@/services/videoErrorHandler';
import { parseSRT, getCurrentSubtitle, SubtitleCue } from '@/utils/subtitleParser';
import { introGenAISubtitles } from '@/data/subtitles';
import { understandingLLMsSubtitles, trainingSubtitles, tokenizationSubtitles, neuralNetworksSubtitles, finalThoughtsSubtitles } from '@/data/llmSubtitles';
import { aiEnvironmentalImpactSubtitles } from '@/data/aiEnvironmentalSubtitles';
import { llmLimitationsSubtitles } from '@/data/llmLimitationsSubtitles';
import { promptingBasicsSubtitles } from '@/data/promptingBasicsSubtitles';
import { rtfFrameworkSubtitles } from '@/data/rtfFrameworkSubtitles';
import { useDevMode } from '@/context/DevModeContext';
import '@/styles/premium-video-player.css';

interface PremiumVideoPlayerProps {
  videoUrl: string;
  segments: VideoSegment[];
  videoId: string;
  onSegmentComplete?: (segmentId: string) => void;
  onModuleComplete?: () => void;
  className?: string;
  userId?: string;
  hideSegmentNavigator?: boolean;
  interactivePauses?: InteractivePause[];
  allowSeeking?: boolean;
  enableSubtitles?: boolean;
  videoRef?: React.RefObject<HTMLVideoElement>;
  autoPlay?: boolean;
  initialVolume?: number;
  initialMuted?: boolean;
}

export function PremiumVideoPlayer({
  videoUrl,
  segments,
  videoId,
  onSegmentComplete,
  onModuleComplete,
  className = "",
  userId,
  hideSegmentNavigator = false,
  interactivePauses = [],
  allowSeeking = false,
  enableSubtitles = false,
  videoRef: externalVideoRef,
  autoPlay = true,
  initialVolume = 1,
  initialMuted = false
}: PremiumVideoPlayerProps) {
  const [currentSegmentIndex, setCurrentSegmentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [errorDetails, setErrorDetails] = useState<any>(null);
  const [showFallbackOptions, setShowFallbackOptions] = useState(false);
  const [networkQuality, setNetworkQuality] = useState<string>('checking...');
  const [progress, setProgress] = useState<Record<string, number>>({});
  const [completedSegments, setCompletedSegments] = useState<Set<string>>(new Set());
  const [isPaused, setIsPaused] = useState(false);
  const [showInteractive, setShowInteractive] = useState(false);
  const [currentInteraction, setCurrentInteraction] = useState<any>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(initialVolume);
  const [muted, setMuted] = useState(initialMuted);
  const [isCrossfading, setIsCrossfading] = useState(false);
  const [currentPause, setCurrentPause] = useState<InteractivePause | null>(null);
  const [showPauseActivity, setShowPauseActivity] = useState(false);
  const [maxWatchedProgress, setMaxWatchedProgress] = useState(0);
  const [videoFadedIn, setVideoFadedIn] = useState(false);
  
  // Subtitle states
  const [subtitlesEnabled, setSubtitlesEnabled] = useState(false); // Always start with subtitles disabled
  const [subtitles, setSubtitles] = useState<SubtitleCue[]>([]);
  const [currentSubtitle, setCurrentSubtitle] = useState<string | null>(null);
  
  const internalVideoRef = useRef<HTMLVideoElement>(null);
  const videoRef = externalVideoRef || internalVideoRef;
  const pausePointsTriggered = useRef<Set<string>>(new Set());
  const completedPauses = useRef<Set<string>>(new Set());
  const hasTriedAutoPlay = useRef(false);
  const currentSegment = segments[currentSegmentIndex];
  const { isDevModeActive: isDevMode } = useDevMode();

  // Initialize subtitles
  useEffect(() => {
    const loadSubtitles = () => {
      if (!enableSubtitles) return;
      
      try {
        // For Understanding LLMs module videos
        if (videoId.includes('understanding-llms')) {
          let subtitleContent = '';
          let subtitleType = '';
          
          // Check specific video segment and use appropriate subtitles
          if (videoId.includes('video-1')) {
            subtitleContent = understandingLLMsSubtitles;
            subtitleType = 'Introduction to LLMs';
          } else if (videoId.includes('video-2')) {
            subtitleContent = understandingLLMsSubtitles; // Same video content, different segment
            subtitleType = 'LLMs and NLP';
          } else if (videoId.includes('video-3')) {
            subtitleContent = trainingSubtitles;
            subtitleType = 'Training process';
          } else if (videoId.includes('video-4')) {
            subtitleContent = tokenizationSubtitles;
            subtitleType = 'Tokenization';
          } else if (videoId.includes('video-5')) {
            subtitleContent = neuralNetworksSubtitles;
            subtitleType = 'Neural networks';
          } else if (videoId.includes('video-6')) {
            subtitleContent = understandingLLMsSubtitles; // Main content continuation
            subtitleType = 'Advanced concepts';
          } else if (videoId.includes('video-7')) {
            subtitleContent = finalThoughtsSubtitles;
            subtitleType = 'Final thoughts';
          } else {
            // Fallback to intro content
            subtitleContent = understandingLLMsSubtitles;
            subtitleType = 'Main LLM content';
          }
          
          console.log(`📝 Loading ${subtitleType} subtitles for`, videoId);
          const parsedSubtitles = parseSRT(subtitleContent);
          setSubtitles(parsedSubtitles);
          console.log(`📝 ${subtitleType} subtitles loaded:`, parsedSubtitles.length, 'cues');
          if (parsedSubtitles.length > 0) {
            console.log('📝 First subtitle:', parsedSubtitles[0]);
          }
        } else if (videoId === 'tokenization-complete') {
          // For tokenization video, fallback to LLM subtitles for now
          const parsedSubtitles = parseSRT(understandingLLMsSubtitles);
          setSubtitles(parsedSubtitles);
          console.log('📝 Tokenization subtitles loaded:', parsedSubtitles.length, 'cues');
        } else if (videoId === 'intro-gen-ai') {
          // Legacy support for intro-gen-ai
          const parsedSubtitles = parseSRT(introGenAISubtitles);
          setSubtitles(parsedSubtitles);
          console.log('📝 GenAI subtitles loaded:', parsedSubtitles.length, 'cues');
        } else if (videoId === 'ai-environmental-impact') {
          // AI Environmental Impact video
          const parsedSubtitles = parseSRT(aiEnvironmentalImpactSubtitles);
          setSubtitles(parsedSubtitles);
          console.log('📝 AI Environmental Impact subtitles loaded:', parsedSubtitles.length, 'cues');
        } else if (videoId === 'llm-limitations-main') {
          // LLM Limitations video
          const parsedSubtitles = parseSRT(llmLimitationsSubtitles);
          setSubtitles(parsedSubtitles);
          console.log('📝 LLM Limitations subtitles loaded:', parsedSubtitles.length, 'cues');
        } else if (videoId === 'prompt-basics' || videoId.includes('prompt-basics')) {
          // Introduction to Basic Prompting video
          const parsedSubtitles = parseSRT(promptingBasicsSubtitles);
          setSubtitles(parsedSubtitles);
          console.log('📝 Prompting Basics subtitles loaded:', parsedSubtitles.length, 'cues');
        } else if (videoId === 'rtf-framework' || videoId.includes('rtf-framework')) {
          // RTF Framework Prompting video
          const parsedSubtitles = parseSRT(rtfFrameworkSubtitles);
          setSubtitles(parsedSubtitles);
          console.log('📝 RTF Framework subtitles loaded:', parsedSubtitles.length, 'cues');
        } else if (videoId.includes('introduction-to-prompting')) {
          // Introduction to Prompting module videos
          let subtitleContent = '';
          let subtitleType = '';
          
          // Check which segment is playing and use appropriate subtitles
          if (currentSegment) {
            if (currentSegment.id === 'intro-segment-1') {
              subtitleContent = promptingBasicsSubtitles;
              subtitleType = 'Basic Prompting Introduction';
            } else if (currentSegment.id === 'intro-segment-2') {
              subtitleContent = promptingBasicsSubtitles; // Same video, different segment
              subtitleType = 'Recipe Approach';
            } else if (currentSegment.id === 'intro-segment-3') {
              subtitleContent = promptingBasicsSubtitles; // Same video, different segment
              subtitleType = 'Examples and Practice';
            } else {
              // Default to prompting basics
              subtitleContent = promptingBasicsSubtitles;
              subtitleType = 'Prompting Basics';
            }
          } else {
            // Default to prompting basics
            subtitleContent = promptingBasicsSubtitles;
            subtitleType = 'Prompting Basics';
          }
          
          console.log(`📝 Loading ${subtitleType} subtitles for`, videoId);
          const parsedSubtitles = parseSRT(subtitleContent);
          setSubtitles(parsedSubtitles);
          console.log(`📝 ${subtitleType} subtitles loaded:`, parsedSubtitles.length, 'cues');
          if (parsedSubtitles.length > 0) {
            console.log('📝 First subtitle:', parsedSubtitles[0]);
          }
        }
      } catch (error) {
        console.error('❌ Error loading subtitles for', videoId, ':', error);
      }
    };

    loadSubtitles();
  }, [enableSubtitles, videoId, currentSegment]);

  // Update current subtitle based on video time
  useEffect(() => {
    if (subtitlesEnabled && subtitles.length > 0 && videoRef.current) {
      // Use absolute video time for subtitle lookup, not segment-relative time
      const absoluteVideoTime = videoRef.current.currentTime;
      const subtitle = getCurrentSubtitle(subtitles, absoluteVideoTime);
      setCurrentSubtitle(subtitle);
    } else {
      setCurrentSubtitle(null);
    }
  }, [currentTime, subtitles, subtitlesEnabled]);

  // Load video on mount
  useEffect(() => {
    const loadVideo = async () => {
      try {
        setLoading(true);
        setVideoFadedIn(false); // Reset fade for new video/segment
        // Reset autoplay flag when loading a new video
        hasTriedAutoPlay.current = false;
        
        // Verify the video URL is valid
        if (!videoUrl) {
          throw new Error('No video URL provided');
        }
        
        // Get the actual download URL from Firebase Storage
        let actualVideoUrl = videoUrl;
        if (videoUrl.startsWith('Videos/')) {
          console.log('🔧 Resolving Firebase Storage URL for:', videoUrl);
          actualVideoUrl = await getVideoUrl(videoUrl);
          console.log('🔧 Resolved to:', actualVideoUrl);
        }
        
        // Set up the video element with the resolved URL
        if (videoRef.current) {
          console.log('🎬 Setting video source to:', actualVideoUrl);
          videoRef.current.src = actualVideoUrl;
          videoRef.current.load();
          
          // Add event listeners for debugging
          videoRef.current.addEventListener('loadstart', () => console.log('🎬 Video load started'));
          videoRef.current.addEventListener('loadedmetadata', () => console.log('🎬 Video metadata loaded'));
          videoRef.current.addEventListener('canplay', () => console.log('🎬 Video can play'));
          videoRef.current.addEventListener('canplaythrough', () => console.log('🎬 Video can play through'));
          videoRef.current.addEventListener('error', (e) => console.error('🎬 Video error:', e));
          
          // Try to play immediately after setting source if autoPlay is enabled
          if (autoPlay) {
            videoRef.current.play().then(() => {
              console.log('🎬 Initial play successful');
              setIsPaused(false);
              hasTriedAutoPlay.current = true;
            }).catch((error) => {
              console.log('🎬 Initial play failed, will retry on canplay:', error.message);
            });
          }
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Error loading video:', error);
        const errorInfo = videoErrorHandler.handleVideoError(
          error instanceof Error ? error : new Error('Failed to load video'),
          {
            videoUrl,
            segmentId: 'initialization',
            timestamp: Date.now(),
            userId,
            userAgent: navigator.userAgent
          },
          () => loadVideo(), // Retry function
          (fallback) => {
            setShowFallbackOptions(true);
            setError(`Video loading failed. ${fallback}`);
          }
        );
        setError(errorInfo.userMessage);
        setErrorDetails(errorInfo);
        setLoading(false);
      }
    };

    loadVideo();
  }, [videoUrl, userId]);

  // Handle segment changes and timing (exclude volume from dependencies to prevent reset)
  useEffect(() => {
    if (!videoRef.current || loading || !currentSegment) {
      return;
    }

    const video = videoRef.current;
    // Always set video time to segment start time
    video.currentTime = currentSegment.start;

    const handleLoadedMetadata = () => {
      console.log(`🎬 Video loaded: "${currentSegment.id}" duration=${video.duration}s`);

      // For full-length videos or segments that play to end (-1), use actual video duration
      if (currentSegment.end >= 100000 || currentSegment.end === -1) {
        setDuration(video.duration);
      } else {
        setDuration(currentSegment.end - currentSegment.start);
      }

      // Trigger fade-in effect
      setTimeout(() => setVideoFadedIn(true), 50);
    };

    const handleTimeUpdate = () => {
      const videoCurrentTime = video.currentTime;
      const segmentCurrentTime = videoCurrentTime - currentSegment.start;
      const segmentDuration = currentSegment.end - currentSegment.start;
      
      setCurrentTime(segmentCurrentTime);
      
      // For full-length videos or segments that play to end (-1), only check for segment end when reaching actual video end
      if (currentSegment.end >= 100000 || currentSegment.end === -1) {
        // This is a full-length video segment, check for video end instead
        if (video.ended || videoCurrentTime >= video.duration) {
          handleSegmentEnd();
          return;
        }
      } else {
        // Check for segment end for actual timed segments
        if (videoCurrentTime >= currentSegment.end) {
          handleSegmentEnd();
          return;
        }
      }

      // Check for pause points
      if (currentSegment.interactive?.pausePoints && !showInteractive) {
        const pausePoint = currentSegment.interactive.pausePoints.find(
          point => Math.abs(segmentCurrentTime - point.time) < 0.5 && 
               !pausePointsTriggered.current.has(`${currentSegment.id}_${point.time}`)
        );
        
        if (pausePoint) {
          pausePointsTriggered.current.add(`${currentSegment.id}_${pausePoint.time}`);
          video.pause();
          setIsPaused(true);
          setCurrentInteraction(pausePoint);
          setShowInteractive(true);
          // Track interaction start
          videoAnalytics.segmentStarted(currentSegment.id, userId);
        }
      }

      // Update segment progress
      let segmentProgress;
      if (currentSegment.end >= 100000 || currentSegment.end === -1) {
        // For full-length videos or segments that play to end, use video current time / video duration
        segmentProgress = Math.max(0, Math.min(100, (videoCurrentTime / video.duration) * 100));
      } else {
        segmentProgress = Math.max(0, Math.min(100, (segmentCurrentTime / segmentDuration) * 100));
      }
      
      setProgress(prev => ({
        ...prev,
        [currentSegment.id]: Math.max(prev[currentSegment.id] || 0, segmentProgress)
      }));

      // Update max watched progress for backward seeking
      setMaxWatchedProgress(prev => Math.max(prev, segmentProgress));
    };

    const handleVideoError = (event: Event) => {
      const videoError = (event.target as HTMLVideoElement).error;
      if (videoError) {
        const errorInfo = videoErrorHandler.handleVideoError(
          videoError,
          {
            videoUrl: currentSegment.source,
            segmentId: currentSegment.id,
            timestamp: Date.now(),
            userId,
            userAgent: navigator.userAgent
          },
          () => {
            // Retry by reloading the video
            video.load();
            video.currentTime = currentSegment.start;
          },
          (fallback) => {
            setShowFallbackOptions(true);
            setError(`Video error: ${fallback}`);
          }
        );
        setErrorDetails(errorInfo);
        setError(errorInfo.userMessage);
      }
    };

    // Interactive pause points checker
    const checkInteractivePauses = () => {
      if (!interactivePauses.length) return;
      const currentTime = video.currentTime;
      
      const pausePoint = interactivePauses.find(pause => 
        currentTime >= pause.timestamp && 
        currentTime - pause.timestamp < 1.0 && 
        !completedPauses.current.has(pause.id) &&
        !showPauseActivity
      );
      
      if (pausePoint) {
        console.log(`⏸️ Triggering pause at ${currentTime}s for "${pausePoint.id}"`);
        video.pause();
        setIsPaused(true);
        setCurrentPause(pausePoint);
        setShowPauseActivity(true);
        completedPauses.current.add(pausePoint.id);
      }
    };

    const enhancedTimeUpdate = () => {
      handleTimeUpdate();
      checkInteractivePauses();
    };

    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    video.addEventListener('timeupdate', enhancedTimeUpdate);
    video.addEventListener('play', () => {
      console.log(`▶️ Video playing: "${currentSegment.id}" at ${video.currentTime}s`);
      setIsPaused(false);
    });
    video.addEventListener('pause', () => {
      console.log(`⏸️ Video paused: "${currentSegment.id}" at ${video.currentTime}s`);
      setIsPaused(true);
    });
    video.addEventListener('error', handleVideoError);
    
    // Auto-start functionality - attempt to play when video can play
    const handleCanPlay = async () => {
      // Only attempt autoplay if autoPlay prop is true
      if (autoPlay && !hasTriedAutoPlay.current) {
        hasTriedAutoPlay.current = true;
        try {
          console.log(`🎬 Attempting auto-play for "${currentSegment.id}"`);
          await video.play();
          console.log(`✅ Auto-play successful for "${currentSegment.id}"`);
          setIsPaused(false);
        } catch (error) {
          console.warn('Auto-play blocked by browser, user interaction required:', error);
          setIsPaused(true);
          // Force the video to show it's paused and needs user interaction
          video.currentTime = currentSegment.start;
        }
      }
    };
    
    video.addEventListener('canplay', handleCanPlay);
    video.addEventListener('stalled', () => {
      console.warn('Video stalled, checking network quality...');
      videoErrorHandler.performNetworkDiagnostics().then(diagnostics => {
        setNetworkQuality(`${diagnostics.quality} (${diagnostics.latency}ms)`);
      });
    });

    return () => {
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      video.removeEventListener('timeupdate', enhancedTimeUpdate);
      video.removeEventListener('play', () => setIsPaused(false));
      video.removeEventListener('pause', () => setIsPaused(true));
      video.removeEventListener('error', handleVideoError);
      video.removeEventListener('canplay', handleCanPlay);
      video.removeEventListener('stalled', () => {});
    };
  }, [currentSegment?.id, videoUrl, loading, showInteractive]); // Removed volume/muted to prevent resets

  // Handle volume and muted changes separately to avoid currentTime reset
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.volume = volume;
      videoRef.current.muted = muted;
    }
  }, [volume, muted]);

  // Track segment start when segment changes
  useEffect(() => {
    if (currentSegment && !loading) {
      videoAnalytics.segmentStarted(currentSegment.id, userId);
    }
  }, [currentSegment?.id, loading, userId]);

  // Developer mode event listeners
  useEffect(() => {
    const handleDevSkipToReflection = (e: CustomEvent) => {
      if (videoRef.current && e.detail) {
        const targetTime = e.detail.timestamp;
        videoRef.current.currentTime = targetTime;
        console.log(`🔧 Dev mode: Skipped to ${e.detail.reflection} reflection at ${targetTime}s`);
      }
    };

    // Listen for developer mode events
    window.addEventListener('dev-skip-to-reflection', handleDevSkipToReflection as EventListener);

    return () => {
      window.removeEventListener('dev-skip-to-reflection', handleDevSkipToReflection as EventListener);
    };
  }, []);

  // Enhanced segment change function with subtitle synchronization fix
  const changeSegmentWithSubtitleRefresh = (index: number) => {
    setCurrentSegmentIndex(index);
    
    // Brief delay then refresh subtitle state to fix synchronization issues
    setTimeout(() => {
      if (videoRef.current && videoRef.current.textTracks.length > 0) {
        const track = videoRef.current.textTracks[0];
        const currentMode = track.mode;
        track.mode = 'hidden';
        setTimeout(() => {
          track.mode = currentMode;
        }, 10);
      }
    }, 100);
  };

  const handleSegmentEnd = () => {
    if (isCrossfading) return;
    
    const video = videoRef.current;
    if (!video) return;
    
    video.pause();
    
    // Mark segment as complete
    setProgress(prev => ({ ...prev, [currentSegment.id]: 100 }));
    setCompletedSegments(prev => new Set([...prev, currentSegment.id]));
    onSegmentComplete?.(currentSegment.id);

    // Track segment completion
    videoAnalytics.segmentCompleted(currentSegment.id, userId);

    // Handle crossfade or transition
    if (currentSegment.crossfade && currentSegmentIndex < segments.length - 1) {
      performCrossfade();
    } else if (currentSegmentIndex < segments.length - 1) {
      const nextIndex = currentSegmentIndex + 1;
      changeSegmentWithSubtitleRefresh(nextIndex);
      // Track new segment start
      videoAnalytics.segmentStarted(segments[nextIndex].id, userId);
    } else {
      // Track complete video completion
      const totalTime = videoSegments.reduce((sum, seg) => sum + (seg.end - seg.start), 0);
      const completionRate = 100; // Full completion
      videoAnalytics.videoCompleted(videoId, totalTime, completionRate, userId);
      onModuleComplete?.();
    }
  };

  const performCrossfade = () => {
    const video = videoRef.current;
    if (!video) return;

    setIsCrossfading(true);
    const fadeOutDuration = 1000;
    
    // Smooth fade out
    video.style.transition = `opacity ${fadeOutDuration}ms ease-in-out`;
    video.style.opacity = '0';
    
    setTimeout(() => {
      changeSegmentWithSubtitleRefresh(currentSegmentIndex + 1);
      video.style.opacity = '1';
      setIsCrossfading(false);
    }, fadeOutDuration);
  };

  const handleInteractionComplete = (response?: string) => {
    setShowInteractive(false);
    setCurrentInteraction(null);
    
    // Track interaction completion with response
    if (response && currentInteraction) {
      videoAnalytics.interactionCompleted(
        currentSegment.id, 
        response, 
        currentInteraction.type || 'reflection', 
        userId
      );
    }
    
    if (response) {
      console.log('User response:', response);
      // Here you could save the response to analytics or learning progress
    }
    videoRef.current?.play();
  };

  const canNavigateToSegment = (index: number): boolean => {
    if (!segments || !segments[index]) return false;
    const segment = segments[index];
    if (!segment.mandatory) return true;
    
    // For mandatory segments, check if previous mandatory segments are complete
    for (let i = 0; i < index; i++) {
      if (segments[i]?.mandatory && !completedSegments.has(segments[i].id)) {
        return false;
      }
    }
    return true;
  };

  const handleSegmentNavigation = (index: number) => {
    if (canNavigateToSegment(index) && index !== currentSegmentIndex) {
      changeSegmentWithSubtitleRefresh(index);
      pausePointsTriggered.current.clear(); // Reset pause points for new segment
    }
  };

  const handlePlayPause = () => {
    if (videoRef.current) {
      if (isPaused) {
        videoRef.current.play();
        videoAnalytics.videoResumed(currentSegment.id, currentTime, userId);
      } else {
        videoRef.current.pause();
        videoAnalytics.videoPaused(currentSegment.id, currentTime, userId);
      }
    }
  };

  const handleSeek = (time: number) => {
    if (videoRef.current && currentSegment) {
      const videoTime = currentSegment.start + time;
      videoRef.current.currentTime = Math.max(
        currentSegment.start, 
        Math.min(currentSegment.end, videoTime)
      );
      videoAnalytics.seekPerformed(currentSegment.id, videoTime, userId);
    }
  };

  const handleVolumeChange = (newVolume: number) => {
    setVolume(newVolume);
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
    }
  };

  const handleMuteToggle = () => {
    setMuted(!muted);
    if (videoRef.current) {
      videoRef.current.muted = !muted;
    }
  };

  const handleFullscreen = () => {
    if (videoRef.current?.requestFullscreen) {
      videoRef.current.requestFullscreen();
    }
  };

  const handlePreviousSegment = () => {
    if (currentSegmentIndex > 0) {
      handleSegmentNavigation(currentSegmentIndex - 1);
    }
  };

  const handleNextSegment = () => {
    if (currentSegmentIndex < videoSegments.length - 1) {
      handleSegmentNavigation(currentSegmentIndex + 1);
    }
  };

  if (loading) {
    return (
      <div className="video-loading">
        <div className="loading-spinner"></div>
        <h3 className="text-xl font-semibold mt-4 mb-2">Loading your AI journey...</h3>
        <p className="text-gray-400">Preparing interactive video segments</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="video-error">
        <div className="error-content">
          <AlertCircle className="h-16 w-16 text-red-500 mb-4" />
          <h3 className="text-xl font-semibold mb-2 text-white">Video Playback Issue</h3>
          <p className="text-gray-300 mb-4">{error}</p>
          
          {errorDetails && (
            <div className="error-details">
              <div className="mb-4">
                <h4 className="text-lg font-medium text-white mb-2">Quick Solutions:</h4>
                <ul className="text-sm text-gray-300 space-y-1">
                  {errorDetails.solutions.map((solution: string, index: number) => (
                    <li key={index} className="flex items-start space-x-2">
                      <span className="text-blue-400">•</span>
                      <span>{solution}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              {showFallbackOptions && errorDetails.fallbackOptions.length > 0 && (
                <div className="mb-4">
                  <h4 className="text-lg font-medium text-white mb-2">Alternative Options:</h4>
                  <div className="space-y-2">
                    {errorDetails.fallbackOptions.map((option: string, index: number) => (
                      <button
                        key={index}
                        onClick={() => {
                          setError('');
                          setErrorDetails(null);
                          setShowFallbackOptions(false);
                        }}
                        className="w-full text-left p-3 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
                      >
                        <span className="text-blue-300">{option}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
              
              <div className="network-info">
                <p className="text-xs text-gray-400">
                  Network Quality: <span className="text-blue-300">{networkQuality}</span>
                </p>
              </div>
            </div>
          )}
          
          <div className="error-actions mt-4 space-x-3">
            <button
              onClick={() => {
                setError('');
                setErrorDetails(null);
                setLoading(true);
                // Retry loading
                window.location.reload();
              }}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              Retry
            </button>
            <button
              onClick={() => setShowFallbackOptions(!showFallbackOptions)}
              className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
            >
              {showFallbackOptions ? 'Hide Options' : 'Show Options'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  const segmentProgress = currentTime > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="premium-video-container">
      {/* Main Video Player */}
      <div className="video-wrapper">
        <video
          ref={videoRef}
          className={`main-video transition-opacity ${
            isCrossfading ? 'opacity-0 duration-1000' : videoFadedIn ? 'opacity-100 duration-500' : 'opacity-0'
          }`}
          autoPlay={autoPlay}
          preload="auto"
          playsInline
          muted={muted}
        >
          <source src={videoUrl} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
            
            {showInteractive && currentInteraction && (
              <InteractiveOverlay
                interaction={currentInteraction}
                onComplete={handleInteractionComplete}
                allowSkip={!currentSegment.mandatory}
              />
            )}
            
            <VideoControlsSimple
              videoRef={videoRef}
              currentSegment={currentSegment}
              isPaused={isPaused}
              progress={segmentProgress}
              currentTime={currentTime}
              duration={duration}
              volume={volume}
              muted={muted}
              onPlayPause={handlePlayPause}
              onVolumeChange={handleVolumeChange}
              onMuteToggle={handleMuteToggle}
              onFullscreen={handleFullscreen}
              allowSeeking={allowSeeking}
              maxWatchedProgress={maxWatchedProgress}
              onSeek={handleSeek}
              enableSubtitles={enableSubtitles}
              subtitlesEnabled={subtitlesEnabled}
              onSubtitleToggle={() => setSubtitlesEnabled(!subtitlesEnabled)}
            />

            {/* Subtitle Overlay */}
            {currentSubtitle && subtitlesEnabled && (
              <div className="absolute bottom-20 left-0 right-0 flex justify-center px-4 pointer-events-none">
                <div className="bg-black/80 text-white px-4 py-2 rounded-lg text-center max-w-2xl">
                  <p className="text-sm leading-relaxed">{currentSubtitle}</p>
                </div>
              </div>
            )}

            {/* Developer Mode Video Controls */}
            {isDevMode && (
              <div className="absolute top-4 right-4 bg-red-900/90 text-white p-2 rounded">
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={() => {
                      if (videoRef.current && currentSegment) {
                        const skipTime = Math.max(currentSegment.end - 5, currentSegment.start);
                        videoRef.current.currentTime = skipTime;
                      }
                    }}
                    className="text-xs bg-red-800 hover:bg-red-700 px-2 py-1 h-auto"
                  >
                    <FastForward className="w-3 h-3 mr-1" />
                    Skip to End
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => {
                      if (currentSegment && onSegmentComplete) {
                        // Skip interactive pauses and complete segment
                        setShowPauseActivity(false);
                        setCurrentPause(null);
                        setShowInteractive(false);
                        onSegmentComplete(currentSegment.id);
                      }
                    }}
                    className="text-xs bg-red-800 hover:bg-red-700 px-2 py-1 h-auto"
                  >
                    Skip Activity
                  </Button>
                </div>
              </div>
            )}
      </div>
      
      {/* Full-Screen Interactive Pause Activity Overlay - Outside video container */}
      {showPauseActivity && currentPause && (
        <InteractivePauseActivity
          pause={currentPause}
          onComplete={() => {
            setShowPauseActivity(false);
            setCurrentPause(null);
            videoRef.current?.play();
            setIsPaused(false);
          }}
          onReplay={() => {
            // Reset current segment to replay from beginning
            if (videoRef.current && currentSegment) {
              // Always start from the segment's start time
              const replayStartTime = currentSegment.start;
              
              console.log(`🔄 Replaying segment "${currentSegment.id}" from ${replayStartTime}s`);
              
              videoRef.current.currentTime = replayStartTime;
              setCurrentTime(replayStartTime);
              
              // Reset max watched progress to segment start so user must watch again
              setMaxWatchedProgress(replayStartTime);
              
              // Close the activity overlay and resume video
              setShowPauseActivity(false);
              setCurrentPause(null);
              
              // Clear triggered pause points so they can trigger again for this segment
              pausePointsTriggered.current.clear();
              completedPauses.current.clear();
              
              // Start playing the video from the beginning of current segment
              videoRef.current.play();
              setIsPaused(false);
            }
          }}
        />
      )}
      

    </div>
  );
}

export default PremiumVideoPlayer;