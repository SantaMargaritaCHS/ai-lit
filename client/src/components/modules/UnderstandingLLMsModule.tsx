// In /client/src/components/modules/UnderstandingLLMsModule.tsx

import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Brain } from 'lucide-react';
import PremiumVideoPlayer from '../PremiumVideoPlayer';
import { useDevMode } from '@/context/DevModeContext';
import { useActivityRegistry } from '@/context/ActivityRegistryContext';
import { UnderstandingLLMsDeveloperPanel } from './UnderstandingLLMsDeveloperPanel';
import { SecretKeyPrompt } from '@/components/SecretKeyPrompt';
import '../../styles/premium-video-llm.css';

// Import activities
import GenAIBridge from '@/components/UnderstandingLLMModule/activities/GenAIBridge';
import WordPredictionImproved from '@/components/UnderstandingLLMModule/activities/WordPredictionImproved';
import TrainingDataQuiz from '@/components/UnderstandingLLMModule/activities/TrainingDataQuiz';
import GenericTrainingDataInfo from '@/components/UnderstandingLLMModule/activities/GenericTrainingDataInfo';
import TokenDefinition from '@/components/UnderstandingLLMModule/activities/TokenDefinition';
import TokenizationDemo from '@/components/UnderstandingLLMModule/activities/TokenizationDemo';
import NLPDefinition from '@/components/UnderstandingLLMModule/activities/NLPDefinition';
import NeuralNetworkVisual from '@/components/UnderstandingLLMModule/activities/NeuralNetworkVisual';
import ReflectionQuiz from '@/components/UnderstandingLLMModule/activities/ReflectionQuiz';
import ExitTicketLLM from '@/components/UnderstandingLLMModule/activities/ExitTicketLLM';
import RealityCheck from '@/components/UnderstandingLLMModule/activities/RealityCheck';

import { Certificate } from '../Certificate';

// Single video URL for all segments - use Firebase Storage path
const VIDEO_PATH = 'Videos/3 Introduction to Large Language Models.mp4';

interface Props {
  onComplete: () => void;
  userName?: string;
}

