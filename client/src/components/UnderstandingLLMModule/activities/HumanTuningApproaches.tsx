import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ThumbsUp, ThumbsDown, Users, Shield, Brain, AlertTriangle, ChevronRight, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Props {
  onComplete: () => void;
}

interface ApproachCard {
  id: string;
  company: string;
  title: string;
  icon: React.ReactNode;
  logoUrl?: string; // Optional logo image URL
  color: string;
  bgGradient: string;
  shortDesc: string;
  fullDesc: string;
  example: string;
  challenge: string;
}

export default function HumanTuningApproaches({ onComplete }: Props) {
  const [selectedCard, setSelectedCard] = useState<string | null>(null);
  const [showIntro, setShowIntro] = useState(true);

  const approaches: ApproachCard[] = [
    {
      id: 'user-feedback',
      company: 'ChatGPT',
      title: 'Direct User Feedback',
      icon: <ThumbsUp className="h-8 w-8" />,
      logoUrl: '/logos/chatgpt-logo.svg',
      color: 'text-green-400',
      bgGradient: 'from-green-500 to-emerald-500',
      shortDesc: 'You help train it with thumbs up/down',
      fullDesc: 'When you click those thumbs up or thumbs down buttons in ChatGPT, you\'re directly helping train the AI. Your feedback teaches it which responses are helpful and which aren\'t.',
      example: 'You ask: "Help me write an essay introduction"\nAI gives a great response → You click 👍\nThis reinforces that response pattern for future users.',
      challenge: 'Popular doesn\'t always mean correct! Sometimes wrong but confident-sounding answers get upvotes.'
    },
    {
      id: 'review-teams',
      company: 'Most Companies',
      title: 'Professional Review Teams',
      icon: <Users className="h-8 w-8" />,
      color: 'text-blue-400',
      bgGradient: 'from-blue-500 to-cyan-500',
      shortDesc: 'Trained humans rate AI outputs',
      fullDesc: 'Companies hire teams of reviewers to read thousands of AI responses and rate them for accuracy, safety, and helpfulness. This human judgment shapes how the AI responds.',
      example: 'Reviewers see: "How to make a cake"\nThey rate responses on:\n• Accuracy of instructions\n• Safety (no dangerous shortcuts)\n• Completeness of answer',
      challenge: 'Human reviewers bring their own biases. What seems "normal" to reviewers becomes the AI\'s default.'
    },
    {
      id: 'constitutional',
      company: 'Claude (Anthropic)',
      title: 'Constitutional AI',
      icon: <Shield className="h-8 w-8" />,
      logoUrl: '/logos/claude-logo.svg',
      color: 'text-purple-400',
      bgGradient: 'from-purple-500 to-pink-500',
      shortDesc: 'AI helps train itself using principles',
      fullDesc: 'Instead of just human feedback, the AI is given a set of principles (a "constitution") and learns to critique and improve its own responses based on these rules.',
      example: 'AI generates: "Here\'s how to hack..."\nAI checks: "Does this violate the \'be helpful but harmless\' principle?"\nAI revises: "I can\'t help with that, but I can explain cybersecurity ethically..."',
      challenge: 'Complex to implement and the principles themselves reflect human choices about what\'s "right."'
    },
    {
      id: 'reinforcement',
      company: 'DeepMind & Others',
      title: 'Reinforcement Learning',
      icon: <Brain className="h-8 w-8" />,
      color: 'text-orange-400',
      bgGradient: 'from-orange-500 to-amber-500',
      shortDesc: 'Learning through trial and error rewards',
      fullDesc: 'The AI tries different responses and gets "rewards" for good ones and "penalties" for bad ones. Over millions of attempts, it learns what works.',
      example: 'Task: Answer a math problem\n✓ Correct answer → Reward points\n✗ Wrong answer → No reward\n✗ Showed work → Extra reward\nAI learns: Show work + correct = best',
      challenge: 'Defining what deserves a "reward" is subjective. The AI might find unexpected ways to maximize rewards!'
    }
  ];

  const handleCardClick = (id: string) => {
    setSelectedCard(id === selectedCard ? null : id);
  };

  if (showIntro) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl w-full"
        >
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border-2 border-white/20">
            <div className="text-center mb-8">
              <Shield className="w-16 h-16 text-purple-400 mx-auto mb-4" />
              <h1 className="text-3xl font-bold text-white mb-4">
                Making AI "Reasonable": Human Tuning
              </h1>
              <div className="bg-blue-900/30 border border-blue-400 rounded-lg p-4 max-w-3xl mx-auto mb-6">
                <p className="text-white text-lg">
                  Remember the video said that <strong className="text-yellow-300">"a system of this complexity needs a lot of human tuning"</strong> to produce reasonable results and protect against problems?
                </p>
              </div>
            </div>

            <div className="bg-purple-900/30 border border-purple-400 rounded-lg p-6 mb-6">
              <h3 className="text-xl font-semibold text-white mb-4">
                Why Prediction Alone Isn't Enough
              </h3>
              <div className="space-y-3 text-white">
                <p>
                  The AI is <strong className="text-yellow-300">"just using random probabilities to choose words"</strong>—it doesn't actually understand right from wrong.
                </p>
                <p>
                  Without human guidance, it might:
                </p>
                <ul className="ml-6 space-y-2">
                  <li>• Generate harmful or biased content (learned from internet data)</li>
                  <li>• Give confident but completely wrong answers</li>
                  <li>• Help with dangerous requests</li>
                  <li>• Reflect the worst parts of its training data</li>
                </ul>
              </div>
            </div>

            <div className="bg-yellow-900/20 border border-yellow-600 rounded-lg p-4 mb-6">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-6 h-6 text-yellow-400 flex-shrink-0 mt-1" />
                <p className="text-white">
                  <strong>Key Point:</strong> Even with all this tuning, remember what the video said—<strong className="text-yellow-300">"you are always responsible for checking its work."</strong> Human tuning helps, but can't make AI perfect.
                </p>
              </div>
            </div>

            <Button
              onClick={() => setShowIntro(false)}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white py-6 text-lg rounded-xl"
            >
              Explore How Companies Tackle This
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl font-bold text-white mb-2">
            How Different Companies Add Human Guidance
          </h1>
          <p className="text-white">
            Click each approach to learn more
          </p>
        </motion.div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {approaches.map((approach, index) => (
            <motion.div
              key={approach.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
            >
              <button
                onClick={() => handleCardClick(approach.id)}
                className={`w-full text-left transition-all duration-300 ${
                  selectedCard === approach.id ? 'ring-4 ring-yellow-400' : ''
                }`}
              >
                <div className={`bg-gradient-to-br ${approach.bgGradient} rounded-xl p-6 h-full border-2 border-white/30 hover:border-white/50`}>
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
                  <div className="flex items-center text-white">
                    <span className="text-sm">Learn more</span>
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </div>
                </div>
              </button>
            </motion.div>
          ))}
        </div>

        {/* Detail Panel */}
        <AnimatePresence mode="wait">
          {selectedCard && (
            <motion.div
              key={selectedCard}
              initial={{ opacity: 0, y: 20, height: 0 }}
              animate={{ opacity: 1, y: 0, height: "auto" }}
              exit={{ opacity: 0, y: -20, height: 0 }}
              className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border-2 border-white/20 mb-8"
            >
              {(() => {
                const approach = approaches.find(a => a.id === selectedCard)!;
                return (
                  <>
                    <div className="flex justify-between items-start mb-6">
                      <div className="flex items-center gap-3">
                        <div className={`bg-gradient-to-br ${approach.bgGradient} p-3 rounded-xl`}>
                          <div className="text-white">
                            {approach.logoUrl ? (
                              <img src={approach.logoUrl} alt={`${approach.company} logo`} className="h-12 w-12 object-contain" />
                            ) : (
                              approach.icon
                            )}
                          </div>
                        </div>
                        <div>
                          <p className="text-white text-sm">{approach.company}</p>
                          <h3 className="text-2xl font-bold text-white">{approach.title}</h3>
                        </div>
                      </div>
                      <button
                        onClick={() => setSelectedCard(null)}
                        className="text-white/60 hover:text-white transition-colors"
                      >
                        <X className="w-6 h-6" />
                      </button>
                    </div>

                    <p className="text-white mb-6 text-lg">
                      {approach.fullDesc}
                    </p>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="bg-blue-900/30 border border-blue-400 rounded-lg p-4">
                        <h4 className="text-white font-semibold mb-2">📝 How It Works:</h4>
                        <p className="text-white text-sm font-mono whitespace-pre-line">
                          {approach.example}
                        </p>
                      </div>

                      <div className="bg-red-900/30 border border-red-400 rounded-lg p-4">
                        <h4 className="text-white font-semibold mb-2">⚠️ The Challenge:</h4>
                        <p className="text-white text-sm">
                          {approach.challenge}
                        </p>
                      </div>
                    </div>
                  </>
                );
              })()}
            </motion.div>
          )}
        </AnimatePresence>

        {/* The Bias Problem Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="bg-yellow-900/20 border border-yellow-600 rounded-xl p-6 mb-8"
        >
          <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <AlertTriangle className="w-6 h-6 text-yellow-400" />
            The Ongoing Challenge: Bias
          </h3>
          <div className="space-y-3 text-white">
            <p>
              All these approaches share a fundamental problem: <strong className="text-yellow-300">humans are doing the tuning</strong>, and humans have biases.
            </p>
            <ul className="ml-6 space-y-2">
              <li>• If reviewers think something is "normal," the AI learns that as default</li>
              <li>• Cultural assumptions get baked into the "rewards" and "principles"</li>
              <li>• What's considered "safe" or "appropriate" varies by who's deciding</li>
            </ul>
            <p className="mt-4">
              This is why diverse teams and constant vigilance matter—and why <strong className="text-yellow-300">"you're the one in control"</strong> remains so important.
            </p>
          </div>
        </motion.div>

        {/* Final Message & Continue */}
        <div className="text-center">
          <p className="text-white mb-6">
            Remember: Even with all this human tuning, it's still <strong className="text-yellow-300">"just using probabilities to choose words."</strong>
          </p>
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