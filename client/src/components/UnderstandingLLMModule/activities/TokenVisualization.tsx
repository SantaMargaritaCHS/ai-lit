import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Puzzle, ArrowRight, Zap, BookOpen } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface Props {
  onComplete: () => void;
}

const TEACHER_CONNECTION = {
  title: "Classroom Connection",
  content: "When students use AI for writing, understanding tokenization helps them write clearer prompts. Shorter, simpler words often work better than complex vocabulary because they tokenize more predictably."
};

const TOKEN_EXAMPLES = [
  {
    id: 1,
    text: "Understanding is key",
    tokens: ["Under", "standing", " is", " key"],
    explanation: "Just like in the video - 'understanding' splits into two tokens. This shows how complex words break down."
  },
  {
    id: 2,
    text: "Hello world",
    tokens: ["Hello", " world"],
    explanation: "Simple words often become single tokens, with spaces included in following tokens."
  },
  {
    id: 3,
    text: "running",
    tokens: ["run", "ning"],
    explanation: "Common word parts (morphemes) are often split into separate tokens."
  },
  {
    id: 4,
    text: "AI-powered",
    tokens: ["AI", "-", "powered"],
    explanation: "Punctuation and special characters typically become their own tokens."
  },
  {
    id: 5,
    text: "teacher's",
    tokens: ["teacher", "'s"],
    explanation: "Contractions split at the apostrophe, with possessive markers as separate tokens."
  },
  {
    id: 6,
    text: "The students are learning about artificial intelligence in their classroom today.",
    tokens: ["The", " students", " are", " learning", " about", " artificial", " intelligence", " in", " their", " classroom", " today", "."],
    explanation: "Longer sentences show how LLMs process entire thoughts as sequences of tokens."
  }
];

