// Create: /client/src/components/UnderstandingLLMModule/activities/TokenizationDemo.tsx

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Scissors, Hash, Info, ArrowRight, Check } from 'lucide-react';

interface Props {
  onComplete: () => void;
}

interface Token {
  text: string;
  id: number;
  color: string;
}

interface Example {
  id: string;
  label: string;
  icon: string;
  text: string;
  description: string;
}

export default function TokenizationDemo({ onComplete }: Props) {
  const [selectedTab, setSelectedTab] = useState<string>('');
  const [viewedExamples, setViewedExamples] = useState<Set<string>>(new Set());
  const [userInput, setUserInput] = useState('');
  const [userTokens, setUserTokens] = useState<Token[]>([]);
  const [showExplanation, setShowExplanation] = useState(false);
  const [canContinue, setCanContinue] = useState(false);

  const examples: Example[] = [
    {
      id: 'essay',
      label: 'Essay',
      icon: '📝',
      text: "The Industrial Revolution fundamentally transformed society. Manufacturing shifted from hand production to machines, creating unprecedented economic growth and urbanization. This period marked humanity's transition into the modern era.",
      description: "Academic writing - notice how complex words split into meaningful parts"
    },
    {
      id: 'homework',
      label: 'Homework',
      icon: '🤔',
      text: "Can you explain photosynthesis in simple terms?",
      description: "Homework question - see how AI processes your questions"
    },
    {
      id: 'text',
      label: 'Text',
      icon: '💬',
      text: "gonna study for the calc test tmrw u free?",
      description: "Text message - slang and abbreviations tokenize differently"
    }
  ];

  // Realistic tokenization patterns based on GPT-style tokenization
  const tokenizeText = (text: string): Token[] => {
    if (!text) return [];

    const words = text.split(/\s+/);
    const tokenList: Token[] = [];
    let tokenId = 0;

    words.forEach((word, wordIndex) => {
      // Add space token if not first word
      if (wordIndex > 0) {
        tokenList.push({
          text: ' ',
          id: tokenId++,
          color: 'bg-gray-600'
        });
      }

      // Special tokenization patterns for student-relevant content
      if (word.toLowerCase() === 'photosynthesis') {
        tokenList.push({ text: 'photo', id: tokenId++, color: 'bg-green-500' });
        tokenList.push({ text: 'synthesis', id: tokenId++, color: 'bg-blue-500' });
      } else if (word.toLowerCase() === 'mechanization') {
        tokenList.push({ text: 'mechan', id: tokenId++, color: 'bg-purple-500' });
        tokenList.push({ text: 'ization', id: tokenId++, color: 'bg-yellow-500' });
      } else if (word.toLowerCase() === 'industrial') {
        tokenList.push({ text: 'industr', id: tokenId++, color: 'bg-orange-500' });
        tokenList.push({ text: 'ial', id: tokenId++, color: 'bg-pink-500' });
      } else if (word.toLowerCase() === 'revolution') {
        tokenList.push({ text: 'revol', id: tokenId++, color: 'bg-cyan-500' });
        tokenList.push({ text: 'ution', id: tokenId++, color: 'bg-teal-500' });
      } else if (word.toLowerCase() === 'fundamentally') {
        tokenList.push({ text: 'fund', id: tokenId++, color: 'bg-blue-500' });
        tokenList.push({ text: 'ament', id: tokenId++, color: 'bg-green-500' });
        tokenList.push({ text: 'ally', id: tokenId++, color: 'bg-purple-500' });
      } else if (word.toLowerCase() === 'transformed') {
        tokenList.push({ text: 'trans', id: tokenId++, color: 'bg-red-500' });
        tokenList.push({ text: 'formed', id: tokenId++, color: 'bg-indigo-500' });
      } else if (word.toLowerCase() === 'unprecedented') {
        tokenList.push({ text: 'un', id: tokenId++, color: 'bg-yellow-500' });
        tokenList.push({ text: 'preced', id: tokenId++, color: 'bg-blue-500' });
        tokenList.push({ text: 'ented', id: tokenId++, color: 'bg-green-500' });
      } else if (word.toLowerCase() === 'urbanization') {
        tokenList.push({ text: 'urban', id: tokenId++, color: 'bg-purple-500' });
        tokenList.push({ text: 'ization', id: tokenId++, color: 'bg-orange-500' });
      } else if (word.toLowerCase() === 'manufacturing') {
        tokenList.push({ text: 'manufact', id: tokenId++, color: 'bg-cyan-500' });
        tokenList.push({ text: 'uring', id: tokenId++, color: 'bg-pink-500' });
      } else if (word === 'tmrw' || word === 'u') {
        // Slang tokenizes as single unusual tokens
        tokenList.push({ text: word, id: tokenId++, color: 'bg-red-400' });
      } else if (word === 'gonna') {
        tokenList.push({ text: 'gon', id: tokenId++, color: 'bg-yellow-400' });
        tokenList.push({ text: 'na', id: tokenId++, color: 'bg-green-400' });
      } else if (word.endsWith('!') || word.endsWith('?') || word.endsWith('.') || word.endsWith(',')) {
        const punct = word.slice(-1);
        const main = word.slice(0, -1);
        if (main) {
          tokenList.push({ text: main, id: tokenId++, color: getRandomColor() });
        }
        tokenList.push({ text: punct, id: tokenId++, color: 'bg-gray-500' });
      } else {
        // Simple words as single tokens
        tokenList.push({ text: word, id: tokenId++, color: getRandomColor() });
      }
    });

    return tokenList;
  };

  const getRandomColor = () => {
    const colors = ['bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-yellow-500', 'bg-pink-500'];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  // Handle tab selection
  const handleTabSelect = (exampleId: string) => {
    setSelectedTab(exampleId);
    setViewedExamples(prev => new Set(prev).add(exampleId));
  };

  // Tokenize user input with debounce
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      setUserTokens(tokenizeText(userInput));
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [userInput]);

  // Check if user can continue
  useEffect(() => {
    const hasViewedAll = viewedExamples.size >= 3; // Must view all 3 examples
    const hasTypedEnough = userInput.trim().length >= 20;
    setCanContinue(hasViewedAll && hasTypedEnough);
  }, [viewedExamples, userInput]);

  const hasViewedAllExamples = viewedExamples.size >= 3;

  const selectedExample = examples.find(ex => ex.id === selectedTab);
  const selectedTokens = selectedExample ? tokenizeText(selectedExample.text) : [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-6xl mx-auto"
    >
      <div className="bg-white/10 backdrop-blur-lg rounded-xl p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <Scissors className="w-16 h-16 text-blue-400 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-white mb-4">
            Tokens: The "Tiny Little Pieces"
          </h1>
          <div className="bg-blue-900/30 border border-blue-400 rounded-lg p-6 max-w-3xl mx-auto">
            <p className="text-white text-lg leading-relaxed">
              LLMs don't process text letter-by-letter or even word-by-word. Instead, they break text into <strong className="text-yellow-300">TOKENS</strong> - smart chunks that capture meaning. A token might be a whole word like "cat", part of a word like "photo" + "synthesis", or even punctuation. This helps the AI understand and predict text way more effectively.
            </p>
          </div>
        </div>

        {/* Tab Buttons */}
        <div className="flex gap-3 mb-6 justify-center">
          {examples.map((example) => (
            <button
              key={example.id}
              onClick={() => handleTabSelect(example.id)}
              className={`relative px-6 py-3 rounded-lg font-medium transition-all ${
                selectedTab === example.id
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'bg-gray-700 text-white hover:bg-gray-600'
              }`}
            >
              <span className="mr-2">{example.icon}</span>
              {example.label}
              {viewedExamples.has(example.id) && (
                <Check className="w-4 h-4 text-green-400 absolute -top-1 -right-1" />
              )}
            </button>
          ))}
        </div>

        {/* Prompt to click an example */}
        {!selectedTab && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-yellow-900/30 border-2 border-yellow-400 rounded-lg p-8 mb-8 text-center"
          >
            <p className="text-white text-xl font-medium">
              👆 Click on an example above to see how it breaks into tokens!
            </p>
          </motion.div>
        )}

        {/* Split Screen: Original Text (Left) + Tokenized (Right) */}
        {selectedTab && selectedExample && (
          <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Left: Original Text */}
          <div className="bg-gray-800/50 border-2 border-purple-400 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <span>Original Text</span>
            </h3>
            <div className="bg-gray-900/50 rounded-lg p-4 min-h-[200px]">
              <p className="text-white text-lg leading-relaxed">
                {selectedExample.text}
              </p>
            </div>
            <p className="text-white/70 text-sm mt-3">
              {selectedExample.description}
            </p>
          </div>

          {/* Right: Tokenized Breakdown */}
          <div className="bg-gray-800/50 border-2 border-green-400 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Hash className="w-5 h-5 text-green-400" />
              <span>Tokenized ({selectedTokens.length} tokens)</span>
            </h3>
            <div className="bg-gray-900/50 rounded-lg p-4 min-h-[200px]">
              <div className="flex flex-wrap gap-2">
                {selectedTokens.map((token, index) => (
                  <motion.div
                    key={token.id}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: index * 0.02 }}
                    className="relative group"
                  >
                    <div className={`${token.color} px-3 py-1 rounded-lg text-white font-mono text-sm`}>
                      {token.text === ' ' ? '␣' : token.text}
                    </div>
                    <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                      Token {index + 1}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
            <p className="text-white/70 text-sm mt-3">
              See how the text breaks into colored chunks? Each color is a different token!
            </p>
          </div>
        </div>
        )}

        {/* Prompt to view all examples before "Now You Try!" */}
        {!hasViewedAllExamples && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-purple-900/30 border-2 border-purple-400 rounded-lg p-6 mb-8 text-center"
          >
            <p className="text-white text-lg font-medium mb-2">
              🔍 Keep exploring!
            </p>
            <p className="text-white/80">
              Click on all three examples above (Essay, Homework, Text) to unlock "Now You Try!"
            </p>
            <p className="text-white/60 text-sm mt-2">
              {viewedExamples.size}/3 examples viewed
            </p>
          </motion.div>
        )}

        {/* Try Your Own Section - Only visible after viewing all examples */}
        {hasViewedAllExamples && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
        <div className="bg-yellow-900/20 border-2 border-yellow-400 rounded-lg p-6 mb-8">
          <h3 className="text-xl font-semibold text-white mb-4">
            ✏️ Now You Try!
          </h3>
          <p className="text-white mb-4">
            Type anything you want to see how it tokenizes (at least 20 characters):
          </p>
          <textarea
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            placeholder="Type anything here... try a sentence from your homework, a text message, or anything else!"
            className="w-full h-24 px-4 py-3 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 resize-none mb-3"
          />
          <div className="flex justify-between items-center text-sm mb-4">
            <span className={userInput.length >= 20 ? 'text-green-400 font-medium' : 'text-white/70'}>
              {userInput.length >= 20 ? '✓' : '•'} {userInput.length}/20 characters
            </span>
            {userTokens.length > 0 && (
              <span className="text-white/70">
                <Hash className="w-4 h-4 inline mr-1" />
                {userTokens.length} tokens
              </span>
            )}
          </div>

          {/* User's Tokenized Output */}
          {userTokens.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gray-900/50 rounded-lg p-4"
            >
              <div className="flex flex-wrap gap-2">
                {userTokens.map((token, index) => (
                  <motion.div
                    key={token.id}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: index * 0.03 }}
                    className={`${token.color} px-3 py-1 rounded-lg text-white font-mono text-sm`}
                  >
                    {token.text === ' ' ? '␣' : token.text}
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </div>
        </motion.div>
        )}

        {/* Explanation Toggle */}
        <div className="text-center mb-6">
          <button
            onClick={() => setShowExplanation(!showExplanation)}
            className="text-blue-400 hover:text-blue-300 text-sm inline-flex items-center gap-1"
          >
            <Info className="w-4 h-4" />
            {showExplanation ? 'Hide' : 'Show'} why this matters for you
          </button>
        </div>

        {/* Explanation */}
        <AnimatePresence>
          {showExplanation && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-8"
            >
              <div className="bg-blue-900/30 border border-blue-400 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-white mb-4">💡 Why This Matters for YOU:</h3>
                <ul className="text-white space-y-3">
                  <li>• <strong className="text-yellow-300">Token limits:</strong> Why AI tools cut off long essays (too many tokens!)</li>
                  <li>• <strong className="text-yellow-300">Better predictions:</strong> Tokens help the AI's "prediction game" work way better than letters</li>
                  <li>• <strong className="text-yellow-300">Understanding slang:</strong> Why AI sometimes struggles with "u", "tmrw", etc.</li>
                  <li>• <strong className="text-yellow-300">Processing power:</strong> More tokens = more computation = slower responses</li>
                </ul>
                <p className="text-white mt-4">
                  Remember: It's all part of that <strong className="text-yellow-300">"super advanced pattern matcher"</strong> the video talked about—tokens are how it matches patterns!
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Progress Indicator */}
        <div className="bg-gray-800/50 border border-gray-600 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span className={viewedExamples.size >= 3 ? 'text-green-400' : 'text-white/70'}>
                {viewedExamples.size >= 3 ? '✓' : '○'} Viewed all 3 examples ({viewedExamples.size}/3)
              </span>
              <span className={userInput.length >= 20 ? 'text-green-400' : 'text-white/70'}>
                {userInput.length >= 20 ? '✓' : '○'} Tried your own text
              </span>
            </div>
            {canContinue && (
              <span className="text-green-400 font-medium">Ready to continue!</span>
            )}
          </div>
        </div>

        {/* Continue Button */}
        <button
          onClick={onComplete}
          disabled={!canContinue}
          className={`w-full py-4 rounded-lg font-medium text-lg flex items-center justify-center gap-2 transition-all ${
            canContinue
              ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white cursor-pointer'
              : 'bg-gray-700 text-gray-400 cursor-not-allowed'
          }`}
        >
          {canContinue ? (
            <>
              Continue <ArrowRight className="w-5 h-5" />
            </>
          ) : (
            'Complete the requirements above to continue'
          )}
        </button>
      </div>
    </motion.div>
  );
}
