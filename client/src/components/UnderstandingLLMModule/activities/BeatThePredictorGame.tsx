import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, Sparkles, AlertCircle, Loader, ArrowRight, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { generateWithGemini } from '@/services/geminiClient';

interface Props {
  onComplete: () => void;
}

interface PredictionResult {
  userPrediction: string;
  aiPredictions: Array<{word: string; probability: number}>;
  isMatch: boolean;
  matchedProbability?: number; // Probability if user's answer matched AI
  sentencePrompt: string; // Store the prompt for reflection
}

interface Sentence {
  id: number;
  prompt: string;
  context: string;
  reflectionQuestion: string;
  reflectionAnswer: string;
  fallbackPredictions: Array<{word: string; probability: number}>;
}

const sentences: Sentence[] = [
  {
    id: 1,
    prompt: "My favorite animal is",
    context: "common pets and animals",
    reflectionQuestion: "Why do you think the AI predicted these specific animals?",
    reflectionAnswer: "The AI predicted common pets like 'dog' and 'cat' because these words appear most frequently in its training data after 'My favorite animal is.' It's showing you what's STATISTICALLY COMMON, not what's objectively 'correct' or 'better.'",
    fallbackPredictions: [
      {word: "dog", probability: 35},
      {word: "cat", probability: 28},
      {word: "elephant", probability: 15},
      {word: "lion", probability: 12},
      {word: "panda", probability: 10}
    ]
  },
  {
    id: 2,
    prompt: "The best thing about summer is",
    context: "summer activities",
    reflectionQuestion: "What patterns in training data influenced these predictions?",
    reflectionAnswer: "The AI learned patterns from millions of texts about summer. Words like 'beach,' 'vacation,' and 'sunshine' appear frequently, so it predicts those. YOUR unique experiences might be completely different—and that's what makes you human!",
    fallbackPredictions: [
      {word: "the beach", probability: 32},
      {word: "vacation", probability: 26},
      {word: "sunshine", probability: 18},
      {word: "swimming", probability: 14},
      {word: "no school", probability: 10}
    ]
  },
  {
    id: 3,
    prompt: "When I grow up I want to be",
    context: "career aspirations",
    reflectionQuestion: "How does the AI's training data shape these career predictions?",
    reflectionAnswer: "The AI predicts common careers that appear often in text (doctor, teacher, engineer). But it has NO IDEA what YOU specifically want! It can't understand your unique dreams, talents, or circumstances—only you can determine that.",
    fallbackPredictions: [
      {word: "a doctor", probability: 30},
      {word: "a teacher", probability: 25},
      {word: "an engineer", probability: 20},
      {word: "a scientist", probability: 15},
      {word: "an artist", probability: 10}
    ]
  }
];

