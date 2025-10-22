import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Globe, Code, MessageCircle, FileText, Target, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Props {
  onComplete: () => void;
}

const ACTUAL_BOOKS = 1140000000; // 1.14 billion books (one billion, one hundred forty million) = 114 trillion tokens

const teenComparisons = [
  {
    icon: '📱',
    title: 'TikTok Captions',
    amount: '3.9 trillion',
    description: 'If every TikTok had a detailed caption!'
  },
  {
    icon: '💬',
    title: 'Text Messages',
    amount: '7.8 trillion',
    description: 'More than all texts ever sent... twice over!'
  },
  {
    icon: '📷',
    title: 'Instagram Posts',
    amount: '3.9 trillion',
    description: 'Worth of captions and comments'
  },
  {
    icon: '🎥',
    title: 'YouTube Transcripts',
    amount: '57 billion',
    description: '10-minute video transcripts'
  },
  {
    icon: '🏫',
    title: 'School Libraries',
    amount: 'Every high school library in America... 3,800 times over!',
    description: 'That\'s almost incomprehensible!'
  }
];

const dataSources = [
  {
    icon: BookOpen,
    label: 'Books & Literature',
    examples: 'Textbooks, novels, reference books',
    percentage: 30,
    color: 'from-blue-500 to-cyan-500'
  },
  {
    icon: Globe,
    label: 'Web Pages',
    examples: 'Wikipedia, news sites, blogs',
    percentage: 35,
    color: 'from-purple-500 to-pink-500'
  },
  {
    icon: Code,
    label: 'Code Repositories',
    examples: 'GitHub, programming docs',
    percentage: 15,
    color: 'from-green-500 to-emerald-500'
  },
  {
    icon: MessageCircle,
    label: 'Forums & Social',
    examples: 'Reddit, Q&A sites',
    percentage: 10,
    color: 'from-orange-500 to-red-500'
  },
  {
    icon: FileText,
    label: 'Academic Papers',
    examples: 'Research papers, journals',
    percentage: 10,
    color: 'from-indigo-500 to-violet-500'
  }
];

