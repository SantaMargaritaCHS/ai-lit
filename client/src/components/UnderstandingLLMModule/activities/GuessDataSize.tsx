import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, Database, BookOpen, Library, Globe, Rocket } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Props {
  onComplete: () => void;
}

interface DataOption {
  value: number;
  label: string;
  description: string;
  icon: React.ReactNode;
  visualScale: string;
  color: string;
}

const dataOptions: DataOption[] = [
  {
    value: 0,
    label: '1 Million Pages',
    description: 'About 500 books',
    icon: <BookOpen className="w-12 h-12" />,
    visualScale: 'A small personal library',
    color: 'from-blue-400 to-blue-600'
  },
  {
    value: 1,
    label: '100 Million Pages',
    description: 'A major city library',
    icon: <Library className="w-12 h-12" />,
    visualScale: 'Thousands of bookshelves',
    color: 'from-purple-400 to-purple-600'
  },
  {
    value: 2,
    label: '10 Billion Pages',
    description: 'Library of Congress × 50',
    icon: <Globe className="w-12 h-12" />,
    visualScale: 'All books ever published... multiple times',
    color: 'from-pink-400 to-pink-600'
  },
  {
    value: 3,
    label: '1 Trillion Pages',
    description: 'Mind-bogglingly massive',
    icon: <Rocket className="w-12 h-12" />,
    visualScale: 'Books stacked to the Moon and back 10 TIMES',
    color: 'from-yellow-400 to-orange-600'
  }
];

const correctAnswerIndex = 3;

