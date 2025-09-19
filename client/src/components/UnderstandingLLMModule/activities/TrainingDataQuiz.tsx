// Enhanced Training Data Quiz Component
// Implements requirements from training data quiz enhancement document

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, Database, TrendingUp, Clock, BookOpen, Globe, Sparkles, ArrowRight, Target } from 'lucide-react';

interface Props {
  onComplete: () => void;
}

interface ModelData {
  name: string;
  year: string;
  developer: string;
  parameters: string;
  trainingData: string;
  equivalent: string;
  capabilities: string;
  context: string;
  color: string;
  actualAmount: number;
  unit: string;
  userGuess?: number;
}

export default function TrainingDataQuiz({ onComplete }: Props) {
  const [stage, setStage] = useState<'intro' | 'timeline' | 'guess' | 'reveal' | 'future'>('intro');
  const [currentModel, setCurrentModel] = useState(0);
  const [guess, setGuess] = useState('');
  const [futureGuess, setFutureGuess] = useState(50);

  const modelData: ModelData[] = [
    {
      name: 'GPT-3',
      year: 'June 2020',
      developer: 'OpenAI',
      parameters: '175 billion',
      trainingData: '570GB of text',
      equivalent: 'About 600,000 books',
      capabilities: 'First model to show impressive text generation',
      context: 'This was OpenAI\'s breakthrough model that started the AI revolution',
      color: 'from-purple-500 to-pink-500',
      actualAmount: 600000,
      unit: 'books'
    },
    {
      name: 'ChatGPT (GPT-3.5)',
      year: 'March 2022',
      developer: 'OpenAI',
      parameters: '175 billion (fine-tuned)',
      trainingData: '570GB+ with additional training',
      equivalent: '45 billion web pages',
      capabilities: 'Powered the original ChatGPT launch',
      context: 'This version made ChatGPT conversational and user-friendly',
      color: 'from-blue-500 to-cyan-500',
      actualAmount: 45,
      unit: 'billion web pages'
    },
    {
      name: 'ChatGPT Plus (GPT-4)',
      year: 'March 2023',
      developer: 'OpenAI',
      parameters: '1.76 trillion',
      trainingData: '10+ trillion words',
      equivalent: 'More text than a human could read in 200,000 lifetimes',
      capabilities: 'Current ChatGPT Plus model with advanced reasoning',
      context: 'Can understand images and handle complex tasks',
      color: 'from-green-500 to-emerald-500',
      actualAmount: 10,
      unit: 'trillion words'
    }
  ];

  const [models, setModels] = useState<ModelData[]>(modelData);

  // Auto-advance from intro after 8 seconds
  useEffect(() => {
    if (stage === 'intro') {
      const timer = setTimeout(() => {
        setStage('timeline');
      }, 8000);
      return () => clearTimeout(timer);
    }
  }, [stage]);

  const handleGuess = () => {
    const guessNum = parseInt(guess);
    if (!isNaN(guessNum) && guessNum > 0) {
      const updatedModels = [...models];
      updatedModels[currentModel].userGuess = guessNum;
      setModels(updatedModels);
      setGuess('');
      
      if (currentModel < models.length - 1) {
        setCurrentModel(currentModel + 1);
      } else {
        setStage('reveal');
      }
    }
  };

  const getGuessQuality = (guess: number, actual: number) => {
    const ratio = guess / actual;
    if (ratio >= 0.5 && ratio <= 2) return { text: "Excellent guess!", color: "text-green-400" };
    if (ratio >= 0.1 && ratio <= 10) return { text: "Pretty close!", color: "text-yellow-400" };
    return { text: "That's quite different!", color: "text-blue-400" };
  };

  const getContextualClue = (index: number) => {
    const clues = [
      "Think about a large city library with thousands of shelves...",
      "Imagine all the websites you've ever visited combined...",
      "Consider every book ever written in human history..."
    ];
    return clues[index];
  };

  const getGuessRange = (index: number) => {
    const ranges = [
      "Range: 100,000 - 1,000,000 books",
      "Range: 1 - 100 billion pages", 
      "Range: 1 - 50 trillion words"
    ];
    return ranges[index];
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-5xl mx-auto"
    >
      {/* Stage 1: Parameter Definition */}
      {stage === 'intro' && (
        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-8">
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5 }}
              className="bg-gradient-to-r from-purple-500 to-blue-500 p-4 rounded-full w-20 h-20 mx-auto mb-6"
            >
              <Brain className="w-12 h-12 text-white" />
            </motion.div>
            
            <h1 className="text-3xl font-bold text-white mb-4">
              Understanding AI "Parameters"
            </h1>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-blue-900/30 border border-blue-400/30 rounded-lg p-6 mb-6"
          >
            <h2 className="text-xl font-semibold text-blue-200 mb-4 text-center">
              What are "Parameters"?
            </h2>
            <div className="text-center mb-4">
              <div className="flex justify-center items-center gap-4 mb-4">
                <div className="bg-purple-600/30 p-3 rounded-lg">
                  <Brain className="w-8 h-8 text-purple-300" />
                </div>
                <ArrowRight className="w-6 h-6 text-gray-400" />
                <div className="bg-blue-600/30 p-3 rounded-lg">
                  <Database className="w-8 h-8 text-blue-300" />
                </div>
              </div>
              <p className="text-white text-lg">
                Parameters are like the <strong>brain cells</strong> of an AI model
              </p>
            </div>
            
            <div className="bg-gray-800/50 rounded-lg p-4">
              <p className="text-gray-300 text-center">
                Just like humans have billions of neurons that help us think and learn,
                AI models have billions (or trillions!) of parameters that help them understand and generate text.
              </p>
              <p className="text-blue-200 text-center mt-3 font-semibold">
                💡 More parameters = More complex understanding
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
            className="text-center"
          >
            <p className="text-gray-400 text-sm">Auto-advancing in a few seconds...</p>
          </motion.div>
        </div>
      )}

      {/* Stage 2: Model Timeline */}
      {stage === 'timeline' && (
        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-8">
          <h1 className="text-3xl font-bold text-white mb-8 text-center">
            The Evolution of Large Language Models
          </h1>

          <div className="space-y-6 mb-8">
            {models.map((model, index) => (
              <motion.div
                key={model.name}
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.3 }}
                className="bg-gray-800/50 rounded-lg p-6"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className={`bg-gradient-to-r ${model.color} p-3 rounded-lg`}>
                    <Clock className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">{model.name}</h3>
                    <p className="text-gray-400">{model.year}</p>
                  </div>
                  <div className="ml-auto">
                    <div className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                      ?
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-gray-400 text-sm">Developer</p>
                    <p className="text-white font-semibold">{model.developer}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Parameters</p>
                    <p className="text-white font-semibold">{model.parameters}</p>
                  </div>
                </div>
                
                <div className="mb-4">
                  <p className="text-gray-400 text-sm mb-2">Key Capabilities</p>
                  <p className="text-gray-300 text-sm">{model.capabilities}</p>
                </div>
                
                <div className="bg-blue-900/20 border border-blue-400/20 rounded-lg p-3">
                  <p className="text-blue-200 text-sm">{model.context}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
            className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 rounded-lg p-6 mb-6"
          >
            <p className="text-white text-center text-lg">
              <strong>The Big Question:</strong> How much training data did each model need 
              to achieve these capabilities?
            </p>
          </motion.div>

          <button
            onClick={() => setStage('guess')}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3 rounded-lg font-medium"
          >
            Start the Guessing Game
          </button>
        </div>
      )}

      {/* Stage 3: Enhanced Guessing Game */}
      {stage === 'guess' && (
        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-8">
          <h1 className="text-3xl font-bold text-white mb-6 text-center">
            Training Data Guessing Game
          </h1>
          
          <div className="bg-blue-900/30 border border-blue-400/30 rounded-lg p-6 mb-8">
            <p className="text-blue-200 text-center">
              Each model required massive amounts of text data for training. 
              Can you guess how much?
            </p>
          </div>

          <div className="bg-gray-800/50 rounded-lg p-8 mb-8">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-white mb-2">
                {models[currentModel].name} ({models[currentModel].year})
              </h2>
              <p className="text-gray-300">
                Parameters: {models[currentModel].parameters}
              </p>
            </div>

            <div className="flex items-center justify-center gap-4 mb-6">
              <Database className="w-12 h-12 text-blue-400" />
              <div className="text-4xl font-bold text-white">?</div>
              <span className="text-xl text-gray-300">{models[currentModel].unit}</span>
            </div>

            <div className="bg-blue-900/30 border border-blue-400/30 rounded-lg p-4 mb-4">
              <p className="text-blue-200 text-center font-medium">
                💡 {getContextualClue(currentModel)}
              </p>
            </div>

            <div className="bg-gray-700/50 rounded-lg p-3 mb-6">
              <p className="text-gray-300 text-center text-sm">
                {getGuessRange(currentModel)}
              </p>
            </div>

            <div className="max-w-sm mx-auto">
              <input
                type="number"
                value={guess}
                onChange={(e) => setGuess(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleGuess()}
                placeholder={`Your guess (${models[currentModel].unit})`}
                className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg text-center text-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
                autoFocus
              />
              <button
                onClick={handleGuess}
                disabled={!guess || parseInt(guess) <= 0}
                className="w-full mt-4 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white py-3 rounded-lg font-medium transition-colors"
              >
                Submit Guess
              </button>
            </div>
          </div>

          <div className="flex justify-center gap-2">
            {models.map((model, index) => (
              <div
                key={model.name}
                className={`w-3 h-3 rounded-full transition-colors ${
                  model.userGuess ? 'bg-green-400' : 
                  index === currentModel ? 'bg-blue-400' : 'bg-gray-600'
                }`}
              />
            ))}
          </div>
        </div>
      )}

      {/* Stage 4: Results and Comparison */}
      {stage === 'reveal' && (
        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-8">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">
            The Incredible Scale of Training Data
          </h2>

          <div className="space-y-6 mb-8">
            {models.map((model, index) => {
              const quality = model.userGuess ? getGuessQuality(model.userGuess, model.actualAmount) : null;
              
              return (
                <motion.div
                  key={model.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.2 }}
                  className="bg-gray-800/50 rounded-lg p-6"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <h3 className="text-xl font-bold text-white">{model.name}</h3>
                      <span className="text-sm text-gray-400">({model.year})</span>
                    </div>
                    {quality && (
                      <span className={`text-sm ${quality.color} flex items-center gap-2`}>
                        <Target className="w-4 h-4" />
                        {quality.text}
                      </span>
                    )}
                  </div>

                  <div className="grid md:grid-cols-3 gap-4 mb-4">
                    <div>
                      <p className="text-gray-400 text-sm">Your guess</p>
                      <p className="text-xl font-bold text-white">
                        {model.userGuess ? `${model.userGuess} ${model.unit}` : 'N/A'}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm">Actual amount</p>
                      <p className={`text-xl font-bold bg-gradient-to-r ${model.color} bg-clip-text text-transparent`}>
                        {model.actualAmount} {model.unit}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm">That's equivalent to</p>
                      <p className="text-blue-200 text-sm">{model.equivalent}</p>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-gray-700/50 to-gray-600/50 rounded-lg p-4">
                    <p className="text-gray-300 text-sm">
                      <strong>Capabilities:</strong> {model.capabilities}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="bg-gradient-to-r from-purple-900/30 to-blue-900/30 rounded-lg p-6 mb-6"
          >
            <div className="text-center">
              <TrendingUp className="w-12 h-12 text-purple-400 mx-auto mb-4" />
              <p className="text-white text-lg mb-2">
                <strong>Exponential Growth Pattern</strong>
              </p>
              <p className="text-purple-200">
                Each new generation of LLMs requires exponentially more data to achieve 
                better performance. This massive scale is what enables their remarkable capabilities!
              </p>
            </div>
          </motion.div>

          <button
            onClick={() => setStage('future')}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white py-3 rounded-lg font-medium"
          >
            What About the Future?
          </button>
        </div>
      )}

      {/* Stage 5: Future Speculation */}
      {stage === 'future' && (
        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-8">
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5 }}
              className="bg-gradient-to-r from-green-500 to-blue-500 p-4 rounded-full w-20 h-20 mx-auto mb-6"
            >
              <Sparkles className="w-12 h-12 text-white" />
            </motion.div>
            
            <h2 className="text-3xl font-bold text-white mb-4">
              GPT-5: Coming Soon?
            </h2>
            <p className="text-gray-300">
              What do you think the next generation will require?
            </p>
          </div>

          <div className="bg-gray-800/50 rounded-lg p-8 mb-8">
            <h3 className="text-xl font-bold text-white mb-6 text-center">
              Make Your Prediction
            </h3>
            
            <div className="mb-6">
              <label className="block text-gray-300 mb-4 text-center">
                How many trillion words might GPT-5 need for training?
              </label>
              
              <div className="max-w-md mx-auto">
                <input
                  type="range"
                  min="10"
                  max="100"
                  value={futureGuess}
                  onChange={(e) => setFutureGuess(parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer slider"
                />
                <div className="flex justify-between text-sm text-gray-400 mt-2">
                  <span>10T</span>
                  <span className="text-xl font-bold text-white">{futureGuess}T words</span>
                  <span>100T</span>
                </div>
              </div>
            </div>

            <div className="bg-blue-900/30 border border-blue-400/30 rounded-lg p-4">
              <p className="text-blue-200 text-center">
                {futureGuess <= 20 && "Conservative estimate - similar to current models"}
                {futureGuess > 20 && futureGuess <= 50 && "Moderate growth - following current trends"}
                {futureGuess > 50 && "Ambitious prediction - major leap in data requirements"}
              </p>
            </div>
          </div>

          <div className="bg-gradient-to-r from-green-900/30 to-blue-900/30 rounded-lg p-6 mb-8">
            <h3 className="text-lg font-semibold text-green-200 mb-4 text-center">
              💭 Classroom Connection
            </h3>
            <p className="text-green-100 text-center">
              Understanding this massive scale helps us appreciate why LLMs are so powerful - 
              and why we still need human judgment to guide and verify their outputs!
            </p>
          </div>

          <button
            onClick={() => {
              // Auto-complete after final screen - no manual continue needed
              setTimeout(() => {
                onComplete();
              }, 2000);
            }}
            className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white py-3 rounded-lg font-medium"
          >
            Continue Learning About LLMs
          </button>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="text-center mt-4"
          >
            <p className="text-gray-400 text-sm">Auto-advancing in 2 seconds...</p>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
}