export default function ReadAThon({ onComplete }: Props) {
  const [stage, setStage] = useState<'intro' | 'guess' | 'reveal' | 'comparisons' | 'sources'>('intro');
  const [userGuess, setUserGuess] = useState(10);
  const [sliderValue, setSliderValue] = useState(1); // Log scale position (1-9 for 10^1 to 10^9)

  // Convert slider position (1-9) to actual number (10 to 1,000,000,000)
  const sliderToNumber = (sliderPos: number) => {
    return Math.round(Math.pow(10, sliderPos));
  };

  // Handle slider change
  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    setSliderValue(value);
    setUserGuess(sliderToNumber(value));
  };

  const handleSubmitGuess = () => {
    setStage('reveal');
  };

  // Calculate how close the guess was
  const percentageOff = Math.abs(userGuess - ACTUAL_BOOKS) / ACTUAL_BOOKS * 100;
  const getFeedback = () => {
    if (percentageOff < 5) return { emoji: '🎯', text: 'Incredibly close!', color: 'text-green-400' };
    if (percentageOff < 20) return { emoji: '📊', text: 'Pretty good estimate!', color: 'text-blue-400' };
    if (percentageOff < 50) return { emoji: '🤔', text: 'You\'re in the ballpark!', color: 'text-yellow-400' };
    return { emoji: '😲', text: 'The scale is mind-blowing, right?', color: 'text-purple-400' };
  };

  // Intro Screen
  const renderIntro = () => (
    <motion.div
      key="intro"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="text-center max-w-3xl mx-auto"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 200 }}
        className="mb-6"
      >
        <BookOpen className="h-24 w-24 text-blue-400 mx-auto mb-4" />
      </motion.div>

      <h1 className="text-4xl font-bold text-white mb-6">
        Guess the Training Data Scale
      </h1>

      <div className="bg-blue-900/30 border-2 border-blue-400 rounded-xl p-6 mb-8">
        <p className="text-white text-xl mb-4">
          GPT-5 was trained on a massive amount of text from across the internet.
        </p>
        <p className="text-white text-2xl font-bold mb-4">
          How many books worth of text do you think that is?
        </p>
        <p className="text-white/80 text-sm">
          Think about a typical novel... now imagine stacking up books until you have all of GPT-5's training data.
        </p>
      </div>

      <Button
        onClick={() => setStage('guess')}
        className="w-full max-w-md mx-auto bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white py-6 text-xl rounded-xl"
      >
        Make Your Guess
      </Button>
    </motion.div>
  );

  // Guess Screen with Slider
  const renderGuess = () => (
    <motion.div
      key="guess"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center max-w-4xl mx-auto"
    >
      <h2 className="text-3xl font-bold text-white mb-8">
        How many books of text?
      </h2>

      {/* Current Guess Display */}
      <div className="bg-gradient-to-r from-blue-900/60 to-purple-900/60 border-2 border-blue-400 rounded-xl p-8 mb-8">
        <p className="text-white/70 text-sm mb-2">Your Guess</p>
        <motion.div
          key={userGuess}
          initial={{ scale: 1.2, color: '#60A5FA' }}
          animate={{ scale: 1, color: '#FFFFFF' }}
          className="text-6xl font-bold text-white mb-2"
        >
          {userGuess.toLocaleString()}
        </motion.div>
        <p className="text-white/70 text-xl">books</p>
      </div>

      {/* Slider */}
      <div className="mb-8 px-4">
        <input
          type="range"
          min="1"
          max="9"
          step="0.1"
          value={sliderValue}
          onChange={handleSliderChange}
          className="w-full h-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg appearance-none cursor-pointer slider-thumb"
          style={{
            background: `linear-gradient(to right, #3B82F6 0%, #9333EA 100%)`
          }}
        />

        {/* Scale Markers */}
        <div className="flex justify-between text-white/60 text-xs mt-2 px-1">
          <span>10</span>
          <span>100</span>
          <span>1K</span>
          <span>10K</span>
          <span>100K</span>
          <span>1M</span>
          <span>10M</span>
          <span>100M</span>
          <span>1B</span>
        </div>
      </div>

      <div className="bg-yellow-900/30 border border-yellow-400 rounded-lg p-4 mb-8">
        <p className="text-white/90 text-sm">
          💡 <strong className="text-white">Tip:</strong> A typical book has about 80,000 words. GPT-5 was trained on approximately <strong className="text-yellow-300">114 trillion tokens</strong> (about 85.5 trillion words).
        </p>
      </div>

      <Button
        onClick={handleSubmitGuess}
        disabled={!userGuess}
        className="w-full max-w-md mx-auto bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700 text-white py-6 text-xl rounded-xl"
      >
        Submit My Guess
      </Button>
    </motion.div>
  );

  // Reveal Screen
  const renderReveal = () => {
    const feedback = getFeedback();

    return (
      <motion.div
        key="reveal"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center max-w-4xl mx-auto"
      >
        <h2 className="text-3xl font-bold text-white mb-8">
          The Answer...
        </h2>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* User's Guess */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-gray-800/50 border-2 border-blue-400 rounded-xl p-6"
          >
            <div className="flex items-center gap-3 mb-3 justify-center">
              <Target className="w-6 h-6 text-blue-400" />
              <h3 className="text-lg font-semibold text-white">Your Guess</h3>
            </div>
            <div className="text-5xl font-bold text-white mb-2">
              {userGuess.toLocaleString()}
            </div>
            <div className="text-white/70 text-lg">books</div>
          </motion.div>

          {/* Actual Answer */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-gray-800/50 border-2 border-green-400 rounded-xl p-6"
          >
            <div className="flex items-center gap-3 mb-3 justify-center">
              <BookOpen className="w-6 h-6 text-green-400" />
              <h3 className="text-lg font-semibold text-white">Actual Amount</h3>
            </div>
            <motion.div
              initial={{ scale: 1.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.5, type: "spring" }}
              className="text-5xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent mb-2"
            >
              1.14 billion
            </motion.div>
            <div className="text-white/70 text-sm mb-1">({ACTUAL_BOOKS.toLocaleString()} books)</div>
            <div className="text-white/70 text-lg">That's one billion, one hundred forty million books!</div>
          </motion.div>
        </div>

        {/* Feedback */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-gradient-to-r from-purple-900/40 to-blue-900/40 border-2 border-purple-400 rounded-xl p-6 mb-8"
        >
          <p className={`text-4xl mb-2 ${feedback.color} font-bold`}>
            {feedback.emoji} {feedback.text}
          </p>
          <p className="text-white text-lg">
            You were <strong className="text-yellow-300">{Math.round(percentageOff)}%</strong> off from the actual number.
          </p>
        </motion.div>

        {/* Context */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="bg-blue-900/30 border border-blue-400 rounded-lg p-6 mb-8"
        >
          <h3 className="text-xl font-bold text-white mb-3">📚 To Put That in Perspective...</h3>
          <p className="text-white text-lg mb-2">
            <strong className="text-blue-300">1.14 billion books</strong> is approximately:
          </p>
          <div className="text-white/90">
            <p>• Every book in <strong className="text-white">11,400 large public libraries</strong></p>
            <p>• The complete works of <strong className="text-white">5.7 million authors</strong></p>
            <p>• Enough to read <strong className="text-white">one book a day for 3.1 million years!</strong></p>
          </div>
        </motion.div>

        <Button
          onClick={() => setStage('comparisons')}
          className="w-full max-w-md mx-auto bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white py-6 text-xl rounded-xl"
        >
          See Teen-Friendly Comparisons
        </Button>
      </motion.div>
    );
  };

  // Teen Comparisons Screen
  const renderComparisons = () => (
    <motion.div
      key="comparisons"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-5xl mx-auto"
    >
      <h2 className="text-3xl font-bold text-white mb-8 text-center">
        In Social Media Terms...
      </h2>

      <div className="grid md:grid-cols-2 gap-6 mb-8">
        {teenComparisons.map((comparison, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            className="bg-gray-800/50 border-2 border-purple-400 rounded-xl p-6"
          >
            <div className="text-5xl mb-3 text-center">{comparison.icon}</div>
            <h3 className="text-xl font-bold text-white mb-2 text-center">{comparison.title}</h3>
            <p className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2 text-center">
              {comparison.amount}
            </p>
            <p className="text-white/80 text-sm text-center">{comparison.description}</p>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-gradient-to-r from-yellow-900/30 to-orange-900/30 border-2 border-yellow-400 rounded-xl p-6 mb-8"
      >
        <h3 className="text-xl font-bold text-white mb-3 text-center">🤯 The Bottom Line</h3>
        <p className="text-white text-lg text-center">
          GPT-5 was trained on an <strong className="text-yellow-300">absolutely massive</strong> amount of text from the internet.
          That's why it can answer questions on almost any topic—but also why it's important to fact-check its answers!
        </p>
      </motion.div>

      <div className="flex justify-center">
        <Button
          onClick={() => setStage('sources')}
          className="w-full max-w-md bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white py-6 text-xl rounded-xl text-center"
        >
          Where Did All This Data Come From?
        </Button>
      </div>
    </motion.div>
  );

  // Data Sources Screen
  const renderSources = () => (
    <motion.div
      key="sources"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-5xl mx-auto"
    >
      <h2 className="text-3xl font-bold text-white mb-8 text-center">
        What's in the Training Data?
      </h2>

      {/* Horizontal Stacked Bar Visualization */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gray-800/50 border-2 border-white/20 rounded-xl p-8 mb-8"
      >
        <h3 className="text-2xl font-bold text-white mb-6 text-center">
          Training Data Breakdown
        </h3>

        {/* Icons and Labels Row */}
        <div className="flex mb-4">
          {dataSources.map((source, index) => (
            <motion.div
              key={`label-${index}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: index * 0.1 }}
              style={{ width: `${source.percentage}%` }}
              className="flex flex-col items-center px-1"
            >
              <div className={`bg-gradient-to-r ${source.color} p-2 rounded-lg mb-2`}>
                <source.icon className="w-4 h-4 text-white" />
              </div>
              <p className="text-white text-xs font-bold mb-1">{source.percentage}%</p>
              <p className="text-white/70 text-xs text-center leading-tight">{source.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Stacked Bar */}
        <div className="flex h-12 rounded-full overflow-hidden shadow-lg mb-6">
          {dataSources.map((source, index) => (
            <motion.div
              key={`bar-${index}`}
              initial={{ width: 0 }}
              animate={{ width: `${source.percentage}%` }}
              transition={{ duration: 1, delay: index * 0.1 + 0.3 }}
              className={`bg-gradient-to-r ${source.color} relative group cursor-pointer`}
              title={source.examples}
            >
              {/* Tooltip on hover */}
              <div className="absolute -top-24 left-1/2 transform -translate-x-1/2
                              bg-gray-900 text-white p-3 rounded-lg opacity-0
                              group-hover:opacity-100 transition-opacity pointer-events-none
                              whitespace-nowrap z-10 border border-white/20">
                <p className="font-semibold text-sm mb-1">{source.label}</p>
                <p className="text-xs text-gray-300">{source.examples}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Legend Below */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 text-center">
          {dataSources.map((source, index) => (
            <div key={`legend-${index}`} className="flex flex-col items-center gap-1">
              <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${source.color}`}></div>
              <span className="text-white/90 text-xs">{source.label}</span>
              <span className="text-white/60 text-xs italic">{source.examples}</span>
            </div>
          ))}
        </div>
      </motion.div>

      <div className="space-y-4 mb-8">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="bg-yellow-900/30 border-2 border-yellow-400 rounded-xl p-6"
        >
          <h3 className="text-lg font-semibold text-white mb-3">⚡ Interesting Facts:</h3>
          <ul className="space-y-2 text-white/90">
            <li>• Training data includes text in over <strong className="text-white">100 languages</strong></li>
            <li>• Millions of cooking recipes from around the world</li>
            <li>• Scientific papers from the last 100+ years</li>
            <li>• Even movie scripts and song lyrics!</li>
          </ul>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="bg-red-900/30 border-2 border-red-400 rounded-xl p-6"
        >
          <h3 className="text-lg font-semibold text-white mb-3">⚠️ Important Reminder:</h3>
          <p className="text-white/90">
            Not all data is perfect! Training data can include <strong className="text-white">mistakes, biases, and outdated information</strong>.
            That's why we always need to think critically and verify AI outputs!
          </p>
        </motion.div>
      </div>

      <div className="flex justify-center">
        <Button
          onClick={onComplete}
          className="w-full max-w-md bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white py-6 text-xl rounded-xl text-center"
        >
          Continue to Next Activity
        </Button>
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-6 flex items-center justify-center">
      <div className="w-full max-w-5xl bg-white/10 backdrop-blur-lg rounded-2xl p-8 border-2 border-white/20">
        <AnimatePresence mode="wait">
          {stage === 'intro' && renderIntro()}
          {stage === 'guess' && renderGuess()}
          {stage === 'reveal' && renderReveal()}
          {stage === 'comparisons' && renderComparisons()}
          {stage === 'sources' && renderSources()}
        </AnimatePresence>
      </div>

      {/* Custom slider styles */}
      <style>{`
        .slider-thumb::-webkit-slider-thumb {
          appearance: none;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: linear-gradient(135deg, #60A5FA 0%, #A78BFA 100%);
          cursor: pointer;
          border: 3px solid white;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
        }

        .slider-thumb::-moz-range-thumb {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: linear-gradient(135deg, #60A5FA 0%, #A78BFA 100%);
          cursor: pointer;
          border: 3px solid white;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
        }
      `}</style>
    </div>
  );
}