export default function GuessDataSize({ onComplete }: Props) {
  const [selectedValue, setSelectedValue] = useState<number | null>(null);
  const [showReveal, setShowReveal] = useState(false);

  const handleCardClick = (value: number) => {
    if (!showReveal) {
      setSelectedValue(value);
    }
  };

  const handleSubmitGuess = () => {
    if (selectedValue !== null) {
      setShowReveal(true);
    }
  };

  const isCorrect = selectedValue === correctAnswerIndex;

  if (showReveal) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-5xl w-full"
        >
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 md:p-12 border-2 border-white/20">
            {/* Result Header */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-center mb-8"
            >
              <div className="text-6xl mb-4">
                {isCorrect ? '🎯' : '🤯'}
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                {isCorrect ? 'Exactly Right!' : 'The Answer Might Surprise You...'}
              </h2>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-6 mb-8">
              {/* Your Guess */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-blue-900/40 border-2 border-blue-400 rounded-xl p-6"
              >
                <p className="text-white font-semibold mb-3 text-sm uppercase tracking-wide">Your Guess:</p>
                <div className={`bg-gradient-to-r ${dataOptions[selectedValue!].color} p-4 rounded-lg mb-3`}>
                  <div className="text-white flex justify-center mb-2">
                    {dataOptions[selectedValue!].icon}
                  </div>
                </div>
                <p className="text-white text-xl font-bold mb-1">{dataOptions[selectedValue!].label}</p>
                <p className="text-white/70 text-sm">{dataOptions[selectedValue!].description}</p>
              </motion.div>

              {/* Correct Answer */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 }}
                className="bg-gradient-to-br from-green-900/40 to-emerald-900/40 border-2 border-green-400 rounded-xl p-6"
              >
                <p className="text-white font-semibold mb-3 text-sm uppercase tracking-wide">The Answer:</p>
                <div className="bg-gradient-to-r from-yellow-400 to-orange-600 p-4 rounded-lg mb-3">
                  <div className="text-white flex justify-center mb-2">
                    <Rocket className="w-12 h-12" />
                  </div>
                </div>
                <p className="text-white text-xl font-bold mb-1">
                  {dataOptions[correctAnswerIndex].label}
                </p>
                <p className="text-white/90 text-base">
                  GPT-4 was trained on a <span className="font-bold text-green-300">truly colossal</span> amount of text—huge chunks of the internet!
                </p>
              </motion.div>
            </div>

            {/* Visual Analogy - Large and Prominent */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="bg-gradient-to-br from-purple-900/40 to-pink-900/40 border-2 border-purple-400 rounded-xl p-10 mb-8 text-center"
            >
              <div className="mb-6">
                <Rocket className="h-20 w-20 text-purple-300 mx-auto animate-bounce" />
              </div>
              <h3 className="text-3xl font-bold text-white mb-6">
                How Much Is That Really?
              </h3>
              <p className="text-white text-xl leading-relaxed mb-6">
                Imagine stacking all that text as physical books...
              </p>

              {/* Visual Representation */}
              <div className="bg-gradient-to-r from-blue-900/40 to-purple-900/40 rounded-2xl p-8 mb-6 border-2 border-white/20">
                <div className="flex items-center justify-center gap-6 mb-4">
                  <div className="text-center">
                    <div className="text-5xl mb-2">🌍</div>
                    <p className="text-white font-semibold text-sm">Earth</p>
                  </div>

                  <div className="text-center">
                    <div className="text-6xl text-yellow-300 animate-pulse">↔️</div>
                  </div>

                  <div className="text-center">
                    <div className="text-5xl mb-2">🌙</div>
                    <p className="text-white font-semibold text-sm">Moon</p>
                  </div>
                </div>

                <div className="bg-white/10 rounded-xl p-6 backdrop-blur-sm">
                  <p className="text-white text-2xl font-bold mb-3">
                    📚 Books from Earth to the Moon 📚
                  </p>
                  <p className="text-yellow-300 text-3xl font-bold mb-2">
                    ...and back again...
                  </p>
                  <p className="text-5xl font-extrabold text-purple-300 animate-pulse">
                    10 TIMES!
                  </p>
                </div>
              </div>

              <p className="text-white/70 text-base italic">
                That's approximately 238,855 miles × 20 = 4,777,100 miles of books!
              </p>
            </motion.div>

            {/* Key Insight */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.0 }}
              className="bg-blue-900/40 border-2 border-blue-400 rounded-xl p-6 mb-8"
            >
              <div className="flex items-start gap-3">
                <Sparkles className="h-6 w-6 text-yellow-400 flex-shrink-0 mt-1" />
                <div>
                  <p className="text-white text-base leading-relaxed">
                    <span className="font-bold text-yellow-300">Why does this matter?</span> The more data an LLM sees, the better it gets at spotting patterns. But remember—it's only as good as the data it's trained on!
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Continue Button */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}
            >
              <Button
                onClick={onComplete}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white py-6 text-lg rounded-xl"
              >
                Continue
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </motion.div>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-6xl w-full"
      >
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 md:p-12 border-2 border-white/20">
          {/* Header */}
          <div className="text-center mb-10">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="inline-block mb-4"
            >
              <Database className="h-16 w-16 text-blue-400" />
            </motion.div>

            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
              How Much Data?
            </h1>

            <p className="text-xl text-white max-w-3xl mx-auto">
              An LLM needs a <span className="font-bold text-yellow-300">truly colossal</span> amount of text data to learn patterns.
            </p>
            <p className="text-lg text-white mt-2">
              How much text data do you think GPT-4 was trained on?
            </p>
          </div>

          {/* Interactive Visual Comparison - All Options Visible */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {dataOptions.map((option, index) => {
              const isSelected = selectedValue === index;
              const scaleSize = [1, 1.2, 1.4, 1.6][index]; // Progressive sizing

              return (
                <motion.button
                  key={index}
                  onClick={() => handleCardClick(index)}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  whileHover={{ scale: 1.02, y: -4 }}
                  whileTap={{ scale: 0.98 }}
                  className={`
                    relative p-6 rounded-2xl border-2 transition-all duration-300 text-left
                    ${isSelected
                      ? 'bg-gradient-to-br from-blue-500/40 to-purple-500/40 border-yellow-400 shadow-xl shadow-yellow-400/20'
                      : 'bg-white/5 border-white/20 hover:border-white/40 hover:bg-white/10'
                    }
                  `}
                >
                  {/* Selection Indicator */}
                  {isSelected && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-3 -right-3 bg-yellow-400 text-purple-900 rounded-full w-10 h-10 flex items-center justify-center font-bold text-lg shadow-lg"
                    >
                      ✓
                    </motion.div>
                  )}

                  {/* Icon with gradient background */}
                  <div className={`bg-gradient-to-r ${option.color} p-4 rounded-xl mb-4 inline-block`}>
                    <div className="text-white">
                      {option.icon}
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="text-2xl font-bold text-white mb-2">
                    {option.label}
                  </h3>

                  {/* Description */}
                  <p className="text-white/80 text-base mb-3">
                    {option.description}
                  </p>

                  {/* Visual Scale - Size comparison */}
                  <div
                    className="bg-white/10 rounded-lg p-3 border border-white/20"
                    style={{ transform: `scale(${scaleSize * 0.6})`, transformOrigin: 'left center' }}
                  >
                    <p className="text-white text-sm font-medium">
                      📏 {option.visualScale}
                    </p>
                  </div>

                  {/* Subtle size indicator bars */}
                  <div className="mt-4 flex gap-1">
                    {Array.from({ length: 4 }).map((_, barIndex) => (
                      <div
                        key={barIndex}
                        className={`h-1 rounded-full flex-1 ${
                          barIndex <= index ? 'bg-gradient-to-r ' + option.color : 'bg-white/10'
                        }`}
                      />
                    ))}
                  </div>
                </motion.button>
              );
            })}
          </div>

          {/* Hint Text */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="text-center mb-6"
          >
            <p className="text-white/60 text-sm">
              💡 Click a card to select your guess, then click "See the Answer"
            </p>
          </motion.div>

          {/* Submit Button */}
          <Button
            onClick={handleSubmitGuess}
            disabled={selectedValue === null}
            className={`w-full py-6 text-lg rounded-xl transition-all ${
              selectedValue !== null
                ? 'bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white'
                : 'bg-gray-700 text-white/70 cursor-not-allowed'
            }`}
          >
            See the Answer
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
