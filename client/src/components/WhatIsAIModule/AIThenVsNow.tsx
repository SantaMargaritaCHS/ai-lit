import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { motion } from 'framer-motion';
import { ArrowRight, Calendar, Cpu, Eye, MessageSquare } from 'lucide-react';
import { getAILiteracyFeedback } from '@/services/aiLiteracyBot';

interface AIThenVsNowProps {
  onComplete: () => void;
}

const comparisons = [
  {
    id: 1,
    icon: MessageSquare,
    then: {
      year: "1950s",
      title: "Turing Test",
      description: "Simple text conversations to test if a machine could fool humans into thinking it was human",
      capability: "Basic question-and-answer through typed text"
    },
    now: {
      year: "2024",
      title: "ChatGPT & Advanced AI",
      description: "Sophisticated conversations, creative writing, coding, analysis, and complex problem-solving",
      capability: "Multimodal conversations with text, images, and voice"
    }
  },
  {
    id: 2,
    icon: Cpu,
    then: {
      year: "1997",
      title: "Deep Blue Chess",
      description: "Specialized computer that could only play chess, beating world champion Garry Kasparov",
      capability: "Single-task mastery: chess only"
    },
    now: {
      year: "2024",
      title: "Multimodal AI Systems",
      description: "AI that can play games, write code, create art, analyze data, and solve diverse problems",
      capability: "Multi-task intelligence across countless domains"
    }
  },
  {
    id: 3,
    icon: Eye,
    then: {
      year: "2012",
      title: "Cat Recognition",
      description: "AI breakthrough: Google's system learned to recognize cats in YouTube videos",
      capability: "Identifying simple objects in still images"
    },
    now: {
      year: "2024",
      title: "Real-time Video Analysis",
      description: "AI can analyze live video, identify thousands of objects, track movements, and understand scenes",
      capability: "Real-time analysis of complex video with context understanding"
    }
  }
];

export const AIThenVsNow: React.FC<AIThenVsNowProps> = ({ onComplete }) => {
  const [currentComparison, setCurrentComparison] = useState(0);
  const [showReflection, setShowReflection] = useState(false);
  const [reflection, setReflection] = useState('');
  const [aiFeedback, setAiFeedback] = useState('');
  const [isLoadingAI, setIsLoadingAI] = useState(false);
  const [viewMode, setViewMode] = useState<'then' | 'now'>('then');

  const handleNext = () => {
    if (viewMode === 'then') {
      setViewMode('now');
    } else if (currentComparison < comparisons.length - 1) {
      setCurrentComparison(prev => prev + 1);
      setViewMode('then');
    } else {
      setShowReflection(true);
    }
  };

  const handleGetFeedback = async () => {
    if (!reflection.trim()) return;
    
    setIsLoadingAI(true);
    try {
      const feedback = await getAILiteracyFeedback(reflection);
      // Handle both string and object responses
      if (typeof feedback === 'string') {
        setAiFeedback(feedback);
      } else if (feedback && feedback.feedback) {
        setAiFeedback(feedback.feedback);
      } else {
        setAiFeedback("Great reflection! AI's rapid evolution is indeed remarkable and shows how far technology has come.");
      }
    } catch (error) {
      console.error('Error getting AI feedback:', error);
      setAiFeedback("Great reflection! AI's rapid evolution is indeed remarkable and shows how far technology has come.");
    } finally {
      setIsLoadingAI(false);
    }
  };

  const handleComplete = () => {
    onComplete();
  };

  if (showReflection) {
    return (
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                🤔 Reflection Time
              </h2>
              <p className="text-lg text-gray-600">
                What surprises you most about AI's evolution from then to now?
              </p>
            </div>

            <div className="space-y-4">
              <Textarea
                placeholder="Share your thoughts about how AI has evolved. What stood out to you the most?"
                value={reflection}
                onChange={(e) => setReflection(e.target.value)}
                rows={4}
                className="bg-white border-gray-300"
              />

              {aiFeedback && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h4 className="font-semibold text-green-800 mb-2">AI Tutor Feedback:</h4>
                  <p className="text-green-700 text-sm">{aiFeedback}</p>
                </div>
              )}

              <div className="text-center">
                {!aiFeedback ? (
                  <Button 
                    onClick={handleGetFeedback}
                    disabled={reflection.length < 20 || isLoadingAI}
                    className="px-8 bg-blue-600 hover:bg-blue-700 text-white font-semibold"
                  >
                    {isLoadingAI ? 'Getting AI Feedback...' : 'Get AI Feedback'}
                  </Button>
                ) : (
                  <Button 
                    onClick={handleComplete}
                    className="px-8 bg-green-600 hover:bg-green-700 text-white font-semibold"
                  >
                    Complete History Section
                  </Button>
                )}
                {reflection.length < 20 && !aiFeedback && (
                  <p className="text-sm text-gray-500 mt-2">
                    Please share at least a few thoughts (20+ characters)
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const current = comparisons[currentComparison];
  const Icon = current.icon;

  return (
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          AI Then vs Now
        </h2>
        <p className="text-lg text-gray-600">
          See how far artificial intelligence has come!
        </p>
        <div className="flex justify-center items-center gap-2 mt-4">
          {comparisons.map((_, index) => (
            <div
              key={index}
              className={`w-3 h-3 rounded-full ${
                index <= currentComparison ? 'bg-blue-500' : 'bg-gray-300'
              }`}
            />
          ))}
        </div>
      </div>

      <motion.div
        key={currentComparison}
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="grid md:grid-cols-3 gap-6 items-center">
          {/* Then */}
          <Card className="h-full">
            <CardContent className="pt-6">
              <div className="text-center mb-4">
                <Calendar className="h-8 w-8 text-amber-600 mx-auto mb-2" />
                <h3 className="text-xl font-bold text-amber-900">
                  {current.then.year}
                </h3>
                <h4 className="text-lg font-semibold text-gray-900 mt-2">
                  {current.then.title}
                </h4>
              </div>
              <p className="text-gray-700 mb-4">
                {current.then.description}
              </p>
              <div className="bg-amber-50 p-3 rounded-lg">
                <p className="text-sm font-medium text-amber-900">
                  Capability: {current.then.capability}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Arrow */}
          <div className="flex justify-center">
            <motion.div
              animate={{ x: [0, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="bg-blue-100 p-4 rounded-full"
            >
              <ArrowRight className="h-8 w-8 text-blue-600" />
            </motion.div>
          </div>

          {/* Now */}
          <Card className="h-full">
            <CardContent className="pt-6">
              <div className="text-center mb-4">
                <Icon className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <h3 className="text-xl font-bold text-blue-900">
                  {current.now.year}
                </h3>
                <h4 className="text-lg font-semibold text-gray-900 mt-2">
                  {current.now.title}
                </h4>
              </div>
              <p className="text-gray-700 mb-4">
                {current.now.description}
              </p>
              <div className="bg-blue-50 p-3 rounded-lg">
                <p className="text-sm font-medium text-blue-900">
                  Capability: {current.now.capability}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="text-center mt-8">
          <Button onClick={handleNext} size="lg">
            {currentComparison < comparisons.length - 1 ? 'Next Comparison' : 'Reflect on Evolution'}
          </Button>
        </div>
      </motion.div>
    </div>
  );
};