export default function TokenVisualization({ onComplete }: Props) {
  const [currentExample, setCurrentExample] = useState(0);
  const [showTokens, setShowTokens] = useState(false);
  const [customText, setCustomText] = useState('');
  const [customMode, setCustomMode] = useState(false);
  const [customTokens, setCustomTokens] = useState<string[]>([]);

  const example = TOKEN_EXAMPLES[currentExample];

  const tokenizeText = (text: string): string[] => {
    // Simplified tokenization for demonstration
    const tokens: string[] = [];
    const words = text.split(/(\s+)/);
    
    words.forEach(word => {
      if (word.trim()) {
        // Split compound words and contractions
        if (word.includes("'")) {
          const parts = word.split("'");
          tokens.push(parts[0], "'" + parts[1]);
        } else if (word.length > 6) {
          // Split longer words
          const mid = Math.ceil(word.length / 2);
          tokens.push(word.substring(0, mid), word.substring(mid));
        } else {
          tokens.push(word);
        }
      } else if (word) {
        // Include whitespace with previous token if exists
        if (tokens.length > 0 && !tokens[tokens.length - 1].includes(' ')) {
          tokens[tokens.length - 1] += word;
        }
      }
    });
    
    return tokens;
  };

  const handleShowTokens = () => {
    setShowTokens(true);
  };

  const handleNext = () => {
    if (currentExample < TOKEN_EXAMPLES.length - 1) {
      setCurrentExample(currentExample + 1);
      setShowTokens(false);
    } else if (!customMode) {
      setCustomMode(true);
      setShowTokens(false);
    } else {
      onComplete();
    }
  };

  const handleCustomTokenize = () => {
    if (customText.trim()) {
      const tokens = tokenizeText(customText);
      setCustomTokens(tokens);
      setShowTokens(true);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        <Card className="bg-white/10 backdrop-blur-lg border-white/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-white">
              <Puzzle className="w-8 h-8 text-purple-400" />
              Token Processing Visualization
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {!customMode ? (
              <>
                <div className="text-center">
                  <p className="text-white mb-2">
                    Example {currentExample + 1} of {TOKEN_EXAMPLES.length}
                  </p>
                  <div className="w-full bg-gray-700 rounded-full h-2 mb-6">
                    <div
                      className="bg-purple-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${((currentExample + 1) / TOKEN_EXAMPLES.length) * 100}%` }}
                    />
                  </div>
                </div>

                <div className="bg-gray-800 rounded-lg p-6">
                  <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-blue-400" />
                    Original Text:
                  </h3>
                  <p className="text-xl text-white font-mono bg-gray-900 p-4 rounded border-l-4 border-blue-400">
                    "{example.text}"
                  </p>
                </div>
              </>
            ) : (
              <>
                <div className="text-center mb-6">
                  <h3 className="text-xl font-semibold text-white mb-2">
                    Try It Yourself!
                  </h3>
                  <p className="text-white">
                    Type any text below to see how it would be tokenized:
                  </p>
                </div>

                <div className="bg-gray-800 rounded-lg p-6">
                  <textarea
                    value={customText}
                    onChange={(e) => setCustomText(e.target.value)}
                    placeholder="Type your text here... Try something like: 'The teacher's AI-powered classroom is amazing!'"
                    className="w-full h-24 p-4 bg-gray-900 text-white placeholder-gray-400 rounded-lg border-2 border-gray-700 focus:border-purple-400 focus:outline-none resize-none font-mono"
                  />
                </div>
              </>
            )}

            {!showTokens && (
              <div className="text-center">
                <p className="text-white mb-4">
                  {!customMode 
                    ? "Click below to see how an LLM would break this text into tokens:"
                    : "Click to tokenize your custom text:"}
                </p>
                <Button
                  onClick={customMode ? handleCustomTokenize : handleShowTokens}
                  className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-3 rounded-lg font-medium disabled:bg-gray-600 disabled:cursor-not-allowed"
                  disabled={customMode && !customText.trim()}
                >
                  <Zap className="w-4 h-4 mr-2" />
                  Tokenize Text
                </Button>
              </div>
            )}

            <AnimatePresence>
              {showTokens && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                >
                  <div className="bg-gray-800 rounded-lg p-6">
                    <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                      <Puzzle className="w-5 h-5 text-purple-400" />
                      Tokens ({customMode ? customTokens.length : example.tokens.length} total):
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {(customMode ? customTokens : example.tokens).map((token, index) => (
                        <motion.span
                          key={index}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: index * 0.1 }}
                          className="inline-block bg-purple-900/40 border border-purple-400 rounded-lg px-3 py-2 text-white font-mono text-sm hover:bg-purple-800/50 transition-colors cursor-default"
                          title={`Token ${index + 1}`}
                        >
                          {token === ' ' ? '␣' : token}
                        </motion.span>
                      ))}
                    </div>
                  </div>

                  {!customMode && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: example.tokens.length * 0.1 + 0.3 }}
                      className="bg-blue-900/40 border border-blue-400 rounded-lg p-6"
                    >
                      <h4 className="font-semibold text-white mb-2">How This Helps LLMs:</h4>
                      <p className="text-white">{example.explanation}</p>
                    </motion.div>
                  )}

                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: example.tokens.length * 0.1 + 0.5 }}
                    className="bg-yellow-900/40 border border-yellow-400 rounded-lg p-6"
                  >
                    <h4 className="font-semibold text-white mb-2">🎯 {TEACHER_CONNECTION.title}:</h4>
                    <p className="text-white">
                      {TEACHER_CONNECTION.content}
                    </p>
                  </motion.div>

                  <div className="text-center">
                    <Button
                      onClick={handleNext}
                      className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-medium"
                    >
                      {currentExample < TOKEN_EXAMPLES.length - 1 ? (
                        <>
                          Next Example
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </>
                      ) : !customMode ? (
                        <>
                          Try Your Own Text
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </>
                      ) : (
                        <>
                          Complete Activity
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </>
                      )}
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}