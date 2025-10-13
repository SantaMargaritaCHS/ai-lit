import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, SkipForward, Brain, Cpu, MessageSquare, Sparkles, Zap, Calendar, ChevronRight, Palette } from 'lucide-react';

interface TimelineEvent {
  id: string;
  year: number | string;
  title: string;
  narration: string;
  icon: React.ElementType;
  category: 'traditional' | 'breakthrough' | 'generative';
  duration: number;
  isGenerativeStart?: boolean;
  image?: string;
}

const timelineEvents: TimelineEvent[] = [
  {
    id: 'intro',
    year: 0,
    title: 'A Quick Journey Through Time',
    narration: "You've learned about AI's early history. Let's quickly see how we got from those early days to today's creative AI!",
    icon: Calendar,
    category: 'traditional',
    duration: 5  // was 3
  },
  {
    id: 'traditional-era',
    year: '1950-2017' as any,
    title: 'Analytical AI: The Analyzing Era',
    narration: "For nearly 70 years, AI got better at one thing: analyzing what already exists. It could recognize faces, filter spam, and beat humans at chess.",
    icon: Brain,
    category: 'traditional',
    duration: 7  // was 4
  },
  {
    id: 'transformers',
    year: 2017,
    title: 'The Turning Point',
    narration: "Scientists at Google invented a new way for AI to understand language. This breakthrough would change everything...",
    icon: Zap,
    category: 'breakthrough',
    duration: 6  // was 4
  },
  {
    id: 'gpt-birth',
    year: 2018,
    title: '✨ AI Learns to Create!',
    narration: "This is it! For the first time in history, AI doesn't just analyze - it CREATES! It can write original text that never existed before. The generative AI era begins!",
    icon: Sparkles,
    category: 'generative',
    duration: 8,  // was 6
    image: '🚀',
    isGenerativeStart: true
  },
  {
    id: 'creative-explosion',
    year: '2019-2021' as any,
    title: 'The Creative Explosion',
    narration: "AI's creative abilities exploded! It learned to write stories, create artwork, compose music, and generate code. But it was still mostly used by tech companies and researchers.",
    icon: Palette,
    category: 'generative',
    duration: 8,  // was 5
    image: '🎨'
  },
  {
    id: 'chatgpt',
    year: 2022,
    title: 'ChatGPT: AI Becomes Accessible',
    narration: "Here's the game-changer! ChatGPT made generative AI easy for EVERYONE to use. No coding needed - just type and chat. Within days, millions were creating with AI!",
    icon: MessageSquare,
    category: 'generative',
    duration: 9,  // was 6
    image: '💬'
  },
  {
    id: 'today',
    year: '2023-2024' as any,
    title: 'Today: The Creative AI Era',
    narration: "We're here! AI can now create text, images, music, and code. It understands pictures, helps with homework, and sparks new ideas. You're living in the most creative time in AI history!",
    icon: Sparkles,
    category: 'generative',
    duration: 8,  // was 6
    image: '🌟'
  }
];

interface ImmersiveAITimelineProps {
  onComplete: () => void;
}

