// In /client/src/components/modules/UnderstandingLLMsModule.tsx
// REVISED MODULE STRUCTURE - 2025-10-21

import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Brain } from 'lucide-react';
import PremiumVideoPlayer from '../PremiumVideoPlayer';
import { useDevMode } from '@/context/DevModeContext';
import { useActivityRegistry } from '@/context/ActivityRegistryContext';
import { UnderstandingLLMsDeveloperPanel } from './UnderstandingLLMsDeveloperPanel';
import { SecretKeyPrompt } from '@/components/SecretKeyPrompt';
import '../../styles/premium-video-llm.css';

// Import existing activities
import GenAIBridge from '@/components/UnderstandingLLMModule/activities/GenAIBridge';
import TokenizationDemo from '@/components/UnderstandingLLMModule/activities/TokenizationDemo';
import ExitTicketLLM from '@/components/UnderstandingLLMModule/activities/ExitTicketLLM';
import BeatThePredictorGame from '@/components/UnderstandingLLMModule/activities/BeatThePredictorGame';

// Import new components
import KnowledgeCheckQuiz from '@/components/UnderstandingLLMModule/activities/KnowledgeCheckQuiz';
import MeetTheLLMs from '@/components/UnderstandingLLMModule/activities/MeetTheLLMs';
import GuessDataSize from '@/components/UnderstandingLLMModule/activities/GuessDataSize';
import WhyPredictionIsntEnough from '@/components/UnderstandingLLMModule/activities/WhyPredictionIsntEnough';
import WeavingItTogether from '@/components/UnderstandingLLMModule/activities/WeavingItTogether';
import TrainingLoopStory from '@/components/UnderstandingLLMModule/activities/TrainingLoopStory';

import { Certificate } from '../Certificate';

// Video sources
const VIDEO_PATHS = {
  unlockingBlackBox: 'https://firebasestorage.googleapis.com/v0/b/ai-literacy-platform-175d4.firebasestorage.app/o/Videos%2FStudent%20Videos%2FIntro%20to%20LLMS%2FUnlocking_the_AI_Black_Box.mp4?alt=media',
  understandingModels: 'https://firebasestorage.googleapis.com/v0/b/ai-literacy-platform-175d4.firebasestorage.app/o/Videos%2FStudent%20Videos%2FIntro%20to%20LLMS%2F3Understanding%20LLM%20Models.mp4?alt=media',
  howChatbotsLLMs: 'https://firebasestorage.googleapis.com/v0/b/ai-literacy-platform-175d4.firebasestorage.app/o/Videos%2FStudent%20Videos%2FIntro%20to%20LLMS%2FHow%20Chatbots%20and%20LLMS.mp4?alt=media'
};

interface Props {
  onComplete: () => void;
  userName?: string;
}

