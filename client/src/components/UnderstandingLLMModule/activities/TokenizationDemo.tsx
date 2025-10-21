// Create: /client/src/components/UnderstandingLLMModule/activities/TokenizationDemo.tsx

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Scissors, Hash, Info, ArrowRight } from 'lucide-react';

interface Props {
  onComplete: () => void;
}

interface Token {
  text: string;
  id: number;
  color: string;
}

export default function TokenizationDemo({ onComplete }: Props) {
  const [inputText, setInputText] = useState('');
  const [tokens, setTokens] = useState<Token[]>([]);
  const [showExplanation, setShowExplanation] = useState(false);
  const [currentExample, setCurrentExample] = useState(0);

  const examples = [
    {
      text: "Hello world",
      description: "Simple words often become single tokens"
    },
    {
      text: "Understanding tokenization",
      description: "Longer words might split into meaningful parts"
    },
    {
      text: "ChatGPT is amazing!",
      description: "Brand names and punctuation have their own patterns"
    },
    {
      text: "The temperature is 72°F",
      description: "Numbers and symbols are handled specially"
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

      // Special tokenization patterns
      if (word.toLowerCase() === 'chatgpt') {
        tokenList.push({ text: 'Chat', id: tokenId++, color: 'bg-blue-500' });
        tokenList.push({ text: 'GPT', id: tokenId++, color: 'bg-purple-500' });
      } else if (word.toLowerCase().includes('understand')) {
        tokenList.push({ text: 'Under', id: tokenId++, color: 'bg-green-500' });
        tokenList.push({ text: 'stand', id: tokenId++, color: 'bg-yellow-500' });
        if (word.toLowerCase() === 'understanding') {
          tokenList.push({ text: 'ing', id: tokenId++, color: 'bg-pink-500' });
        }
      } else if (word.includes('°')) {
        const parts = word.split('°');
        tokenList.push({ text: parts[0], id: tokenId++, color: 'bg-orange-500' });
        tokenList.push({ text: '°', id: tokenId++, color: 'bg-red-500' });
        if (parts[1]) {
          tokenList.push({ text: parts[1], id: tokenId++, color: 'bg-indigo-500' });
        }
      } else if (word.toLowerCase() === 'tokenization') {
        tokenList.push({ text: 'token', id: tokenId++, color: 'bg-cyan-500' });
        tokenList.push({ text: 'ization', id: tokenId++, color: 'bg-teal-500' });
      } else if (word.endsWith('!') || word.endsWith('?') || word.endsWith('.')) {
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

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      setTokens(tokenizeText(inputText));
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [inputText]);

  const loadExample = (index: number) => {
    setCurrentExample(index);
    setInputText(examples[index].text);
    setShowExplanation(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-5xl mx-auto"
    >
      <div className="bg-white/10 backdrop-blur-lg rounded-xl p-8">
        <div className="text-center mb-8">
          <Scissors className="w-16 h-16 text-blue-400 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-white mb-2">
            The "Ingredients" - Understanding Tokens
          </h1>
          <p className="text-white text-lg mb-4">
            Remember the Shakespeare example that predicted letter-by-letter? That didn't work well.
          </p>
          <div className="bg-blue-900/30 border border-blue-400 rounded-lg p-4 max-w-2xl mx-auto">
            <p className="text-white">
              Modern LLMs don't predict letters—they predict <strong className="text-yellow-300">tokens</strong>.
              Tokens are the <strong className="text-yellow-300">building blocks</strong> that LLMs use to process and predict text.
              They're like "chunks" of text that capture meaning better than individual letters.
            </p>
          </div>
        </div>

        {/* Example buttons */}
        <div className="mb-6">
          <p className="text-white text-sm mb-3">Try these examples:</p>
          <div className="flex flex-wrap gap-2">
            {examples.map((example, index) => (
              <button
                key={index}
                onClick={() => loadExample(index)}
                className={`px-4 py-2 rounded-lg text-sm transition-all ${
                  currentExample === index && inputText === example.text
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-700 text-white hover:bg-gray-600'
                }`}
              >
                "{example.text}"
              </button>
            ))}
          </div>
          {inputText && examples[currentExample]?.text === inputText && (
            <p className="text-white text-sm mt-2">{examples[currentExample].description}</p>
          )}
        </div>

        {/* Input field */}
        <div className="mb-8">
          <label className="block text-white font-medium mb-2">
            Enter your text:
          </label>
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Type anything here..."
            className="w-full px-4 py-3 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        {/* Token visualization */}
        {tokens.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-8"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Tokens Generated:</h3>
              <div className="flex items-center gap-2 text-white">
                <Hash className="w-5 h-5" />
                <span>{tokens.length} tokens</span>
              </div>
            </div>

            <div className="bg-gray-800/50 rounded-lg p-6">
              <div className="flex flex-wrap gap-2 mb-6">
                <AnimatePresence mode="popLayout">
                  {tokens.map((token, index) => (
                    <motion.div
                      key={token.id}
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className={`relative group`}
                    >
                      <div className={`${token.color} px-3 py-2 rounded-lg text-white font-mono`}>
                        {token.text === ' ' ? '␣' : token.text}
                      </div>
                      <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                        Token {index + 1}
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              <div className="text-center">
                <button
                  onClick={() => setShowExplanation(!showExplanation)}
                  className="text-blue-400 hover:text-blue-300 text-sm inline-flex items-center gap-1"
                >
                  <Info className="w-4 h-4" />
                  {showExplanation ? 'Hide' : 'Show'} how this works
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Explanation */}
        <AnimatePresence>
          {showExplanation && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-8"
            >
              <div className="bg-blue-900/30 border border-blue-400 rounded-lg p-6 space-y-4">
                <h3 className="text-lg font-semibold text-white">How Tokenization Works:</h3>

                <div className="space-y-3 text-white">
                  <p>• <strong>Spaces</strong> usually become their own tokens (shown as ␣)</p>
                  <p>• <strong>Common words</strong> like "the", "is", "hello" stay as single tokens</p>
                  <p>• <strong>Longer words</strong> split into meaningful parts: "understanding" → "under" + "stand" + "ing"</p>
                  <p>• <strong>Punctuation</strong> gets separated: "amazing!" → "amazing" + "!"</p>
                  <p>• <strong>Numbers and symbols</strong> may split: "72°F" → "72" + "°" + "F"</p>
                </div>

                <div className="bg-yellow-900/20 rounded-lg p-4 mt-4">
                  <p className="text-white text-sm">
                    💡 <strong>Why this matters:</strong> Tokens are the <strong className="text-yellow-300">building blocks</strong> the LLM uses for prediction.
                    When the LLM predicts "what comes next," it's predicting the next <em>token</em>, not the next letter.
                    More tokens = more processing needed!
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Continue button */}
        <button
          onClick={onComplete}
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3 rounded-lg font-medium flex items-center justify-center gap-2"
        >
          Continue <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </motion.div>
  );
}