export const ImmersiveAITimeline: React.FC<ImmersiveAITimelineProps> = ({ onComplete }) => {
  const [currentEventIndex, setCurrentEventIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);
  const [inGenerativeEra, setInGenerativeEra] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const currentEvent = timelineEvents[currentEventIndex];
  const Icon = currentEvent.icon;

  useEffect(() => {
    if (isPlaying && currentEventIndex < timelineEvents.length) {
      const duration = currentEvent.duration * 1000;
      const updateInterval = 50;
      let elapsed = 0;

      intervalRef.current = setInterval(() => {
        elapsed += updateInterval;
        const newProgress = (elapsed / duration) * 100;
        
        if (newProgress >= 100) {
          handleNextEvent();
        } else {
          setProgress(newProgress);
        }
      }, updateInterval);

      return () => {
        if (intervalRef.current) clearInterval(intervalRef.current);
      };
    }
  }, [isPlaying, currentEventIndex]);

  const handleNextEvent = () => {
    if (currentEventIndex < timelineEvents.length - 1) {
      const nextEvent = timelineEvents[currentEventIndex + 1];
      if (nextEvent.category === 'generative' && !inGenerativeEra) {
        setInGenerativeEra(true);
      }
      
      setCurrentEventIndex(prev => prev + 1);
      setProgress(0);
    } else {
      setIsPlaying(false);
      onComplete();
    }
  };

  const handleStart = () => {
    setHasStarted(true);
    setIsPlaying(true);
  };

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleSkip = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setProgress(0);
    handleNextEvent();
  };

  if (!hasStarted) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <Card className="bg-gradient-to-br from-blue-900 to-purple-900 text-white">
          <CardContent className="p-12 text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="mb-8"
            >
              <Calendar className="h-20 w-20 mx-auto text-blue-300" />
            </motion.div>
            
            <h1 className="text-4xl font-bold mb-4">The Journey to Generative AI</h1>
            <p className="text-xl text-blue-200 mb-8 max-w-2xl mx-auto">
              Take an immersive journey through 70+ years of AI history. 
              Watch as AI evolves from simple tests to creative machines!
            </p>
            
            <Button
              onClick={handleStart}
              size="lg"
              className="bg-white text-purple-900 hover:bg-blue-100"
            >
              <Play className="mr-2 h-5 w-5" />
              Start Journey
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Generative Era Announcement - Fixed positioning */}
      <AnimatePresence>
        {inGenerativeEra && currentEventIndex === timelineEvents.findIndex(e => e.id === 'gpt-birth') && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="mb-6"
          >
            <Card className="bg-gradient-to-r from-purple-600 to-pink-600 text-white border-0">
              <CardContent className="p-6 text-center">
                <h2 className="text-3xl font-bold mb-2 flex items-center justify-center">
                  <Sparkles className="mr-3 h-8 w-8" />
                  ENTERING THE GENERATIVE AI ERA!
                </h2>
                <p className="text-lg">AI can now CREATE, not just analyze!</p>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-600">Journey Progress</span>
          <span className="text-sm text-gray-600">
            {currentEventIndex + 1} / {timelineEvents.length}
          </span>
        </div>
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <motion.div
            className={`h-full ${inGenerativeEra ? 'bg-gradient-to-r from-purple-500 to-pink-500' : 'bg-blue-500'}`}
            animate={{ width: `${((currentEventIndex + 1) / timelineEvents.length) * 100}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>

      <Card className={`mb-6 transition-all duration-500 ${
        inGenerativeEra 
          ? 'bg-gradient-to-br from-purple-50 to-pink-50 border-purple-300' 
          : 'bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-300'
      }`}>
        <CardContent className="p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentEvent.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              <div className="text-center mb-6">
                {currentEvent.year !== 0 && (
                  <div className={`text-5xl font-bold mb-2 ${
                    inGenerativeEra ? 'text-purple-600' : 'text-blue-600'
                  }`}>
                    {currentEvent.year}
                  </div>
                )}
                <h2 className="text-3xl font-bold text-gray-900 flex items-center justify-center">
                  <Icon className={`mr-3 h-8 w-8 ${
                    inGenerativeEra ? 'text-purple-600' : 'text-blue-600'
                  }`} />
                  {currentEvent.title}
                </h2>
              </div>

              <div className={`text-lg leading-relaxed text-center max-w-3xl mx-auto mb-6 ${
                inGenerativeEra ? 'text-purple-800' : 'text-gray-700'
              }`}>
                {currentEvent.narration}
              </div>

              {/* Add image display */}
              {currentEvent.image && (
                <div className="text-6xl text-center mt-4">
                  {currentEvent.image}
                </div>
              )}

              <div className="max-w-md mx-auto">
                <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                  <motion.div
                    className={`h-full ${
                      inGenerativeEra 
                        ? 'bg-gradient-to-r from-purple-500 to-pink-500' 
                        : 'bg-blue-500'
                    }`}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.05, ease: "linear" }}
                  />
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </CardContent>
      </Card>

      <div className="flex justify-center space-x-4">
        <Button
          onClick={handlePlayPause}
          variant="outline"
          size="lg"
          className={inGenerativeEra ? 'border-purple-500 text-purple-600' : ''}
        >
          {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
          <span className="ml-2">{isPlaying ? 'Pause' : 'Play'}</span>
        </Button>
        
        <Button
          onClick={handleSkip}
          variant="outline"
          size="lg"
          disabled={currentEventIndex >= timelineEvents.length - 1}
          className={inGenerativeEra ? 'border-purple-500 text-purple-600' : ''}
        >
          <SkipForward className="h-5 w-5" />
          <span className="ml-2">Next</span>
        </Button>
      </div>
    </div>
  );
};