export default function UnderstandingLLMsModule({ onComplete, userName }: Props) {
  const [currentPhase, setCurrentPhase] = useState(0);
  const [completedVideos, setCompletedVideos] = useState<Set<string>>(new Set());
  const playerName = userName || 'Student';

  // Developer Mode
  const { isDevModeActive: isDevMode } = useDevMode();
  const showDevPanel = false;
  const showKeyPrompt = false;
  const handleSecretKeySubmit = (_key: string) => true;
  const setShowKeyPrompt = (_value: boolean) => {};
  const videoRef = useRef<HTMLVideoElement>(null);

  // REVISED 18-PHASE STRUCTURE
  const phases = [
    // Phase 1: Introduction - What is an LLM?
    { id: 'welcome', title: 'Welcome', duration: '1 minute' },
    { id: 'video-what-is-llm', title: 'What is an LLM?', duration: '1:23' },
    { id: 'knowledge-check-quiz', title: 'Knowledge Check', duration: '3 minutes' },
    { id: 'meet-the-llms', title: 'Meet the LLMs', duration: '2 minutes' },

    // Phase 2: Core Function - Prediction
    { id: 'video-prediction-core', title: 'Prediction is Everything', duration: '1:26' },
    { id: 'beat-predictor-game', title: 'Beat the Predictor', duration: '5 minutes' },

    // Phase 4: How Do They Work? Data & Neural Networks
    { id: 'video-data-scale', title: 'The Scale of Data', duration: '14 seconds' },
    { id: 'guess-data-size', title: 'Guess the Data Size', duration: '3 minutes' },
    { id: 'video-using-data', title: 'How Data Becomes Predictions', duration: '2:15' },
    { id: 'why-prediction-isnt-enough', title: 'Why Simple Predictions Aren\'t Enough', duration: '1 minute' },
    { id: 'video-neural-networks', title: 'Understanding Context', duration: '1:49' },

    // Phase 5: Pattern-Finding Web (Tokens & Training)
    { id: 'video-tokens-training', title: 'Tokens, Training, and Tuning', duration: '1:03' },
    { id: 'weaving-it-together', title: 'Weaving It All Together', duration: '2 minutes' },
    { id: 'tokenization-demo', title: 'The Tokenizer', duration: '4 minutes' },
    { id: 'training-loop-story', title: 'The Training Loop', duration: '5 minutes' },

    // Phase 6: Big Takeaway & Conclusion
    { id: 'video-big-takeaway', title: 'The Big Takeaway', duration: '1:10' },
    { id: 'exit-ticket', title: 'Exit Ticket', duration: '5 minutes' },
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
        name: phase.title,
        type: phase.id === 'certificate' ? 'certificate' as const :
              phase.id.includes('video') ? 'video' as const :
              phase.id.includes('exit-ticket') ? 'reflection' as const :
              'interactive' as const,
        title: phase.title,
        completed: index < currentPhase
      };
      console.log(`📝 Registering activity: ${activity.id} (${activity.type})`);
      registerActivity(activity);
    });
  }, []); // Only register once on mount

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

  // Video segments mapped to correct sources and timestamps
  const videoSegments = {
    'video-what-is-llm': {
      source: VIDEO_PATHS.unlockingBlackBox,
      start: 0,
      end: 83,
      title: 'What is an LLM?',
      description: 'Introduction to Large Language Models - what they are and what they do'
    },
    'video-prediction-core': {
      source: VIDEO_PATHS.unlockingBlackBox,
      start: 84,
      end: 169,
      title: 'Prediction is Everything',
      description: 'The core function: predicting the next word. Super advanced pattern matcher, auto-complete on cosmic scale.'
    },
    'video-data-scale': {
      source: VIDEO_PATHS.unlockingBlackBox,
      start: 169,
      end: 183.5,
      title: 'The Scale of Data',
      description: 'Introduction to the colossal amount of training data needed for LLMs'
    },
    'video-using-data': {
      source: VIDEO_PATHS.howChatbotsLLMs,
      start: 112,
      end: 191,
      title: 'How Data Becomes Predictions',
      description: 'Shakespeare letter-by-letter analogy showing how simple predictions work and their limitations'
    },
    'video-neural-networks': {
      source: VIDEO_PATHS.howChatbotsLLMs,
      start: 191,
      end: 299,
      title: 'Understanding Context with Neural Networks',
      description: 'Neural networks provide context: predict → compare → adjust loop, learning from mistakes'
    },
    'video-tokens-training': {
      source: VIDEO_PATHS.howChatbotsLLMs,
      start: 299,
      end: 354,
      title: 'Tokens, Training, and Tuning',
      description: 'Three key additions: internet data (not Shakespeare), tokens instead of letters, human tuning'
    },
    'video-big-takeaway': {
      source: VIDEO_PATHS.unlockingBlackBox,
      start: 308,
      end: 378,
      title: 'The Big Takeaway',
      description: 'Key takeaways: predictors not thinkers, data reliability, statistical likelihood, you check the work'
    }
  };

  // Developer Mode: Event listeners
  useEffect(() => {
    if (!isDevMode) return;

    const handleDevSkipForward = () => {
      console.log('🔧 Developer mode: Skip forward event');
      if (currentPhase < phases.length - 1) {
        setCurrentPhase(currentPhase + 1);
        console.log(`🔧 Skipped to: ${phases[currentPhase + 1].title}`);

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

        window.dispatchEvent(new CustomEvent('dev-jump-to-activity', {
          detail: { activity: phases[currentPhase - 1].id, index: currentPhase - 1 }
        }));
      }
    };

    const handleDevSkipVideo = () => {
      console.log('🔧 Developer mode: Video skip requested');
      const videoElement = document.querySelector(`video[data-video-id="understanding-llms-${phases[currentPhase].id}"]`) as HTMLVideoElement;
      if (videoElement) {
        const duration = videoElement.duration;
        if (duration) {
          videoElement.currentTime = duration - 5;
          console.log('🔧 Developer mode: Skipped video to 5s before end');
        }
      } else {
        console.log('🔧 Developer mode: Video element not found, advancing to next phase');
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
        const phaseIndex = phases.findIndex(phase => phase.id === activity);
        if (phaseIndex !== -1) {
          setCurrentPhase(phaseIndex);
        }
      }
    };

    window.addEventListener('dev-skip-forward', handleDevSkipForward);
    window.addEventListener('dev-skip-backward', handleDevSkipBackward);
    window.addEventListener('dev-skip-video', handleDevSkipVideo);
    window.addEventListener('dev-jump-to-activity', handleActivityJump);

    return () => {
      window.removeEventListener('dev-skip-forward', handleDevSkipForward);
      window.removeEventListener('dev-skip-backward', handleDevSkipBackward);
      window.removeEventListener('dev-skip-video', handleDevSkipVideo);
      window.removeEventListener('dev-jump-to-activity', handleActivityJump);
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
    handleNextPhase();
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
    setCurrentPhase(phases.length - 1);
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
        source: segment.source,
        start: segment.start,
        end: segment.end,
        title: segment.title,
        description: segment.description
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
              className="bg-red-800 hover:bg-red-700 px-2 py-1 rounded text-xs text-white"
            >
              Auto-Fill
            </button>
            <button
              onClick={() => jumpToActivity(phases.length - 2)}
              className="bg-red-800 hover:bg-red-700 px-2 py-1 rounded text-xs text-white"
            >
              Skip to Exit
            </button>
            <button
              onClick={() => jumpToActivity(phases.length - 1)}
              className="bg-red-800 hover:bg-red-700 px-2 py-1 rounded text-xs text-white"
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
        {isVideoPhase && getCurrentVideoSegment() && (
          <PremiumVideoPlayer
            key={phases[currentPhase].id}
            videoUrl={getCurrentVideoSegment()?.source || ''}
            segments={[{
              id: phases[currentPhase].id,
              title: getCurrentVideoSegment()?.title || phases[currentPhase].title,
              start: getCurrentVideoSegment()?.start || 0,
              end: getCurrentVideoSegment()?.end || -1,
              source: getCurrentVideoSegment()?.source || '',
              interactive: undefined,
              description: getCurrentVideoSegment()?.description || phases[currentPhase].title,
              mandatory: true
            }]}
            videoId={`understanding-llms-${phases[currentPhase].id}`}
            onSegmentComplete={() => handleNextPhase()}
            allowSeeking={false}
            enableSubtitles={true}
            className="premium-video-container"
          />
        )}

        {/* Activity phases */}
        {!isVideoPhase && (
          <>
            {/* Phase 1: Introduction */}
            {phases[currentPhase].id === 'welcome' && (
              <GenAIBridge onComplete={handleNextPhase} />
            )}
            {phases[currentPhase].id === 'knowledge-check-quiz' && (
              <KnowledgeCheckQuiz onComplete={handleNextPhase} />
            )}
            {phases[currentPhase].id === 'meet-the-llms' && (
              <MeetTheLLMs onComplete={handleNextPhase} />
            )}

            {/* Phase 2: Core Function */}
            {phases[currentPhase].id === 'beat-predictor-game' && (
              <BeatThePredictorGame onComplete={handleNextPhase} />
            )}

            {/* Phase 4: Data & Neural Networks */}
            {phases[currentPhase].id === 'guess-data-size' && (
              <GuessDataSize onComplete={handleNextPhase} />
            )}
            {phases[currentPhase].id === 'why-prediction-isnt-enough' && (
              <WhyPredictionIsntEnough onComplete={handleNextPhase} />
            )}

            {/* Phase 5: Pattern-Finding Web */}
            {phases[currentPhase].id === 'weaving-it-together' && (
              <WeavingItTogether onComplete={handleNextPhase} />
            )}
            {phases[currentPhase].id === 'tokenization-demo' && (
              <TokenizationDemo onComplete={handleNextPhase} />
            )}
            {phases[currentPhase].id === 'training-loop-story' && (
              <TrainingLoopStory onComplete={handleNextPhase} />
            )}

            {/* Phase 6: Big Takeaway & Exit */}
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
