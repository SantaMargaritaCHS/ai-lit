// AITimelineActivity.tsx
// Interactive timeline challenge for AI history

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, Clock, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface TimelineEvent {
  id: string;
  year: number;
  event: string;
  description: string;
}

const timelineEvents: TimelineEvent[] = [
  { id: '1', year: 1950, event: "Turing Test Proposed", description: "Alan Turing proposes a test for machine intelligence" },
  { id: '2', year: 1956, event: "AI Term Coined", description: "Dartmouth Conference coins 'Artificial Intelligence'" },
  { id: '3', year: 1966, event: "ELIZA Created", description: "First chatbot that could pass the Turing Test briefly" },
  { id: '4', year: 1970, event: "AI Winter Begins", description: "Funding and interest in AI research declines" },
  { id: '5', year: 1997, event: "Deep Blue Wins", description: "IBM's Deep Blue defeats world chess champion Garry Kasparov" },
  { id: '6', year: 2011, event: "IBM Watson Wins Jeopardy", description: "Watson defeats human champions on TV quiz show" },
  { id: '7', year: 2012, event: "Deep Learning Revolution", description: "AlexNet wins ImageNet, sparking deep learning boom" },
  { id: '8', year: 2017, event: "Transformer Model", description: "Attention Is All You Need paper introduces Transformers" },
  { id: '9', year: 2022, event: "ChatGPT Released", description: "OpenAI releases ChatGPT to the public" }
];

interface AITimelineActivityProps {
  onComplete: () => void;
}

// Helper function to shuffle array
const shuffleArray = <T,>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

export const AITimelineActivity: React.FC<AITimelineActivityProps> = ({ onComplete }) => {
  const [userOrder, setUserOrder] = useState<string[]>([]);
  const [availableEvents, setAvailableEvents] = useState(() => shuffleArray(timelineEvents));
  const [isComplete, setIsComplete] = useState(false);
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);

  const handleEventClick = (eventId: string) => {
    if (showResults) return;
    
    const event = availableEvents.find(e => e.id === eventId);
    if (!event) return;

    setUserOrder([...userOrder, eventId]);
    setAvailableEvents(availableEvents.filter(e => e.id !== eventId));

    if (userOrder.length === timelineEvents.length - 1) {
      // All events placed, calculate score
      const finalOrder = [...userOrder, eventId];
      calculateScore(finalOrder);
    }
  };

  const calculateScore = (order: string[]) => {
    const correctOrder = timelineEvents.map(e => e.id);
    let correctPlacements = 0;
    
    for (let i = 0; i < order.length; i++) {
      if (order[i] === correctOrder[i]) {
        correctPlacements++;
      }
    }
    
    setScore(correctPlacements);
    setShowResults(true);
    setIsComplete(true);
  };

  const resetActivity = () => {
    setUserOrder([]);
    setAvailableEvents(shuffleArray(timelineEvents));
    setShowResults(false);
    setIsComplete(false);
    setScore(0);
  };

  const removeFromTimeline = (eventId: string) => {
    if (showResults) return;
    
    const event = timelineEvents.find(e => e.id === eventId);
    if (!event) return;
    
    setUserOrder(prev => prev.filter(id => id !== eventId));
    setAvailableEvents(prev => [...prev, event]);
  };

  const getEventById = (id: string) => timelineEvents.find(e => e.id === id);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-4xl mx-auto"
    >
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl text-center">
            AI Timeline Challenge
          </CardTitle>
          <p className="text-center text-gray-600">
            Click the events below to arrange them in chronological order
          </p>
        </CardHeader>
        <CardContent>
          {/* Timeline Display */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-4">Your Timeline:</h3>
            <div className="space-y-2 min-h-[200px] bg-gray-50 rounded-lg p-4">
              {userOrder.length === 0 ? (
                <p className="text-gray-500 text-center py-8">
                  Click events below to build your timeline
                </p>
              ) : (
                <AnimatePresence>
                  {userOrder.map((eventId, index) => {
                    const event = getEventById(eventId);
                    if (!event) return null;
                    
                    const isCorrect = showResults && timelineEvents[index].id === eventId;
                    
                    return (
                      <motion.div
                        key={eventId}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                        className={`
                          flex items-center gap-3 p-3 rounded-lg border
                          ${showResults ? (isCorrect ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200') : 'bg-white border-gray-200'}
                        `}
                      >
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-gray-500" />
                          <span className="font-mono text-sm font-semibold">
                            #{index + 1}
                          </span>
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold">{event.event}</p>
                          <p className="text-sm text-gray-600">{event.description}</p>
                        </div>
                        {!showResults && (
                          <Button
                            onClick={() => removeFromTimeline(eventId)}
                            variant="outline"
                            size="sm"
                            className="ml-2"
                          >
                            Remove
                          </Button>
                        )}
                        {showResults && (
                          <div className="flex items-center gap-2">
                            {isCorrect ? (
                              <CheckCircle className="w-5 h-5 text-green-600" />
                            ) : (
                              <XCircle className="w-5 h-5 text-red-600" />
                            )}
                            <span className="text-sm font-mono">
                              {event.year}
                            </span>
                          </div>
                        )}
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              )}
            </div>
          </div>

          {/* Available Events */}
          {!showResults && availableEvents.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-4">
                Available Events ({availableEvents.length} remaining):
              </h3>
              <div className="grid md:grid-cols-2 gap-3">
                {availableEvents.map((event) => (
                  <Button
                    key={event.id}
                    variant="outline"
                    className="h-auto p-4 text-left justify-start"
                    onClick={() => handleEventClick(event.id)}
                  >
                    <div>
                      <p className="font-semibold">{event.event}</p>
                      <p className="text-sm text-gray-600">{event.description}</p>
                    </div>
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Results */}
          {showResults && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center"
            >
              <div className="bg-blue-50 rounded-lg p-6 mb-6">
                <h3 className="text-xl font-bold text-blue-900 mb-2">
                  Timeline Complete!
                </h3>
                <p className="text-lg text-blue-800">
                  Score: {score} out of {timelineEvents.length} correct
                </p>
                <p className="text-sm text-blue-600 mt-2">
                  {score === timelineEvents.length ? "Perfect! You know AI history well!" :
                   score >= timelineEvents.length * 0.7 ? "Great job! You understand AI's timeline." :
                   "Good effort! AI has a rich 70+ year history."}
                </p>
              </div>
              
              <div className="space-y-3">
                <Button onClick={resetActivity} variant="outline">
                  Try Again
                </Button>
                <Button onClick={onComplete} className="w-full">
                  Continue to Next Section <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </motion.div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};