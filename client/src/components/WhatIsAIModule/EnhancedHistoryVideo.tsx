// EnhancedHistoryVideo.tsx
// Enhanced history video with segmented viewing and comprehension questions

import React, { useState } from 'react';
import { PremiumVideoPlayer } from '@/components/PremiumVideoPlayer';
import { MultipleChoiceQuestion } from './MultipleChoiceQuestion';

import { videoQuestions } from './historyVideoQuestions';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';

interface EnhancedHistoryVideoProps {
  videoUrl: string;
  onComplete: () => void;
  videoRef?: React.RefObject<HTMLVideoElement>;
}

interface VideoSegment {
  id: string;
  title: string;
  start: number;
  end: number;
  questionKey: keyof typeof videoQuestions;
}

const videoSegments: VideoSegment[] = [
  {
    id: 'segment-1',
    title: 'The Birth of AI',
    start: 0,
    end: 95, // 1:35
    questionKey: 'turingTest'
  },
  {
    id: 'segment-2', 
    title: 'AI Becomes Official & AI Winter',
    start: 95,
    end: 150, // 2:30
    questionKey: 'aiWinter'
  },
  {
    id: 'segment-3',
    title: 'The AI Renaissance',
    start: 150,
    end: 176, // 2:56
    questionKey: 'breakthroughs'
  },
  {
    id: 'segment-4',
    title: 'Modern AI Era',
    start: 176,
    end: 265, // 4:25
    questionKey: 'transformers'
  }
];

export const EnhancedHistoryVideo: React.FC<EnhancedHistoryVideoProps> = ({
  videoUrl,
  onComplete,
  videoRef
}) => {
  const [currentSegmentIndex, setCurrentSegmentIndex] = useState(0);
  const [showQuestion, setShowQuestion] = useState(false);
  const [completedSegments, setCompletedSegments] = useState<Set<string>>(new Set());

  const [scores, setScores] = useState<Record<string, boolean>>({});
  const [showReplay, setShowReplay] = useState(false);
  const [lastPauseTime, setLastPauseTime] = useState(0);

  const currentSegment = videoSegments[currentSegmentIndex];
  const progressPercentage = ((currentSegmentIndex + (showQuestion ? 0.5 : 0)) / videoSegments.length) * 100;

  const handleSegmentComplete = () => {
    setCompletedSegments(prev => new Set([...prev, currentSegment.id]));
    setLastPauseTime(currentSegment.end);
    setShowQuestion(true);
  };

  const handleQuestionAnswer = (correct: boolean) => {
    setScores(prev => ({ ...prev, [currentSegment.id]: correct }));
    setShowReplay(true);
    
    // Auto-advance after 2 seconds
    setTimeout(() => {
      setShowQuestion(false);
      setShowReplay(false);
      
      if (currentSegmentIndex < videoSegments.length - 1) {
        setCurrentSegmentIndex(prev => prev + 1);
        setLastPauseTime(0); // Reset for next segment
      } else {
        // All segments complete, call onComplete to move to next activity
        onComplete();
      }
    }, 2000);
  };

  const handleReplay = () => {
    setShowQuestion(false);
    setShowReplay(false);
    // Go back to the start of current segment for replay
    const replayStart = Math.max(0, currentSegment.start - 1);
    setLastPauseTime(replayStart);
  };



  if (showQuestion) {
    const question = videoQuestions[currentSegment.questionKey];
    return (
      <div className="max-w-4xl mx-auto">
        {/* Minimalist Progress Header */}
        <div className="text-center mb-4">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">
            History of AI ({currentSegmentIndex + 1}/4)
          </h2>
          <Progress value={progressPercentage} className="h-1 max-w-md mx-auto" />
        </div>

        {/* Replay Button - Always visible */}
        <div className="text-center mb-4">
          <Button
            onClick={handleReplay}
            variant="outline"
            className="mb-4"
          >
            ↻ Replay Previous Segment
          </Button>
        </div>

        <div>
          <MultipleChoiceQuestion
            question={question}
            onAnswer={handleQuestionAnswer}
            segmentNumber={currentSegmentIndex + 1}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Minimalist Progress Header */}
      <div className="text-center mb-4">
        <h2 className="text-lg font-semibold text-gray-900 mb-2">
          History of AI ({currentSegmentIndex + 1}/4)
        </h2>
        <Progress value={progressPercentage} className="h-1 max-w-md mx-auto" />
      </div>

      {/* Video Player */}
      <motion.div
        key={currentSegment.id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {videoUrl ? (
          <PremiumVideoPlayer
            videoUrl={videoUrl}
            segments={[{
              id: currentSegment.id,
              title: currentSegment.title,
              source: 'Videos/History of AI.mp4',
              start: lastPauseTime > 0 ? Math.max(0, lastPauseTime - 1) : Math.max(0, currentSegment.start - 1),
              end: currentSegment.end,
              mandatory: true,
              description: `Segment ${currentSegmentIndex + 1}: ${currentSegment.title}`
            }]}
            videoId={`history-segment-${currentSegmentIndex + 1}`}
            onSegmentComplete={handleSegmentComplete}
            hideSegmentNavigator={true}
            allowSeeking={true}
            interactivePauses={[]}
            videoRef={videoRef}
          />
        ) : (
          <Card>
            <CardContent className="text-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading history video...</p>
            </CardContent>
          </Card>
        )}
      </motion.div>
    </div>
  );
};