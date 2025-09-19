// In /client/src/components/modules/UnderstandingLLMsModule.tsx

import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Brain } from 'lucide-react';
import { useGame } from '../../context/GameContext';
import PremiumVideoPlayer from '../PremiumVideoPlayer';
import { useDeveloperMode } from '@/hooks/useDeveloperMode';
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
  const { userProgress } = useGame();
  const playerName = userName || userProgress?.name || 'Student';
  
  // Developer Mode
  const { isDevMode, showDevPanel, showKeyPrompt, handleSecretKeySubmit, setShowKeyPrompt } = useDeveloperMode();
  const videoRef = useRef<HTMLVideoElement>(null);

  // Define phases - Updated to remove problematic "complete-sentence" activity
  const phases = [
    { id: 'welcome', title: 'Welcome', duration: '1 minute' },
    { id: 'video-1', title: 'What are LLMs?', duration: '1:08' },
    { id: 'nlp-definition', title: 'What is NLP?', duration: '3 minutes' },
    { id: 'video-2', title: 'LLMs and NLP', duration: '0:32' },
    { id: 'word-prediction', title: 'Word Prediction Game', duration: '3 minutes' },
    { id: 'pattern-reflection', title: 'Pattern Recognition Reflection', duration: '3 minutes' },
    { id: 'video-3', title: 'Training Process', duration: '0:36' },
    { id: 'training-data-info', title: 'What\'s in Training Data?', duration: '3 minutes' },
    { id: 'video-4', title: 'Tokenization Intro', duration: '0:15' },
    { id: 'token-definition', title: 'Understanding Tokens', duration: '2 minutes' },
    { id: 'token-visualization', title: 'Token Visualization Demo', duration: '3 minutes' },
    { id: 'video-5', title: 'More on Tokenization', duration: '0:25' },
    { id: 'training-quiz', title: 'Training Data Quiz', duration: '5 minutes' },
    { id: 'training-data-details', title: 'Training Data Details', duration: '3 minutes' },
    { id: 'video-6', title: 'Neural Networks', duration: '1:09' },
    { id: 'training-simulation', title: 'Training Simulation', duration: '3 minutes' },
    { id: 'video-7', title: 'Summary', duration: '0:25' },
    { id: 'exit-ticket', title: 'Exit Ticket', duration: '2 minutes' },
    { id: 'certificate', title: 'Certificate', duration: '1 minute' }
  ];

  // Video segments configuration for single video approach
  const videoSegments = {
    'video-1': { 
      start: 0, 
      end: 68, 
      title: 'What are LLMs?',
      subtitlesUrl: '/subtitles/3-introduction-to-llms.srt'
    },
    'video-2': { 
      start: 68, 
      end: 100, 
      title: 'LLMs and NLP',
      subtitlesUrl: '/subtitles/3-introduction-to-llms.srt'
    },
    'video-3': { 
      start: 100, 
      end: 136, 
      title: 'Training Process',
      subtitlesUrl: '/subtitles/3-introduction-to-llms.srt'
    },
    'video-4': { 
      start: 136, 
      end: 151, 
      title: 'Tokenization Intro',
      subtitlesUrl: '/subtitles/3-introduction-to-llms.srt'
    },
    'video-5': { 
      start: 151, 
      end: 176, 
      title: 'More on Tokenization',
      subtitlesUrl: '/subtitles/3-introduction-to-llms.srt'
    },
    'video-6': { 
      start: 176, 
      end: 245, 
      title: 'Neural Networks',
      subtitlesUrl: '/subtitles/3-introduction-to-llms.srt'
    },
    'video-7': { 
      start: 245, 
      end: 270, 
      title: 'Summary',
      subtitlesUrl: '/subtitles/3-introduction-to-llms.srt'
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

        {/* Activity phases - Following Integration Guide */}
        {!isVideoPhase && (
          <>
            {phases[currentPhase].id === 'welcome' && (
              <GenAIBridge onComplete={handleNextPhase} />
            )}
            
            {phases[currentPhase].id === 'word-prediction' && (
              <WordPredictionImproved onComplete={handleNextPhase} />
            )}
            
            {phases[currentPhase].id === 'pattern-reflection' && (
              <ReflectionQuiz onComplete={handleNextPhase} />
            )}
            
            {phases[currentPhase].id === 'nlp-definition' && (
              <NLPDefinition onComplete={handleNextPhase} />
            )}
            
            {phases[currentPhase].id === 'training-quiz' && (
              <TrainingDataQuiz onComplete={handleNextPhase} />
            )}
            
            {phases[currentPhase].id === 'training-data-info' && (
              <GenericTrainingDataInfo onComplete={handleNextPhase} />
            )}
            
            {phases[currentPhase].id === 'token-definition' && (
              <TokenDefinition onComplete={handleNextPhase} />
            )}
            
            {phases[currentPhase].id === 'training-data-details' && (
              <GenericTrainingDataInfo onComplete={handleNextPhase} />
            )}
            
            {phases[currentPhase].id === 'token-visualization' && (
              <TokenizationDemo onComplete={handleNextPhase} />
            )}
            
            {phases[currentPhase].id === 'training-simulation' && (
              <NeuralNetworkVisual onComplete={handleNextPhase} />
            )}
            
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