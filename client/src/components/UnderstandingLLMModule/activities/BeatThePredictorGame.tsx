import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, Sparkles, Trophy, AlertCircle, Loader, ArrowRight, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { generateWithGemini } from '@/services/geminiClient';

interface Props {
  onComplete: () => void;
}

interface PredictionResult {
  userPrediction: string;
  aiPredictions: Array<{word: string; probability: number}>;
  isMatch: boolean;
}

interface Sentence {
  id: number;
  prompt: string;
  context: string;
  reflectionQuestion: string;
  reflectionAnswer: string;
}

const sentences: Sentence[] = [
  {
    id: 1,
    prompt: "My favorite animal is",
    context: "common pets and animals",
    reflectionQuestion: "Why do you think the AI predicted these specific animals?",
    reflectionAnswer: "The AI predicted common pets like 'dog' and 'cat' because these words appear most frequently in its training data after 'My favorite animal is.' It's showing you what's STATISTICALLY COMMON, not what's objectively 'correct' or 'better.'"
  },
  {
    id: 2,
    prompt: "The best thing about summer is",
    context: "summer activities",
    reflectionQuestion: "What patterns in training data influenced these predictions?",
    reflectionAnswer: "The AI learned patterns from millions of texts about summer. Words like 'beach,' 'vacation,' and 'sunshine' appear frequently, so it predicts those. YOUR unique experiences might be completely different—and that's what makes you human!"
  },
  {
    id: 3,
    prompt: "When I grow up I want to be",
    context: "career aspirations",
    reflectionQuestion: "How does the AI's training data shape these career predictions?",
    reflectionAnswer: "The AI predicts common careers that appear often in text (doctor, teacher, engineer). But it has NO IDEA what YOU specifically want! It can't understand your unique dreams, talents, or circumstances—only you can determine that."
  }
];

