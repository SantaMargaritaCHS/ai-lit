import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ThumbsUp, Users, Shield, Brain, AlertTriangle, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Props {
  onComplete: () => void;
}

interface ApproachCard {
  id: string;
  company: string;
  title: string;
  icon: React.ReactNode;
  logoUrl?: string;
  color: string;
  bgGradient: string;
  shortDesc: string;
  combinedDesc: string;
  challenge: string;
}

export default function HumanTuningApproaches({ onComplete }: Props) {
  const [expandedCard, setExpandedCard] = useState<string | null>(null);

  const approaches: ApproachCard[] = [
    {
      id: 'user-feedback',
      company: 'ChatGPT',
      title: 'Direct User Feedback',
      icon: <ThumbsUp className="h-8 w-8" />,
      logoUrl: '/logos/chatgpt-logo.svg',
      color: 'text-green-400',
      bgGradient: 'from-green-800 to-emerald-900',
      shortDesc: 'You help train it with thumbs up/down',
      combinedDesc: 'When you click 👍 or 👎 in ChatGPT, you\'re directly training the AI. Your feedback teaches it which responses are helpful—like upvoting a great essay intro, which reinforces that pattern for future users.',
      challenge: 'Popular doesn\'t always mean correct! Sometimes wrong but confident-sounding answers get upvotes.'
    },
    {
      id: 'review-teams',
      company: 'Most Companies',
      title: 'Professional Review Teams',
      icon: <Users className="h-8 w-8" />,
      color: 'text-blue-400',
      bgGradient: 'from-blue-800 to-cyan-900',
      shortDesc: 'Trained humans rate AI outputs',
      combinedDesc: 'Companies hire teams to read thousands of AI responses and rate them for accuracy, safety, and helpfulness. For example, reviewers rate cake-baking instructions on accuracy, safety, and completeness—this judgment shapes how AI responds.',
      challenge: 'Human reviewers bring their own biases. What seems "normal" to reviewers becomes the AI\'s default.'
    },
    {
      id: 'constitutional',
      company: 'Claude (Anthropic)',
      title: 'Constitutional AI',
      icon: <Shield className="h-8 w-8" />,
      logoUrl: '/logos/claude-logo.svg',
      color: 'text-purple-400',
      bgGradient: 'from-purple-800 to-pink-900',
      shortDesc: 'AI helps train itself using principles',
      combinedDesc: 'The AI is given a set of principles (a "constitution") and learns to critique itself. If it generates "Here\'s how to hack...", it checks if that violates the "be helpful but harmless" principle, then revises to "I can explain cybersecurity ethically instead."',
      challenge: 'Complex to implement, and the principles themselves reflect human choices about what\'s "right."'
    },
    {
      id: 'reinforcement',
      company: 'DeepMind & Others',
      title: 'Reinforcement Learning',
      icon: <Brain className="h-8 w-8" />,
      color: 'text-orange-400',
      bgGradient: 'from-orange-800 to-amber-900',
      shortDesc: 'Learning through trial and error rewards',
      combinedDesc: 'The AI tries different responses and gets "rewards" for good ones, "penalties" for bad ones. For math problems: correct answer gets reward points, showing work gets extra reward. Over millions of attempts, it learns what works best.',
      challenge: 'Defining what deserves a "reward" is subjective. The AI might find unexpected ways to maximize rewards!'
    }
  ];

  const handleCardClick = (id: string) => {
    setExpandedCard(expandedCard === id ? null : id);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-6"
        >
          <Shield className="w-14 h-14 text-purple-400 mx-auto mb-3" />
          <h1 className="text-3xl font-bold text-white mb-3">
            Making AI "Reasonable": Human Tuning
          </h1>
          <p className="text-white/80 text-lg">
            Companies use different approaches to guide AI behavior
          </p>
        </motion.div>

        {/* Compact Context Box */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-purple-900/30 border border-purple-400 rounded-lg p-4 mb-8 max-w-4xl mx-auto"
        >
          <p className="text-white text-center">
            Without human guidance, AI might generate harmful content, give wrong answers, or reflect biases.
            Even with tuning, <strong className="text-yellow-300">"you're always responsible for checking its work."</strong>
          </p>
        </motion.div>

        {/* Cards Grid with Inline Expansion */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {approaches.map((approach, index) => (
            <motion.div
              key={approach.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className="flex flex-col"
            >
              {/* Card Header */}
              <button
                onClick={() => handleCardClick(approach.id)}
                className={`w-full text-left transition-all duration-300 ${
                  expandedCard === approach.id ? 'ring-4 ring-yellow-400' : ''
                }`}
              >
                <div className={`bg-gradient-to-br ${approach.bgGradient} rounded-xl p-6 border-2 border-white/30 hover:border-white/50`}>
                  <div className="flex items-start justify-between mb-3">
                    <div className="text-white">
                      {approach.logoUrl ? (
                        <img src={approach.logoUrl} alt={`${approach.company} logo`} className="h-10 w-10 object-contain" />
                      ) : (
                        approach.icon
                      )}
                    </div>
                    <span className="text-white text-xs font-semibold bg-white/20 px-2 py-1 rounded">
                      {approach.company}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">
                    {approach.title}
                  </h3>
                  <p className="text-white mb-3">
                    {approach.shortDesc}
                  </p>
                  <div className="flex items-center justify-between text-white">
                    <span className="text-sm">
                      {expandedCard === approach.id ? 'Click to collapse' : 'Click to learn more'}
                    </span>
                    {expandedCard === approach.id ? (
                      <ChevronUp className="w-5 h-5" />
                    ) : (
                      <ChevronDown className="w-5 h-5" />
                    )}
                  </div>
                </div>
              </button>

              {/* Inline Expanded Content */}
              <AnimatePresence>
                {expandedCard === approach.id && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="bg-white/10 backdrop-blur-md rounded-b-xl p-6 border-2 border-t-0 border-white/20 mt-[-12px]">
                      <div className="space-y-4">
                        {/* Combined Description */}
                        <div>
                          <h4 className="text-white font-semibold mb-2 flex items-center gap-2">
                            📝 How It Works
                          </h4>
                          <p className="text-white/90 text-sm leading-relaxed">
                            {approach.combinedDesc}
                          </p>
                        </div>

                        {/* Challenge */}
                        <div className="bg-red-900/30 border border-red-400 rounded-lg p-3">
                          <h4 className="text-white font-semibold mb-2 flex items-center gap-2">
                            <AlertTriangle className="w-4 h-4 text-red-400" />
                            The Challenge
                          </h4>
                          <p className="text-white/90 text-sm">
                            {approach.challenge}
                          </p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        {/* Compressed Bias Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="bg-yellow-900/20 border border-yellow-600 rounded-lg p-4 mb-8 max-w-4xl mx-auto"
        >
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="w-5 h-5 text-yellow-400" />
            <h3 className="text-lg font-bold text-white">The Challenge: Human Bias</h3>
          </div>
          <p className="text-white text-sm">
            All tuning approaches have a problem: <strong className="text-yellow-300">humans do the tuning</strong>, bringing their own biases.
            What's "normal" to reviewers becomes the AI's default.
            This is why <strong className="text-yellow-300">you're the one in control.</strong>
          </p>
        </motion.div>

        {/* Continue Button */}
        <div className="text-center">
          <Button
            onClick={onComplete}
            className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white px-10 py-6 text-lg rounded-xl"
          >
            Continue
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
