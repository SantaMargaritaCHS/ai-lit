// ✅ FIXED: Input field hard to see - fixed in this file
// ✅ FIXED: Poor UX - improvements implemented in this file

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, ArrowRight, Lightbulb, CheckCircle, Sparkles } from 'lucide-react';
import { darkTheme } from '../styles/darkTheme';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface Props {
  onComplete: () => void;
}

const sentences = [
  {
    prefix: "In my classroom, AI could help by",
    aiPredictions: ["providing personalized feedback", "generating practice questions", "analyzing student progress"],
    context: "Think about repetitive tasks that could be automated",
    category: "classroom-application"
  },
  {
    prefix: "The biggest challenge with AI in education is",
    aiPredictions: ["ensuring student privacy", "maintaining human connection", "preventing cheating"],
    context: "Consider both technical and ethical concerns",
    category: "student-guidance"
  },
  {
    prefix: "Teachers should understand AI because",
    aiPredictions: ["students are already using it", "it's changing how we learn", "it can enhance teaching"],
    context: "Why is AI literacy important for educators?",
    category: "key-insight"
  },
  {
    prefix: "When using AI tools, students must",
    aiPredictions: ["verify the information", "cite their sources", "think critically"],
    context: "What's the most important safety practice?",
    category: "technical-understanding"
  }
];

export default function CompleteSentence({ onComplete }: Props) {
  const [currentSentence, setCurrentSentence] = useState(0);
  const [completions, setCompletions] = useState<string[]>(['', '', '', '']);
  const [showInsight, setShowInsight] = useState(false);

  const sentence = sentences[currentSentence];

  const handleCompletionChange = (value: string) => {
    const newCompletions = [...completions];
    newCompletions[currentSentence] = value;
    setCompletions(newCompletions);
  };

  const handleNext = () => {
    if (currentSentence < sentences.length - 1) {
      setCurrentSentence(currentSentence + 1);
    } else {
      setShowInsight(true);
      setTimeout(() => {
        onComplete();
      }, 4000);
    }
  };

  const isCompleteEnough = completions[currentSentence].trim().length > 10;
  const completedSentences = completions.filter(c => c.trim().length > 10).length;

  const getInsightForCompletion = (completion: string, category: string) => {
    const insights = {
      'classroom-application': 'Great thinking! AI can enhance learning through personalized assistance while you maintain the human connection that makes teaching special.',
      'student-guidance': 'Excellent guidance! Teaching students to be critical consumers of AI output helps them develop essential 21st-century skills.',
      'key-insight': 'Perfect understanding! Recognizing that LLMs are powerful pattern-matching tools, not sentient beings, is crucial for effective use.',
      'technical-understanding': 'Spot on! LLMs predict based on patterns in their training data, which is why the quality and diversity of that data matters so much.'
    };
    return insights[category as keyof typeof insights] || 'Great completion! You\'re thinking deeply about LLMs and their role in education.';
  };

  return (
    <div className="max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        <Card className={`${darkTheme.bgPrimary} backdrop-blur-lg border-gray-600`}>
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-white">
              <MessageCircle className="w-8 h-8 text-orange-400" />
              Complete the Sentence
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center">
              <p className="text-blue-200 mb-2">
                Sentence {currentSentence + 1} of {sentences.length}
              </p>
              <div className="w-full bg-gray-700 rounded-full h-2 mb-6">
                <div
                  className="bg-orange-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${((currentSentence + 1) / sentences.length) * 100}%` }}
                />
              </div>
            </div>

            {!showInsight && (
              <div className="space-y-6">
                <div className={`${darkTheme.cardHighlight} p-6`}>
                  <p className="text-blue-200 mb-4">
                    Just like an LLM predicts the next words, complete this sentence based on your 
                    understanding of AI and education:
                  </p>
                </div>

                {sentence.context && (
                  <div className={`${darkTheme.cardHighlight} p-3 mb-4`}>
                    <p className={`text-blue-200 text-sm flex items-center gap-2`}>
                      <Sparkles className="w-4 h-4" />
                      {sentence.context}
                    </p>
                  </div>
                )}

                <div className={`${darkTheme.bgSecondary} rounded-xl p-6 shadow-lg`}>
                  <div className="flex flex-col space-y-4">
                    <p className={`text-xl ${darkTheme.textPrimary} mb-4`}>
                      "{sentence.prefix} <span className={darkTheme.textAccent}>_____</span>"
                    </p>
                    
                    <div className="relative">
                      <Input
                        value={completions[currentSentence]}
                        onChange={(e) => handleCompletionChange(e.target.value)}
                        placeholder="Type your prediction here..."
                        className={`w-full px-4 py-3 ${darkTheme.input} hover:border-blue-300 focus:ring-2 focus:ring-blue-400/50 transition-colors rounded-lg text-lg`}
                        autoFocus
                      />
                      <div className={`absolute right-3 top-1/2 transform -translate-y-1/2 ${darkTheme.textMuted} text-sm`}>
                        Press Enter ↵
                      </div>
                    </div>
                  </div>
                </div>

                {isCompleteEnough && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-green-500/20 border border-green-400/50 rounded-lg p-6"
                  >
                    <div className="flex items-start gap-3">
                      <CheckCircle className="w-6 h-6 text-green-400 mt-1 flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold text-white mb-2">Your Completed Sentence:</h4>
                        <p className="text-green-200 text-lg italic">
                          "{sentence.prefix} {completions[currentSentence]}"
                        </p>
                        <p className="text-green-300 text-sm mt-3">
                          {getInsightForCompletion(completions[currentSentence], sentence.category)}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}

                <div className="text-center">
                  <Button
                    onClick={handleNext}
                    disabled={!isCompleteEnough}
                    className="bg-orange-500 hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg font-medium"
                  >
                    {currentSentence < sentences.length - 1 ? (
                      <>
                        Next Sentence
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </>
                    ) : (
                      <>
                        Complete Activity
                        <CheckCircle className="w-4 h-4 ml-2" />
                      </>
                    )}
                  </Button>
                </div>
              </div>
            )}

            {showInsight && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <div className="bg-yellow-500/20 border border-yellow-400/50 rounded-lg p-6">
                  <div className="flex items-start gap-3">
                    <Lightbulb className="w-8 h-8 text-yellow-400 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="text-xl font-semibold text-white mb-4">
                        Pattern Recognition in Action! 
                      </h3>
                      <p className="text-yellow-200 mb-4">
                        You just completed {completedSentences} sentences by predicting what words would 
                        make sense in context - exactly like an LLM! You used your knowledge of education 
                        and AI to make informed predictions.
                      </p>
                      <p className="text-yellow-200">
                        LLMs do the same thing but with billions of examples from their training data. 
                        Understanding this process helps you use AI tools more effectively in your classroom.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-green-500/20 border border-green-400/50 rounded-lg p-6">
                  <h4 className="text-white font-semibold mb-3">Your Completed Sentences:</h4>
                  <div className="space-y-3">
                    {sentences.map((starter, index) => (
                      completions[index].trim() && (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.2 }}
                          className="bg-white/5 rounded-lg p-3"
                        >
                          <p className="text-green-200 italic">
                            "{starter.prefix} {completions[index]}"
                          </p>
                        </motion.div>
                      )
                    ))}
                  </div>
                </div>

                <div className="text-center">
                  <p className="text-blue-200">
                    Continuing to Exit Ticket in 3 seconds...
                  </p>
                </div>
              </motion.div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}