export default function BeatThePredictorGame({ onComplete }: Props) {
  const [currentSentence, setCurrentSentence] = useState(0);
  const [userInput, setUserInput] = useState('');
  const [result, setResult] = useState<PredictionResult | null>(null);
  const [allResults, setAllResults] = useState<PredictionResult[]>([]); // Track all 3 rounds
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showReflection, setShowReflection] = useState(false);
  const [showIntro, setShowIntro] = useState(true);
  const [showFinalReflection, setShowFinalReflection] = useState(false); // After all 3 rounds
  const [reflectionAnswers, setReflectionAnswers] = useState<string[]>(['', '', '']); // 3 reflection questions

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

    const sentence = sentences[currentSentence];
    let aiPredictions = sentence.fallbackPredictions; // Default to fallback

    try {
      // Try to call Gemini API to generate predictions
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

      // Try to parse response if we got one
      if (response) {
        try {
          const jsonMatch = response.match(/\{[\s\S]*\}/);
          if (jsonMatch) {
            const parsedResponse = JSON.parse(jsonMatch[0]);
            const apiPredictions = parsedResponse.predictions || [];

            // Only use API predictions if they look valid
            if (apiPredictions.length === 5 && apiPredictions[0].word !== "a") {
              aiPredictions = apiPredictions;
              console.log('✅ Using Gemini API predictions');
            } else {
              console.log('⚠️ API predictions invalid, using fallback');
            }
          }
        } catch (parseError) {
          console.log('⚠️ Failed to parse Gemini response, using fallback');
        }
      }
    } catch (err) {
      console.log('⚠️ Gemini API error, using fallback predictions');
    }

    // Check if user's prediction matches any AI predictions (case-insensitive)
    const userAnswer = userInput.toLowerCase().trim();
    const matchedPred = aiPredictions.find(
      (pred: {word: string}) => pred.word.toLowerCase() === userAnswer
    );
    const isMatch = !!matchedPred;
    const matchedProbability = matchedPred?.probability;

    // Create result object
    const newResult: PredictionResult = {
      userPrediction: userInput.trim(),
      aiPredictions,
      isMatch,
      matchedProbability,
      sentencePrompt: sentences[currentSentence].prompt
    };

    setResult(newResult);
    setIsLoading(false);
  };

  const handleNextSentence = () => {
    // Save current result before moving on
    if (result) {
      setAllResults([...allResults, result]);
    }

    if (currentSentence < sentences.length - 1) {
      // Move to next sentence
      setCurrentSentence(currentSentence + 1);
      setUserInput('');
      setResult(null);
      setShowReflection(false);
    } else {
      // After 3rd round, show final reflection
      setShowFinalReflection(true);
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
                Exploring AI Predictions
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
                  Complete 3 sentences with your own words, then see how an AI would complete them based on its training data. You'll discover how statistical patterns shape AI predictions.
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
                Start Exploring
                <ArrowRight className="ml-2 h-6 w-6" />
              </Button>
            </motion.div>
          </div>
        </motion.div>
      </div>
    );
  }

  // Final Reflection Screen (after all 3 rounds)
  if (showFinalReflection) {
    const completedRounds = [...allResults, result].filter(r => r !== null);
    const highConfidenceMatches = completedRounds.filter(r => r?.matchedProbability && r.matchedProbability >= 20).length;
    const uniqueAnswers = completedRounds.filter(r => !r?.matchedProbability || r.matchedProbability < 5).length;

    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl w-full"
        >
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 md:p-12 border-2 border-white/20">
            <h1 className="text-4xl font-bold text-white mb-6 text-center">
              Reflection Time
            </h1>

            {/* Summary Stats */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="bg-blue-900/40 border-2 border-blue-400 rounded-xl p-6 text-center">
                <p className="text-4xl font-bold text-white mb-2">{highConfidenceMatches}/3</p>
                <p className="text-white/80">Matched AI's common predictions (20%+)</p>
              </div>
              <div className="bg-purple-900/40 border-2 border-purple-400 rounded-xl p-6 text-center">
                <p className="text-4xl font-bold text-white mb-2">{uniqueAnswers}/3</p>
                <p className="text-white/80">Unique answers (less than 5%)</p>
              </div>
            </div>

            {/* Summary of answers */}
            <div className="bg-gray-900/40 border-2 border-gray-400 rounded-xl p-6 mb-8">
              <h3 className="text-xl font-bold text-white mb-4">Your Answers:</h3>
              <div className="space-y-3">
                {completedRounds.map((round, idx) => (
                  <div key={idx} className="flex justify-between items-center">
                    <p className="text-white/90">"{sentences[idx].prompt} <strong className="text-yellow-300">{round?.userPrediction}</strong>"</p>
                    <span className={`text-sm font-semibold ${
                      (round?.matchedProbability && round.matchedProbability >= 20) ? 'text-green-400' : 'text-purple-400'
                    }`}>
                      {round?.matchedProbability ? `${round.matchedProbability}%` : '~0.5%'}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Reflection Question */}
            <div className="bg-yellow-900/30 border-2 border-yellow-400 rounded-xl p-6 mb-6">
              <h3 className="text-xl font-bold text-white mb-4">
                Think About It:
              </h3>
              <p className="text-white/90 mb-4 text-lg">
                Why do you think the AI predicted certain answers more than others? What does this tell us about how AI systems learn from data, and what might be the implications when AI only knows what's "statistically common"?
              </p>
              <p className="text-white/70 text-sm">
                (Think about representation, diversity, cultural differences, and how training data shapes what AI considers "normal")
              </p>
            </div>

            <Button
              onClick={onComplete}
              className="w-full bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700 text-white py-6 text-xl rounded-xl"
            >
              Continue
              <ArrowRight className="ml-2 h-6 w-6" />
            </Button>
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
                {/* Combined Predictions View */}
                <div className="bg-purple-900/40 border-2 border-purple-400 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-white mb-2">How the AI Sees Your Answer:</h3>
                  <p className="text-white/70 text-sm mb-4">Each bar shows the probability the AI assigns based on its training data.</p>

                  <div className="space-y-3">
                    {/* User's Prediction First */}
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="flex items-center gap-4"
                    >
                      <div className="bg-blue-600 px-4 py-2 rounded-lg min-w-[140px] border-2 border-yellow-300">
                        <p className="text-sm text-yellow-200 font-semibold">Your Answer</p>
                        <p className="text-lg font-bold text-white">{result.userPrediction}</p>
                      </div>
                      <div className="flex-1">
                        <div className="bg-white/20 rounded-full h-8 overflow-hidden">
                          <motion.div
                            className="bg-gradient-to-r from-blue-400 to-cyan-400 h-full flex items-center justify-end pr-2"
                            initial={{ width: 0 }}
                            animate={{ width: `${result.matchedProbability || 0.5}%` }}
                            transition={{ duration: 0.8 }}
                          >
                            <span className="text-white text-sm font-bold">
                              {result.matchedProbability ? `${result.matchedProbability}%` : '~0.5%'}
                            </span>
                          </motion.div>
                        </div>
                      </div>
                    </motion.div>

                    {/* Divider */}
                    <div className="border-t border-white/20 my-4" />

                    {/* AI's Top Predictions */}
                    <p className="text-white/70 text-sm mb-2">AI's Most Common Predictions:</p>
                    {result.aiPredictions.map((pred, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 + 0.2 }}
                        className="flex items-center gap-4"
                      >
                        <div className="bg-purple-600 px-4 py-2 rounded-lg min-w-[140px]">
                          <p className="text-lg font-bold text-white">{pred.word}</p>
                        </div>
                        <div className="flex-1">
                          <div className="bg-white/20 rounded-full h-6 overflow-hidden">
                            <motion.div
                              className="bg-gradient-to-r from-purple-400 to-pink-400 h-full flex items-center justify-end pr-2"
                              initial={{ width: 0 }}
                              animate={{ width: `${pred.probability}%` }}
                              transition={{ delay: index * 0.1 + 0.4, duration: 0.5 }}
                            >
                              <span className="text-white text-sm font-bold">{pred.probability}%</span>
                            </motion.div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Educational Insight */}
                <div className="bg-yellow-900/30 border-2 border-yellow-400 rounded-xl p-6">
                  <div className="flex items-start gap-3">
                    <Sparkles className="w-6 h-6 text-yellow-400 flex-shrink-0 mt-1" />
                    <div>
                      <h4 className="font-bold text-white mb-2">What This Tells Us:</h4>
                      <p className="text-white/90 mb-2">
                        {result.matchedProbability ? (
                          <>Your answer "{result.userPrediction}" appears <strong className="text-yellow-300">{result.matchedProbability}%</strong> of the time in the AI's training data. This shows it's a relatively common response!</>
                        ) : (
                          <>Your answer "{result.userPrediction}" appears very rarely (less than 1%) in the AI's training data. But that doesn't make it wrong—it makes it <strong className="text-yellow-300">uniquely yours</strong>!</>
                        )}
                      </p>
                      <p className="text-white/90">
                        The AI predicts based on <strong className="text-yellow-300">statistical patterns</strong> from millions of texts, not truth or correctness. Your unique perspective is just as valid!
                      </p>
                    </div>
                  </div>
                </div>

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