export default function UnderstandingLLMsModule({ onComplete, userName }: Props) {
  const [currentPhase, setCurrentPhase] = useState(0);
  const [videoUrl, setVideoUrl] = useState('');
  const [completedVideos, setCompletedVideos] = useState<Set<string>>(new Set());
  const playerName = userName || 'Student';
  
  // Developer Mode
  const { isDevModeActive: isDevMode } = useDevMode();
  const showDevPanel = false;
  const showKeyPrompt = false;
  const handleSecretKeySubmit = () => true;
  const setShowKeyPrompt = () => {};
  const videoRef = useRef<HTMLVideoElement>(null);

  // RESTRUCTURED: Consolidated from 19 to 13 phases, 7 to 3 video segments
  // Based on agent feedback to improve pacing and reduce interruptions
  const phases = [
    { id: 'welcome', title: 'Welcome', duration: '1 minute' },

    // Consolidated Video 1: Core Concepts (0-100s = 1:40)
    { id: 'video-core-concepts', title: 'What Are LLMs & Pattern Recognition', duration: '1:40' },
    { id: 'reality-check-1', title: 'Reality Check: Understanding vs. Processing', duration: '2 minutes' },
    { id: 'nlp-definition', title: 'What is NLP?', duration: '2 minutes' },
    { id: 'word-prediction', title: 'Word Prediction Game', duration: '3 minutes' },
    { id: 'pattern-reflection', title: 'Pattern Recognition Reflection', duration: '3 minutes' },

    // Consolidated Video 2: Training & Tokenization (100-176s = 1:16)
    { id: 'video-training-tokenization', title: 'Training Data & Tokenization', duration: '1:16' },
    { id: 'reality-check-2', title: 'Reality Check: Learning vs. Calculating', duration: '2 minutes' },
    { id: 'training-data-info', title: 'Understanding Training Data', duration: '3 minutes' },
    { id: 'token-demo', title: 'Tokenization Demo & Quiz', duration: '4 minutes' },

    // Consolidated Video 3: Neural Networks (176-252s = 1:16)
    { id: 'video-neural-networks', title: 'Neural Networks & Summary', duration: '1:16' },
    { id: 'reality-check-3', title: 'Reality Check: Networks Calculate, Not Think', duration: '2 minutes' },
    { id: 'training-simulation', title: 'Neural Network Visualization', duration: '3 minutes' },

    { id: 'exit-ticket', title: 'Exit Ticket', duration: '3 minutes' },
    { id: 'certificate', title: 'Certificate', duration: '1 minute' }
  ];

  // ActivityRegistry hooks
  const { registerActivity, clearRegistry, goToActivity } = useActivityRegistry();

  // Register activities with ActivityRegistry on mount
  useEffect(() => {
    console.log('🔧 UnderstandingLLMsModule: Registering activities...');
    clearRegistry();

    phases.forEach((phase, index) => {
      const activity = {
        id: phase.id,
        type: phase.id === 'certificate' ? 'certificate' as const :
              phase.id.includes('video') ? 'video' as const :
              phase.id.includes('reflection') || phase.id.includes('exit') ? 'reflection' as const :
              'interactive' as const,
        title: phase.title,
        completed: index < currentPhase
      };
      console.log(`📝 Registering activity: ${activity.id} (${activity.type})`);
      registerActivity(activity);
    });
  }, []); // Only register once on mount to avoid loops

  // Listen for dev panel navigation commands
  useEffect(() => {
    const handleGoToActivity = (event: CustomEvent) => {
      const activityIndex = event.detail;
      console.log(`🎯 UnderstandingLLMsModule: Received goToActivity command for index ${activityIndex}`);

      if (activityIndex >= 0 && activityIndex < phases.length) {
        setCurrentPhase(activityIndex);
        console.log(`✅ Jumped to phase ${activityIndex}: ${phases[activityIndex].title}`);
      }
    };

    window.addEventListener('goToActivity', handleGoToActivity as EventListener);

    return () => {
      window.removeEventListener('goToActivity', handleGoToActivity as EventListener);
    };
  }, [phases]);

  // CONSOLIDATED: 3 video segments instead of 7
  // Reduces interruptions while maintaining pedagogical clarity
  const videoSegments = {
    'video-core-concepts': {
      start: 0,
      end: 100,
      title: 'What Are LLMs & Pattern Recognition',
      subtitlesUrl: '/subtitles/3-introduction-to-llms.srt',
      description: 'LLM definition, examples, NLP overview, and pattern recognition basics'
    },
    'video-training-tokenization': {
      start: 100,
      end: 176,
      title: 'Training Data & Tokenization',
      subtitlesUrl: '/subtitles/3-introduction-to-llms.srt',
      description: 'Data collection, cleaning, and tokenization process'
    },
    'video-neural-networks': {
      start: 176,
      end: 252,
      title: 'Neural Networks & Summary',
      subtitlesUrl: '/subtitles/3-introduction-to-llms.srt',
      description: 'Transformer architecture, learning process, and module summary'
    }
  };

  // Set video URL on mount - load from Firebase Storage
  useEffect(() => {
    const loadVideoUrl = async () => {
      try {
        const { getVideoUrl } = await import('@/services/videoService');
        const url = await getVideoUrl(VIDEO_PATH);
        setVideoUrl(url);
        console.log('🎬 LLM video URL loaded:', url);
      } catch (error) {
        console.error('❌ Failed to load LLM video:', error);
        setVideoUrl(''); // Clear URL on error
      }
    };
    
    loadVideoUrl();
  }, []);

  // Developer Mode: Event listeners
  useEffect(() => {
    if (!isDevMode) return;

    const handleDevSkipForward = () => {
      console.log('🔧 Developer mode: Skip forward event');
      if (currentPhase < phases.length - 1) {
        setCurrentPhase(currentPhase + 1);
        console.log(`🔧 Skipped to: ${phases[currentPhase + 1].title}`);
        
        // Dispatch activity jump event
        window.dispatchEvent(new CustomEvent('dev-jump-to-activity', {
          detail: { activity: phases[currentPhase + 1].id, index: currentPhase + 1 }
        }));
      }
    };

    const handleDevSkipBackward = () => {
      console.log('🔧 Developer mode: Skip backward event');
      if (currentPhase > 0) {
        setCurrentPhase(currentPhase - 1);
        console.log(`🔧 Skipped back to: ${phases[currentPhase - 1].title}`);
        
        // Dispatch activity jump event
        window.dispatchEvent(new CustomEvent('dev-jump-to-activity', {
          detail: { activity: phases[currentPhase - 1].id, index: currentPhase - 1 }
        }));
      }
    };

    const handleDevSkipVideo = () => {
      console.log('🔧 Developer mode: Video skip requested');
      // Try to find video element in PremiumVideoPlayer
      const videoElement = document.querySelector(`video[data-video-id="understanding-llms-${phases[currentPhase].id}"]`) as HTMLVideoElement;
      if (videoElement) {
        const duration = videoElement.duration;
        if (duration) {
          // Jump to 5 seconds before end of video
          videoElement.currentTime = duration - 5;
          console.log('🔧 Developer mode: Skipped video to 5s before end');
        }
      } else {
        console.log('🔧 Developer mode: Video element not found, advancing to next phase');
        // If no video found, just advance to next phase
        handleNextPhase();
      }
    };

    const handleActivityJump = (event: any) => {
      const { activity, index } = event.detail;
      console.log(`🔧 Developer event caught: dev-jump-to-activity`, event.detail);
      console.log(`🔧 Developer mode: Jumping to ${activity}`);
      
      if (typeof index === 'number') {
        setCurrentPhase(index);
      } else {
        // Find phase by activity id
        const phaseIndex = phases.findIndex(phase => phase.id === activity);
        if (phaseIndex !== -1) {
          setCurrentPhase(phaseIndex);
        }
      }
    };

    const handleTokenizationSegmentJump = (event: any) => {
      const { segment } = event.detail;
      console.log(`🔧 Developer mode: Jumping to tokenization segment: ${segment}`);
      
      // First switch to tokenization video URL (using main video for now)
      setVideoUrl(videoUrl);
      
      // Then seek to the specific segment
      setTimeout(() => {
        const videoElement = document.querySelector(`video[data-video-id="understanding-llms-video-tokenization"]`) as HTMLVideoElement;
        if (videoElement) {
          switch (segment) {
            case 'tokenization-intro':
              videoElement.currentTime = 0; // Start of "What is Tokenization?"
              break;
            case 'tokenization-process':
              videoElement.currentTime = 90; // Start of "How Tokenization Works"
              break;
            case 'tokenization-examples':
              videoElement.currentTime = 180; // Start of "Tokenization Examples"
              break;
          }
          videoElement.play();
          console.log(`🔧 Jumped to ${segment} at ${videoElement.currentTime}s`);
        }
      }, 500); // Wait for video to load
    };

    // Add event listeners
    window.addEventListener('dev-skip-forward', handleDevSkipForward);
    window.addEventListener('dev-skip-backward', handleDevSkipBackward);
    window.addEventListener('dev-skip-video', handleDevSkipVideo);
    window.addEventListener('dev-jump-to-activity', handleActivityJump);
    window.addEventListener('dev-jump-to-tokenization-segment', handleTokenizationSegmentJump);

    return () => {
      window.removeEventListener('dev-skip-forward', handleDevSkipForward);
      window.removeEventListener('dev-skip-backward', handleDevSkipBackward);
      window.removeEventListener('dev-skip-video', handleDevSkipVideo);
      window.removeEventListener('dev-jump-to-activity', handleActivityJump);
      window.removeEventListener('dev-jump-to-tokenization-segment', handleTokenizationSegmentJump);
    };
  }, [isDevMode, currentPhase, phases]);

  const handleNextPhase = () => {
    if (currentPhase < phases.length - 1) {
      setCurrentPhase(currentPhase + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      onComplete();
    }
  };

  const handleVideoSegmentComplete = (segmentId: string) => {
    console.log('Video segment completed:', segmentId);
    setCompletedVideos(prev => new Set(prev).add(segmentId));
    
    // Map video segments to phases
    const segmentToPhaseMap: { [key: string]: string } = {
      'intro': 'video-intro',
      'training': 'video-training',
      'tokenization': 'video-tokenization',
      'neural': 'video-neural',
      'conclusion': 'video-conclusion'
    };
    
    // Auto-advance if this is the current video phase
    const currentPhaseId = phases[currentPhase].id;
    if (segmentToPhaseMap[segmentId] === currentPhaseId) {
      handleNextPhase();
    }
  };

  const progressPercentage = ((currentPhase + 1) / phases.length) * 100;

  // Developer Mode: Activities list for navigation
  const activities = phases.map((phase, index) => ({
    id: phase.id,
    title: phase.title,
    completed: index < currentPhase
  }));

  // Developer Mode: Auto-fill functionality
  const autoFillReflections = () => {
    if (!isDevMode) return;
    
    console.log('🔧 Developer mode: Auto-filling reflections and activities');
    
    // Dispatch events to auto-complete activities
    window.dispatchEvent(new CustomEvent('dev-auto-complete-activity', {
      detail: { type: 'auto-fill', moduleId: 'understanding-llms' }
    }));
  };

  // Developer Mode: Activity navigation
  const jumpToActivity = (index: number) => {
    if (!isDevMode) return;
    
    if (index >= 0 && index < phases.length) {
      setCurrentPhase(index);
      console.log(`🔧 Developer mode: Jumped to ${phases[index].title} (${phases[index].id})`);
      
      // Dispatch custom event for activity jumping
      window.dispatchEvent(new CustomEvent('dev-jump-to-activity', {
        detail: { activity: phases[index].id, index }
      }));
      
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Developer Mode: Complete all activities
  const completeAllActivities = () => {
    if (!isDevMode) return;
    
    autoFillReflections();
    setCurrentPhase(phases.length - 1); // Jump to certificate
    console.log('🔧 Developer mode: All activities completed');
  };

  // Developer Mode: Reset module
  const resetModule = () => {
    if (!isDevMode) return;
    
    setCurrentPhase(0);
    setCompletedVideos(new Set());
    console.log('🔧 Developer mode: Module reset');
  };

  // Check if current phase is a video
  const isVideoPhase = phases[currentPhase].id.startsWith('video-');
  
  // Get current video segment for video phases
  const getCurrentVideoSegment = () => {
    const currentPhaseId = phases[currentPhase].id;
    const segment = videoSegments[currentPhaseId as keyof typeof videoSegments];
    
    if (segment) {
      return {
        start: segment.start,
        end: segment.end,
        title: segment.title,
        subtitlesUrl: segment.subtitlesUrl
      };
    }
    
    return null;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-6">
      {/* Developer Mode Components */}
      {isDevMode && showDevPanel && (
        <UnderstandingLLMsDeveloperPanel
          currentActivity={currentPhase}
          totalActivities={phases.length}
          activities={activities}
          onJumpToActivity={jumpToActivity}
          onCompleteAll={completeAllActivities}
          onReset={resetModule}
          videoRef={videoRef}
        />
      )}
      
      <SecretKeyPrompt
        isOpen={showKeyPrompt}
        onSubmit={handleSecretKeySubmit}
        onCancel={() => setShowKeyPrompt(false)}
      />
      
      {/* Developer Mode Quick Actions */}
      {isDevMode && (
        <div className="fixed top-4 right-4 bg-red-900/95 backdrop-blur-sm text-white p-3 rounded-lg shadow-xl z-40">
          <div className="flex items-center gap-2 text-sm">
            <span className="text-red-300">🔧 DEV MODE</span>
            <button
              onClick={autoFillReflections}
              className="bg-red-800 hover:bg-red-700 px-2 py-1 rounded text-xs"
            >
              Auto-Fill
            </button>
            <button
              onClick={() => jumpToActivity(phases.length - 2)} // Jump to exit ticket
              className="bg-red-800 hover:bg-red-700 px-2 py-1 rounded text-xs"
            >
              Skip to Exit
            </button>
            <button
              onClick={() => jumpToActivity(phases.length - 1)} // Jump to certificate
              className="bg-red-800 hover:bg-red-700 px-2 py-1 rounded text-xs"
            >
              Certificate
            </button>
          </div>
          <div className="text-xs text-red-300 mt-1">
            Phase: {currentPhase + 1}/{phases.length} • {phases[currentPhase].title}
          </div>
        </div>
      )}

      {/* Progress Bar */}
      <div className="max-w-6xl mx-auto mb-4">
        <div className="bg-white/10 rounded-full h-3 overflow-hidden backdrop-blur-sm">
          <motion.div
            className="bg-gradient-to-r from-blue-400 to-purple-400 h-full"
            animate={{ width: `${progressPercentage}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
        <p className="text-white/70 text-sm mt-2">
          {phases[currentPhase].title} • {currentPhase + 1} of {phases.length}
        </p>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto">
        {/* Video phases use PremiumVideoPlayer */}
        {isVideoPhase && videoUrl && (
          <PremiumVideoPlayer
            key={phases[currentPhase].id}
            videoUrl={videoUrl}
            segments={[{
              id: phases[currentPhase].id,
              title: getCurrentVideoSegment()?.title || phases[currentPhase].title,
              start: getCurrentVideoSegment()?.start || 0,
              end: getCurrentVideoSegment()?.end || -1,
              source: videoUrl,
              interactive: undefined,
              description: getCurrentVideoSegment()?.title || phases[currentPhase].title,
              mandatory: true
            }]}
            videoId={`understanding-llms-${phases[currentPhase].id}`}
            onSegmentComplete={() => handleNextPhase()}
            allowSeeking={false}
            enableSubtitles={true}
            className="premium-video-container"
          />
        )}

        {/* Activity phases - RESTRUCTURED for better flow */}
        {!isVideoPhase && (
          <>
            {/* Welcome */}
            {phases[currentPhase].id === 'welcome' && (
              <GenAIBridge onComplete={handleNextPhase} />
            )}

            {/* Reality Checks - De-anthropomorphization */}
            {phases[currentPhase].id === 'reality-check-1' && (
              <RealityCheck segment="core-concepts" onComplete={handleNextPhase} />
            )}
            {phases[currentPhase].id === 'reality-check-2' && (
              <RealityCheck segment="training" onComplete={handleNextPhase} />
            )}
            {phases[currentPhase].id === 'reality-check-3' && (
              <RealityCheck segment="neural-networks" onComplete={handleNextPhase} />
            )}

            {/* Core Concepts Activities */}
            {phases[currentPhase].id === 'nlp-definition' && (
              <NLPDefinition onComplete={handleNextPhase} />
            )}
            {phases[currentPhase].id === 'word-prediction' && (
              <WordPredictionImproved onComplete={handleNextPhase} />
            )}
            {phases[currentPhase].id === 'pattern-reflection' && (
              <ReflectionQuiz onComplete={handleNextPhase} />
            )}

            {/* Training & Tokenization Activities */}
            {phases[currentPhase].id === 'training-data-info' && (
              <GenericTrainingDataInfo onComplete={handleNextPhase} />
            )}
            {phases[currentPhase].id === 'token-demo' && (
              <>
                <TokenDefinition onComplete={() => {}} />
                <div className="my-6" />
                <TokenizationDemo onComplete={handleNextPhase} />
              </>
            )}

            {/* Neural Network Activities */}
            {phases[currentPhase].id === 'training-simulation' && (
              <NeuralNetworkVisual onComplete={handleNextPhase} />
            )}

            {/* Exit & Certificate */}
            {phases[currentPhase].id === 'exit-ticket' && (
              <ExitTicketLLM onComplete={handleNextPhase} />
            )}
            {phases[currentPhase].id === 'certificate' && (
              <Certificate
                courseName="Understanding Large Language Models"
                completionDate={new Date().toLocaleDateString()}
                userName={playerName}
                onComplete={onComplete}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
}