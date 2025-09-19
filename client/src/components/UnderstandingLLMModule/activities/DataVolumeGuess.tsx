// Create: /client/src/components/UnderstandingLLMModule/activities/DataVolumeGuess.tsx

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Database, BookOpen, Globe, Code, MessageCircle, FileText } from 'lucide-react';

interface Props {
  onComplete: () => void;
}

interface ModelData {
  name: string;
  parameters: string;
  dataAmount: string;
  userGuess?: number;
  actualAmount: number;
  unit: string;
  equivalent: string;
  color: string;
}

export default function DataVolumeGuess({ onComplete }: Props) {
  const [stage, setStage] = useState<'guess' | 'reveal' | 'sources'>('guess');
  const [currentModel, setCurrentModel] = useState(0);
  const [guess, setGuess] = useState('');
  const [models, setModels] = useState<ModelData[]>([
    {
      name: 'GPT-3',
      parameters: '175 billion',
      dataAmount: '?',
      actualAmount: 600000,
      unit: 'books',
      equivalent: "That's like reading every book in 12 average public libraries!",
      color: 'from-purple-500 to-pink-500'
    },
    {
      name: 'GPT-3.5',
      parameters: '175 billion',
      dataAmount: '?',
      actualAmount: 45,
      unit: 'billion web pages',
      equivalent: "More web pages than you could read in 10,000 lifetimes!",
      color: 'from-blue-500 to-cyan-500'
    },
    {
      name: 'GPT-4',
      parameters: '1.76 trillion',
      dataAmount: '?',
      actualAmount: 10,
      unit: 'trillion words',
      equivalent: "If you read 200 words per minute, 24/7, it would take you 95,000 years!",
      color: 'from-green-500 to-emerald-500'
    }
  ]);

  const dataSources = [
    { 
      icon: BookOpen, 
      label: 'Books & Literature', 
      examples: 'Textbooks, novels, reference books', 
      percentage: 30,
      actualAmount: '~170 million books',
      detail: 'Including books from Google Books, Internet Archive, and major libraries'
    },
    { 
      icon: Globe, 
      label: 'Web Pages', 
      examples: 'Wikipedia, news sites, blogs', 
      percentage: 35,
      actualAmount: '~60 billion pages',
      detail: 'Carefully filtered for quality from the 1.7 trillion pages on the internet'
    },
    { 
      icon: Code, 
      label: 'Code Repositories', 
      examples: 'GitHub, programming documentation', 
      percentage: 15,
      actualAmount: '~100 million repositories',
      detail: 'Open source code from GitHub, GitLab, and other platforms'
    },
    { 
      icon: MessageCircle, 
      label: 'Forums & Social', 
      examples: 'Reddit, Q&A sites, discussions', 
      percentage: 10,
      actualAmount: '~2 billion posts',
      detail: 'High-quality discussions and Q&A from various platforms'
    },
    { 
      icon: FileText, 
      label: 'Academic Papers', 
      examples: 'Research papers, journals', 
      percentage: 10,
      actualAmount: '~50 million papers',
      detail: 'Scientific papers from arXiv, PubMed, and academic databases'
    }
  ];

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
    if (ratio >= 0.5 && ratio <= 2) return { text: "Pretty close!", color: "text-green-400" };
    if (ratio >= 0.1 && ratio <= 10) return { text: "In the ballpark!", color: "text-yellow-400" };
    return { text: "Way off - but that's okay!", color: "text-red-400" };
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-5xl mx-auto"
    >
      {stage === 'guess' && (
        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-8">
          <h1 className="text-3xl font-bold text-white mb-6 text-center">
            How Much Data Trains an LLM?
          </h1>
          
          <div className="bg-blue-900/30 border border-blue-400/30 rounded-lg p-6 mb-8">
            <p className="text-blue-200 text-center">
              LLMs are trained on massive amounts of text. Can you guess how much data was used?
            </p>
            <p className="text-sm text-gray-400 text-center mt-2">
              Think in terms of books, web pages, and words that we can relate to!
            </p>
          </div>

          <div className="bg-gray-800/50 rounded-lg p-8 mb-8">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-white mb-2">
                {models[currentModel].name}
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

            <div className="bg-blue-900/30 border border-blue-400/30 rounded-lg p-4 mb-6">
              <p className="text-blue-200 text-center">
                {currentModel === 0 && "Think about how many books would contain all human knowledge..."}
                {currentModel === 1 && "Consider how many web pages exist on the entire internet..."}
                {currentModel === 2 && "Imagine all the words ever written in human history..."}
              </p>
            </div>

            <div className="max-w-sm mx-auto">
              <input
                type="number"
                value={guess}
                onChange={(e) => setGuess(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleGuess()}
                placeholder={`Enter your guess (${models[currentModel].unit})`}
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

      {stage === 'reveal' && (
        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-8">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">
            The Stunning Reality of Training Data
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
                    <h3 className="text-xl font-bold text-white">{model.name}</h3>
                    {quality && (
                      <span className={`text-sm ${quality.color}`}>
                        {quality.text}
                      </span>
                    )}
                  </div>

                  <div className="grid md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-gray-400 text-sm">Your guess</p>
                      <p className="text-2xl font-bold text-white">
                        {model.userGuess || 'N/A'} {model.userGuess ? model.unit : ''}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm">Actual amount</p>
                      <p className={`text-2xl font-bold bg-gradient-to-r ${model.color} bg-clip-text text-transparent`}>
                        {model.actualAmount} {model.unit}
                      </p>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-gray-700/50 to-gray-600/50 rounded-lg p-4">
                    <p className="text-blue-200 text-sm">{model.equivalent}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 rounded-lg p-6 mb-6"
          >
            <p className="text-white text-center text-lg">
              🤯 <strong>Mind-blowing fact:</strong> GPT-4 was trained on more text than a human 
              could read in 200,000 lifetimes!
            </p>
          </motion.div>

          <button
            onClick={() => setStage('sources')}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium"
          >
            See What's in This Data
          </button>
        </div>
      )}

      {stage === 'sources' && (
        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-8">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">
            What's in All That Training Data?
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <AnimatePresence>
              {dataSources.map((source, index) => (
                <motion.div
                  key={source.label}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-gray-800/50 rounded-lg p-6"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-3 rounded-lg">
                      <source.icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-white">{source.label}</h3>
                  </div>
                  
                  <p className="text-gray-300 text-sm mb-2">{source.examples}</p>
                  
                  <div className="bg-gradient-to-r from-purple-600/20 to-blue-600/20 rounded-lg p-3 mb-3">
                    <p className="text-purple-200 font-bold">{source.actualAmount}</p>
                    <p className="text-purple-300 text-xs mt-1">{source.detail}</p>
                  </div>
                  
                  <div className="bg-gray-700 rounded-full h-3 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${source.percentage}%` }}
                      transition={{ duration: 1, delay: index * 0.1 + 0.5 }}
                      className="bg-gradient-to-r from-blue-500 to-purple-500 h-full"
                    />
                  </div>
                  <p className="text-right text-sm text-gray-400 mt-1">{source.percentage}%</p>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          <div className="space-y-4 mb-8">
            <div className="bg-yellow-900/30 border border-yellow-400/30 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-yellow-200 mb-2">⚡ Fun Facts:</h3>
              <ul className="space-y-2 text-yellow-100">
                <li>• The training data includes text in over 100 languages</li>
                <li>• It contains millions of cooking recipes from around the world</li>
                <li>• Scientific papers from the last 100+ years are included</li>
                <li>• Even movie scripts and song lyrics are part of the mix!</li>
              </ul>
            </div>

            <div className="bg-red-900/30 border border-red-400/30 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-red-200 mb-2">⚠️ Important Note:</h3>
              <p className="text-red-100">
                Not all data is perfect! Training data can include mistakes, biases, and outdated 
                information. That's why we always need to verify AI outputs!
              </p>
            </div>
          </div>

          <button
            onClick={onComplete}
            className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white py-3 rounded-lg font-medium"
          >
            Continue to Tokenization
          </button>
        </div>
      )}
    </motion.div>
  );
}