export default function BeatThePredictorGame({ onComplete }: Props) {
  const [currentSentence, setCurrentSentence] = useState(0);
  const [userInput, setUserInput] = useState('');
  const [result, setResult] = useState<PredictionResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showReflection, setShowReflection] = useState(false);
  const [showIntro, setShowIntro] = useState(true);

  // Developer Mode: Auto-complete
  useEffect(() => {
    const handleDevAutoComplete = (event: CustomEvent) => {
      if (event.detail?.moduleId === 'understanding-llms') {
        console.log('🔧 Developer mode: Skipping Beat the Predictor');
        onComplete();
      }
    };

    window.addEventListener('dev-auto-complete-activity', handleDevAutoComplete as EventListener);
    return () => window.removeEventListener('dev-auto-complete-activity', handleDevAutoComplete as EventListener);
  }, [onComplete]);

  const handleStartGame = () => {
    setShowIntro(false);
  };

  const handleSubmit = async () => {
    if (!userInput.trim()) return;

    // Content safety check - block inappropriate content
    const lowerInput = userInput.toLowerCase().trim();
    const inappropriateTerms = ['hate', 'violence', 'offensive', 'explicit']; // Add more as needed
    const containsInappropriate = inappropriateTerms.some(term => lowerInput.includes(term));

    if (containsInappropriate) {
      setError("Please keep your responses appropriate for an educational setting.");
      return;
    }

    if (userInput.length > 50) {
      setError("Please enter just one or two words to complete the sentence.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const sentence = sentences[currentSentence];

      // Call Gemini API to generate predictions
      const prompt = `You are helping students understand how language models predict text.

Given the sentence fragment: "${sentence.prompt}"

Generate exactly 5 word predictions that would commonly complete this sentence, along with their approximate probabilities (must sum to 100).

Context: ${sentence.context}

IMPORTANT RULES:
1. Return ONLY valid JSON in this exact format:
{
  "predictions": [
    {"word": "word1", "probability": 30},
    {"word": "word2", "probability": 25},
    {"word": "word3", "probability": 20},
    {"word": "word4", "probability": 15},
    {"word": "word5", "probability": 10}
  ]
}

2. Words should be single tokens (one or two words max)
3. Probabilities must be realistic percentages that sum to 100
4. Focus on common, appropriate completions based on typical training data patterns
5. NO explanations, NO additional text, ONLY the JSON

Return the JSON now:`;

      const response = await generateWithGemini(prompt, {
        maxOutputTokens: 300,
        temperature: 0.3
      });

      // Handle null response from API
      if (!response) {
        throw new Error('No response from AI');
      }

      // Parse the response
      let parsedResponse;
      try {
        // Try to extract JSON from response
        const jsonMatch = response.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          parsedResponse = JSON.parse(jsonMatch[0]);
        } else {
          throw new Error('No JSON found in response');
        }
      } catch (parseError) {
        console.error('Failed to parse Gemini response:', response);
        // Fallback to generic predictions if parsing fails
        parsedResponse = {
          predictions: [
            {word: "a", probability: 30},
            {word: "the", probability: 25},
            {word: "something", probability: 20},
            {word: "it", probability: 15},
            {word: "that", probability: 10}
          ]
        };
      }

      const aiPredictions = parsedResponse.predictions || [];

      // Check if user's prediction matches any AI predictions
      const isMatch = aiPredictions.some(
        (pred: {word: string}) => pred.word.toLowerCase() === userInput.toLowerCase().trim()
      );

      setResult({
        userPrediction: userInput.trim(),
        aiPredictions,
        isMatch
      });

    } catch (err) {
      console.error('Error getting AI predictions:', err);
      setError("Couldn't get AI predictions. Let's try again!");
    } finally {
      setIsLoading(false);
    }
  };

  const handleNextSentence = () => {
    if (currentSentence < sentences.length - 1) {
      setCurrentSentence(currentSentence + 1);
      setUserInput('');
      setResult(null);
      setShowReflection(false);
    } else {
      onComplete();
    }
  };

  const handleShowReflection = () => {
    setShowReflection(true);
  };

  const currentSentenceData = sentences[currentSentence];

  // Introduction Screen
  if (showIntro) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl w-full"
        >
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 md:p-12 border-2 border-white/20">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="text-center mb-6"
            >
              <Brain className="h-20 w-20 text-purple-400 mx-auto mb-4" />
              <h1 className="text-4xl font-bold text-white mb-4">
                Beat the Predictor
              </h1>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="space-y-6 text-white mb-8"
            >
              <div className="bg-blue-900/40 border-2 border-blue-400 rounded-xl p-6">
                <h2 className="text-2xl font-bold text-white mb-3">What You'll Do:</h2>
                <p className="text-lg text-white/90 mb-4">
                  You'll compete with a real AI to predict what word comes next in a sentence. This shows you firsthand how LLMs work!
                </p>
              </div>

              <div className="bg-purple-900/40 border-2 border-purple-400 rounded-xl p-6">
                <h2 className="text-2xl font-bold text-white mb-3">Why This Matters:</h2>
                <ul className="space-y-3 text-lg text-white/90">
                  <li className="flex items-start gap-3">
                    <Check className="w-6 h-6 text-green-400 flex-shrink-0 mt-1" />
                    <span>Experience how AI predicts based on <strong className="text-yellow-300">statistical patterns</strong>, not understanding</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-6 h-6 text-green-400 flex-shrink-0 mt-1" />
                    <span>See how <strong className="text-yellow-300">training data</strong> shapes AI predictions</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-6 h-6 text-green-400 flex-shrink-0 mt-1" />
                    <span>Understand that YOUR unique answers are just as valid as the AI's common predictions</span>
                  </li>
                </ul>
              </div>

              <div className="bg-yellow-900/30 border-2 border-yellow-400 rounded-xl p-6">
                <div className="flex items-start gap-3">
                  <Sparkles className="w-6 h-6 text-yellow-400 flex-shrink-0 mt-1" />
                  <p className="text-lg text-white/90">
                    <strong className="text-yellow-300">Remember:</strong> There's no "wrong" answer! Your creativity and unique perspective are what make you human. The AI just shows what's statistically common.
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              <Button
                onClick={handleStartGame}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white py-6 text-xl rounded-xl"
              >
                Start the Game
                <ArrowRight className="ml-2 h-6 w-6" />
              </Button>
            </motion.div>
          </div>
        </motion.div>
      </div>
    );
  }

  // Main Game Screen
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl w-full"
      >
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border-2 border-white/20">
          {/* Progress */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-white/70 text-sm font-medium">
                Round {currentSentence + 1} of {sentences.length}
              </span>
            </div>
            <div className="bg-white/20 rounded-full h-2 overflow-hidden">
              <motion.div
                className="bg-gradient-to-r from-purple-400 to-pink-400 h-full"
                initial={{ width: 0 }}
                animate={{ width: `${((currentSentence + 1) / sentences.length) * 100}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>

          {/* Sentence Prompt */}
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">
              Complete this sentence:
            </h2>
            <div className="bg-gradient-to-r from-purple-900/60 to-blue-900/60 border-2 border-purple-400 rounded-xl p-6">
              <p className="text-3xl font-bold text-white">
                "{currentSentenceData.prompt}{' '}
                <span className="text-yellow-300">___________</span>"
              </p>
            </div>
          </div>

          {!result ? (
            <AnimatePresence mode="wait">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-4"
              >
                <input
                  type="text"
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
                  placeholder="Type your prediction (1-2 words)..."
                  className="w-full px-6 py-4 bg-gray-800 text-white rounded-xl text-xl focus:outline-none focus:ring-2 focus:ring-purple-400"
                  disabled={isLoading}
                  maxLength={50}
                />

                {error && (
                  <div className="bg-red-900/40 border border-red-400 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                      <p className="text-white">{error}</p>
                    </div>
                  </div>
                )}

                <Button
                  onClick={handleSubmit}
                  disabled={!userInput.trim() || isLoading}
                  className={`w-full py-6 text-xl rounded-xl ${
                    !userInput.trim() || isLoading
                      ? 'bg-gray-700 text-white/50 cursor-not-allowed'
                      : 'bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white'
                  }`}
                >
                  {isLoading ? (
                    <>
                      <Loader className="w-6 h-6 animate-spin mr-2" />
                      AI is thinking...
                    </>
                  ) : (
                    <>
                      Submit Your Prediction
                      <ArrowRight className="ml-2 h-6 w-6" />
                    </>
                  )}
                </Button>
              </motion.div>
            </AnimatePresence>
          ) : (
            <AnimatePresence mode="wait">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                {/* Your Prediction */}
                <div className="bg-blue-900/40 border-2 border-blue-400 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-white mb-3">Your Prediction:</h3>
                  <div className="flex items-center gap-3">
                    <div className="bg-blue-600 px-6 py-3 rounded-lg">
                      <p className="text-2xl font-bold text-white">{result.userPrediction}</p>
                    </div>
                    {result.isMatch && (
                      <div className="flex items-center gap-2 text-green-400">
                        <Trophy className="w-6 h-6" />
                        <span className="font-semibold">Match!</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* AI Predictions */}
                <div className="bg-purple-900/40 border-2 border-purple-400 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">AI's Top Predictions:</h3>
                  <div className="space-y-3">
                    {result.aiPredictions.map((pred, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-center gap-4"
                      >
                        <div className="bg-purple-600 px-4 py-2 rounded-lg min-w-[120px]">
                          <p className="text-lg font-bold text-white">{pred.word}</p>
                        </div>
                        <div className="flex-1">
                          <div className="bg-white/20 rounded-full h-6 overflow-hidden">
                            <motion.div
                              className="bg-gradient-to-r from-purple-400 to-pink-400 h-full flex items-center justify-end pr-2"
                              initial={{ width: 0 }}
                              animate={{ width: `${pred.probability}%` }}
                              transition={{ delay: index * 0.1 + 0.3, duration: 0.5 }}
                            >
                              <span className="text-white text-sm font-bold">{pred.probability}%</span>
                            </motion.div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Key Insight */}
                {!result.isMatch && (
                  <div className="bg-yellow-900/30 border-2 border-yellow-400 rounded-xl p-6">
                    <div className="flex items-start gap-3">
                      <Sparkles className="w-6 h-6 text-yellow-400 flex-shrink-0 mt-1" />
                      <div>
                        <h4 className="font-bold text-white mb-2">Different predictions!</h4>
                        <p className="text-white/90">
                          Your guess was unique—but that doesn't mean the AI is "right" and you're "wrong."
                          The AI just predicted what words appear most often in its training data. It's all about
                          <strong className="text-yellow-300"> statistical patterns</strong>, not truth!
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Reflection Section */}
                {!showReflection ? (
                  <Button
                    onClick={handleShowReflection}
                    className="w-full bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700 text-white py-4 rounded-xl"
                  >
                    <Sparkles className="mr-2 h-5 w-5" />
                    Why Did the AI Predict These Words?
                  </Button>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-green-900/40 border-2 border-green-400 rounded-xl p-6"
                  >
                    <h4 className="text-xl font-bold text-white mb-3">{currentSentenceData.reflectionQuestion}</h4>
                    <div className="bg-green-800/40 rounded-lg p-4 mb-4">
                      <p className="text-white/90 text-lg leading-relaxed">
                        {currentSentenceData.reflectionAnswer}
                      </p>
                    </div>

                    <div className="bg-blue-900/40 border border-blue-400 rounded-lg p-4">
                      <div className="flex items-start gap-3">
                        <Brain className="w-6 h-6 text-blue-400 flex-shrink-0 mt-1" />
                        <p className="text-white/90">
                          <strong className="text-blue-300">The Key Takeaway:</strong> The AI isn't thinking or understanding—it's just calculating
                          statistical probabilities based on patterns it's seen billions of times in its training data.
                        </p>
                      </div>
                    </div>

                    <Button
                      onClick={handleNextSentence}
                      className="w-full mt-6 bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white py-4 rounded-xl text-lg"
                    >
                      {currentSentence < sentences.length - 1 ? 'Next Round' : 'Complete Activity'}
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </motion.div>
                )}
              </motion.div>
            </AnimatePresence>
          )}
        </div>
      </motion.div>
    </div>
  );
}
