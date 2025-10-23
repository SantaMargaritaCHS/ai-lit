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

interface ComprehensionQuestion {
  question: string;
  options: Array<{text: string; isCorrect: boolean; explanation: string}>;
}

const comprehensionQuestions: ComprehensionQuestion[] = [
  {
    question: "Why were 'dog,' 'beach,' and 'doctor' the #1 predictions for each sentence?",
    options: [
      {
        text: "These words appear most frequently in training data after those specific phrases, making them statistically likely predictions",
        isCorrect: true,
        explanation: "Exactly! The AI learned that 'dog' commonly follows 'my favorite animal is,' 'beach' follows 'the best thing about summer is,' and 'doctor' follows 'when I grow up I want to be' in millions of texts. It's showing what's STATISTICALLY COMMON—not what's universally true or correct."
      },
      {
        text: "The AI determined these are the objectively best answers based on logic and reasoning",
        isCorrect: false,
        explanation: "Not quite. The AI doesn't use logic or reasoning to determine 'best' answers. It only knows what words commonly appear together in its training data. There's no such thing as an objectively 'best' favorite animal or career!"
      },
      {
        text: "Developers programmed these specific answers as the most popular choices",
        isCorrect: false,
        explanation: "Incorrect. Developers didn't manually program these answers. The AI learned these patterns automatically by analyzing billions of text examples during training. The patterns emerged from the data, not from programming."
      }
    ]
  },
  {
    question: "What are the limitations of AI predictions based on what you observed?",
    options: [
      {
        text: "AI can predict the objectively correct answer that most people would agree with",
        isCorrect: false,
        explanation: "Not true. There's no 'objectively correct' answer to personal questions like favorite animals or career aspirations. AI only knows statistical patterns—it can't determine correctness or what's best for individuals."
      },
      {
        text: "AI can only show what's statistically common in its training data—not what's true, best, or right for each individual person",
        isCorrect: true,
        explanation: "Perfect! This is the key limitation. The AI shows 'dog,' 'beach,' and 'doctor' because they're common in training data—not because they're objectively 'correct' or right for YOU. AI can't understand individual preferences, context, or truth. Your unique answer is just as valid!"
      },
      {
        text: "AI's predictions are always better than human answers because they're based on large amounts of data",
        isCorrect: false,
        explanation: "Definitely not! Just because an answer is statistically common doesn't make it 'better.' Your unique perspective, individual experiences, and personal preferences can't be captured by statistical patterns. AI complements human thinking—it doesn't replace it."
      }
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
  const [showIntro, setShowIntro] = useState(true);
  const [showFinalReflection, setShowFinalReflection] = useState(false); // After all 3 rounds
  const [currentComprehensionQ, setCurrentComprehensionQ] = useState(0); // Track which question (0 or 1)
  const [comprehensionAnswers, setComprehensionAnswers] = useState<number[]>([]); // Store both answers
  const [showComprehensionFeedback, setShowComprehensionFeedback] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null); // Current selected answer for comprehension

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

  // Normalize text for comparison (remove articles, trim, lowercase)
  const normalizeText = (text: string): string => {
    return text
      .toLowerCase()
      .trim()
      .replace(/^(a|an|the)\s+/i, '') // Remove leading articles
      .replace(/\s+/g, ' '); // Normalize spaces
  };

  const handleSubmit = async () => {
    if (!userInput.trim()) return;

    if (userInput.length > 50) {
      setError("Please enter just one or two words to complete the sentence.");
      return;
    }

    setIsLoading(true);
    setError(null);

    const sentence = sentences[currentSentence];

    // LAYER 1: Hardcoded Profanity Filter (ALWAYS runs first)
    const profanityList = [
      'bitch', 'shit', 'fuck', 'ass', 'damn', 'hell',
      'crap', 'piss', 'dick', 'cock', 'pussy', 'slut',
      'whore', 'bastard', 'asshole', 'fag', 'nigger',
      'retard', 'cunt', 'motherfucker', 'goddamn'
    ];

    const lowerInput = userInput.toLowerCase().trim();
    const containsProfanity = profanityList.some(word => lowerInput.includes(word));

    if (containsProfanity) {
      setError("Please keep your language appropriate for school. Try again with respectful words.");
      setIsLoading(false);
      return; // BLOCK PROGRESSION
    }

    // LAYER 2: Gemini API Content Validation (semantic + context check)
    try {
      const validationPrompt = `You are moderating student responses in an educational AI literacy activity for high school students.

Student was asked to complete: "${sentence.prompt}"
Student answered: "${userInput.trim()}"

Evaluate if this answer is:
1. Semantically appropriate for the prompt
2. Appropriate content for high school students (no profanity, sexual content, vulgarity, hate speech, violence, or offensive language)
3. A genuine attempt (not keyboard mashing like "asdfgh", not gibberish, not trolling)

CRITICAL: Be VERY strict about semantic correctness with these explicit examples:

For "My favorite animal is...":
✗ REJECT: "fart" (bodily function, NOT an animal)
✗ REJECT: "chicken" (this is an animal, but check if it makes sense in context)
✗ REJECT: "unicorn" (fictional creature, NOT a real animal)
✗ REJECT: "tree", "car", "happiness" (not animals)
✓ ACCEPT: "dog", "cat", "elephant", "penguin" (real animals)

For "The best thing about summer is...":
✗ REJECT: "chicken" (not a summer activity)
✗ REJECT: "doctor" (not a summer activity)
✗ REJECT: random objects or careers
✓ ACCEPT: "the beach", "swimming", "vacation", "no school", "sunshine"

For "When I grow up I want to be...":
✗ REJECT: "chicken" (animal, NOT a career)
✗ REJECT: "beach" (place, NOT a career)
✗ REJECT: "happy" (emotion, NOT a career)
✗ REJECT: made-up jobs or nonsensical answers
✓ ACCEPT: "a doctor", "teacher", "engineer", "artist" (real careers/professions)

IMPORTANT: Only accept answers that LITERALLY fit the category. Be strict!

Respond with ONLY valid JSON in this exact format:
{
  "valid": true/false,
  "reason": "brief explanation if invalid",
  "category": "inappropriate" or "nonsensical" or "off-topic" or "valid"
}`;

      const validationResponse = await generateWithGemini(validationPrompt, {
        maxOutputTokens: 150,
        temperature: 0.1
      });

      if (validationResponse) {
        try {
          const jsonMatch = validationResponse.match(/\{[\s\S]*\}/);
          if (jsonMatch) {
            const validation = JSON.parse(jsonMatch[0]);

            if (!validation.valid) {
              setIsLoading(false);

              let errorMessage = "Please provide a more appropriate answer. ";
              if (validation.category === "inappropriate") {
                errorMessage = "That response isn't appropriate for an educational setting. Please try again with a respectful answer.";
              } else if (validation.category === "nonsensical") {
                errorMessage = "Please provide a genuine answer that makes sense for this sentence.";
              } else if (validation.category === "off-topic") {
                // More specific error messages based on sentence type
                if (sentence.prompt.toLowerCase().includes('animal')) {
                  errorMessage = "That's not a real animal. Please enter an actual animal like 'dog', 'cat', 'elephant', etc.";
                } else if (sentence.prompt.toLowerCase().includes('summer')) {
                  errorMessage = "That's not a summer activity or experience. Please enter something like 'the beach', 'swimming', 'vacation', etc.";
                } else if (sentence.prompt.toLowerCase().includes('grow up')) {
                  errorMessage = "That's not a real career or profession. Please enter an actual job like 'doctor', 'teacher', 'engineer', etc.";
                } else {
                  errorMessage = `Please answer with ${sentence.context}.`;
                }
              }

              setError(errorMessage);
              return;
            }
          }
        } catch (parseError) {
          console.log('⚠️ Could not parse validation response, proceeding with basic checks');
        }
      }
    } catch (err) {
      console.log('⚠️ Gemini validation failed, proceeding with basic checks');
    }
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

    // Check if user's prediction matches any AI predictions (normalized comparison)
    const normalizedUserAnswer = normalizeText(userInput);
    const matchedPred = aiPredictions.find(
      (pred: {word: string}) => normalizeText(pred.word) === normalizedUserAnswer
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
    } else {
      // After 3rd round, show comprehension question
      setShowFinalReflection(true);
    }
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
              {/* Video Recap - Connects to Previous Learning */}
              <div className="bg-gradient-to-r from-indigo-900/60 to-purple-900/60 border-2 border-indigo-400 rounded-xl p-6">
                <div className="flex items-start gap-3">
                  <Brain className="w-8 h-8 text-indigo-300 flex-shrink-0 mt-1" />
                  <div>
                    <h2 className="text-xl font-bold text-white mb-2">What You Just Learned:</h2>
                    <p className="text-lg text-white/90 mb-2">
                      LLMs are <strong className="text-indigo-300">prediction machines</strong>—super advanced pattern matchers that predict the next word based on training data.
                    </p>
                    <p className="text-lg text-indigo-200 font-semibold">
                      Now let's experience this prediction power firsthand!
                    </p>
                  </div>
                </div>
              </div>

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

  // Comprehension Check Screen - Two questions
  if (showFinalReflection) {
    const currentQuestion = comprehensionQuestions[currentComprehensionQ];

    const handleAnswerSelect = (index: number) => {
      setSelectedAnswer(index);
    };

    const handleSubmitAnswer = () => {
      if (selectedAnswer === null) return;

      // Store the answer
      setComprehensionAnswers([...comprehensionAnswers, selectedAnswer]);
      setShowComprehensionFeedback(true);
    };

    const handleNextQuestion = () => {
      // Only allow progression if answer is correct
      if (selectedAnswer === null || !currentQuestion.options[selectedAnswer].isCorrect) {
        return;
      }

      if (currentComprehensionQ < comprehensionQuestions.length - 1) {
        // Move to next question
        setCurrentComprehensionQ(currentComprehensionQ + 1);
        setShowComprehensionFeedback(false);
        setSelectedAnswer(null);
      } else {
        // Both questions answered correctly, complete the activity
        onComplete();
      }
    };

    const handleTryAgain = () => {
      // Reset the current question to allow retry
      setShowComprehensionFeedback(false);
      setSelectedAnswer(null);
    };

    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl w-full"
        >
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 md:p-12 border-2 border-white/20">
            {/* Progress */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <h1 className="text-2xl font-bold text-white">Comprehension Check</h1>
                <span className="text-white/70 text-sm font-medium">
                  Question {currentComprehensionQ + 1} of {comprehensionQuestions.length}
                </span>
              </div>
              <div className="bg-white/20 rounded-full h-2 overflow-hidden">
                <motion.div
                  className="bg-gradient-to-r from-green-400 to-teal-400 h-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${((currentComprehensionQ + 1) / comprehensionQuestions.length) * 100}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            </div>

            {/* Question */}
            <h2 className="text-xl font-semibold text-white mb-6 text-center">
              {currentQuestion.question}
            </h2>

            {!showComprehensionFeedback ? (
              <>
                {/* Answer Options */}
                <div className="space-y-4 mb-6">
                  {currentQuestion.options.map((option, index) => (
                    <motion.button
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      onClick={() => handleAnswerSelect(index)}
                      className={`w-full text-left p-6 rounded-xl border-2 transition-all ${
                        selectedAnswer === index
                          ? 'bg-purple-600 border-purple-300 text-white'
                          : 'bg-white/10 border-white/20 text-white/90 hover:bg-white/20 hover:border-white/30'
                      }`}
                    >
                      <div className="flex items-start gap-4">
                        <div className={`w-6 h-6 rounded-full border-2 flex-shrink-0 mt-1 ${
                          selectedAnswer === index
                            ? 'bg-purple-300 border-purple-300'
                            : 'border-white/40'
                        }`}>
                          {selectedAnswer === index && (
                            <Check className="w-full h-full text-purple-900" />
                          )}
                        </div>
                        <p className="text-lg">{option.text}</p>
                      </div>
                    </motion.button>
                  ))}
                </div>

                {/* Submit Button */}
                <Button
                  onClick={handleSubmitAnswer}
                  disabled={selectedAnswer === null}
                  className={`w-full py-6 text-xl rounded-xl ${
                    selectedAnswer === null
                      ? 'bg-gray-700 text-white/50 cursor-not-allowed'
                      : 'bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700 text-white'
                  }`}
                >
                  Submit Answer
                  <ArrowRight className="ml-2 h-6 w-6" />
                </Button>
              </>
            ) : (
              <>
                {/* Feedback */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                >
                  {/* Show if correct or incorrect */}
                  <div className={`border-2 rounded-xl p-6 ${
                    currentQuestion.options[selectedAnswer!].isCorrect
                      ? 'bg-green-900/40 border-green-400'
                      : 'bg-yellow-900/40 border-yellow-400'
                  }`}>
                    <h3 className="text-xl font-bold text-white mb-3">
                      {currentQuestion.options[selectedAnswer!].isCorrect ? '✓ Correct!' : 'Not Quite!'}
                    </h3>
                    <p className="text-lg text-white/90">
                      {currentQuestion.options[selectedAnswer!].explanation}
                    </p>
                  </div>

                  {/* Key Takeaway */}
                  <div className="bg-blue-900/40 border-2 border-blue-400 rounded-xl p-6">
                    <div className="flex items-start gap-3">
                      <Brain className="w-6 h-6 text-blue-400 flex-shrink-0 mt-1" />
                      <div>
                        <h4 className="font-bold text-white mb-2">
                          {currentComprehensionQ === 0 ? '🧠 Remember This:' : '💡 Why This Matters:'}
                        </h4>
                        <p className="text-white/90">
                          {currentComprehensionQ === 0 ? (
                            <>LLMs are <strong className="text-blue-300">pattern-matching machines</strong>. They predict the next word based on what appeared most frequently in training data—they're not thinking, reasoning, or understanding meaning.</>
                          ) : (
                            <>What's <strong className="text-blue-300">statistically common</strong> isn't the same as what's true, correct, or best for you as an individual. AI predictions reflect data patterns, not universal truth. <strong className="text-yellow-300">Your unique perspective matters!</strong></>
                          )}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Show Try Again if incorrect, Next Question if correct */}
                  {currentQuestion.options[selectedAnswer!].isCorrect ? (
                    <Button
                      onClick={handleNextQuestion}
                      className="w-full bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white py-6 text-xl rounded-xl"
                    >
                      {currentComprehensionQ < comprehensionQuestions.length - 1 ? 'Next Question' : 'Complete Activity'}
                      <ArrowRight className="ml-2 h-6 w-6" />
                    </Button>
                  ) : (
                    <Button
                      onClick={handleTryAgain}
                      className="w-full bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700 text-white py-6 text-xl rounded-xl"
                    >
                      Try Again
                      <ArrowRight className="ml-2 h-6 w-6" />
                    </Button>
                  )}
                </motion.div>
              </>
            )}
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
                      <div className="flex-1 flex items-center gap-3">
                        <div className="flex-1 bg-white/20 rounded-full h-8 overflow-hidden relative">
                          <motion.div
                            className="bg-gradient-to-r from-blue-400 to-cyan-400 h-full"
                            initial={{ width: 0 }}
                            animate={{ width: `${Math.max(result.matchedProbability || 0.1, 5)}%` }}
                            transition={{ duration: 0.8 }}
                          />
                        </div>
                        <div className="bg-blue-600 px-3 py-1 rounded-lg border border-blue-300 min-w-[70px] text-center">
                          <span className="text-white text-sm font-bold">
                            {result.matchedProbability ? `${result.matchedProbability}%` : '<0.001%'}
                          </span>
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
                          <>Your answer "{result.userPrediction}" is <strong className="text-purple-300">extremely rare</strong> (less than 0.001%) in the AI's training data. This might mean it's a unique perspective, or it might not fit the category perfectly. Either way, it shows the AI only knows what's <strong className="text-yellow-300">statistically common</strong>!</>
                        )}
                      </p>
                      <p className="text-white/90">
                        The AI predicts based on <strong className="text-yellow-300">statistical patterns</strong> from millions of texts, not truth or correctness. Your unique perspective is just as valid!
                      </p>
                    </div>
                  </div>
                </div>

                {/* Next Round Button */}
                <Button
                  onClick={handleNextSentence}
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white py-6 text-xl rounded-xl"
                >
                  {currentSentence < sentences.length - 1 ? 'Next Round' : 'Continue to Questions'}
                  <ArrowRight className="ml-2 h-6 w-6" />
                </Button>
              </motion.div>
            </AnimatePresence>
          )}
        </div>
      </motion.div>
    </div>
  );
}
