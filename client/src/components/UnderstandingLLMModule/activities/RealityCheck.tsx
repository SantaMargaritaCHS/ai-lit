// RealityCheck.tsx - De-anthropomorphization interstitial after video segments

import React from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, Brain, Cpu } from 'lucide-react';

interface Props {
  onComplete: () => void;
  segment?: 'core-concepts' | 'training' | 'neural-networks';
}

export default function RealityCheck({ onComplete, segment = 'core-concepts' }: Props) {
  const content = {
    'core-concepts': {
      title: "Let's Clarify What We Mean",
      icon: Brain,
      points: [
        {
          video: 'The video said LLMs "understand" language',
          reality: 'Actually, they process and match patterns from training data'
        },
        {
          video: '"Learn" from text',
          reality: 'They adjust statistical weights based on training examples'
        },
        {
          video: '"Human-like language"',
          reality: 'They generate statistically likely text sequences'
        }
      ],
      summary: 'LLMs are powerful pattern-matching systems, not thinking entities. They calculate probabilities, not meanings.'
    },
    'training': {
      title: "Training Doesn't Mean Thinking",
      icon: Cpu,
      points: [
        {
          video: 'Models "learn" patterns',
          reality: 'They optimize mathematical functions through repeated examples'
        },
        {
          video: '"Develop understanding"',
          reality: 'They build statistical correlations between tokens'
        },
        {
          video: '"Knowledge" from diverse sources',
          reality: 'They store probability distributions calculated from text'
        }
      ],
      summary: 'Training is a mathematical optimization process, not learning like humans do. There\'s no comprehension happening.'
    },
    'neural-networks': {
      title: "Networks Calculate, They Don't Think",
      icon: AlertCircle,
      points: [
        {
          video: 'Networks "analyze" input',
          reality: 'They run mathematical operations on numerical representations'
        },
        {
          video: '"Learned complex patterns"',
          reality: 'They adjusted billions of numerical parameters during training'
        },
        {
          video: '"Understand context"',
          reality: 'They calculate conditional probabilities based on token sequences'
        }
      ],
      summary: 'Neural networks are mathematical systems processing numbers. Every "understanding" is actually probability calculation.'
    }
  };

  const { title, icon: Icon, points, summary } = content[segment];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto"
    >
      <div className="bg-gradient-to-br from-orange-900/40 to-red-900/40 backdrop-blur-lg rounded-xl p-8 border-2 border-orange-500/50">
        {/* Header */}
        <div className="text-center mb-6">
          <Icon className="w-12 h-12 text-orange-400 mx-auto mb-3" />
          <h2 className="text-2xl font-bold text-white mb-2">
            🔍 Reality Check
          </h2>
          <h3 className="text-xl text-white">
            {title}
          </h3>
        </div>

        {/* Clarifications */}
        <div className="space-y-4 mb-6">
          {points.map((point, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-gray-900/50 rounded-lg p-4"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-red-300 text-sm font-medium mb-1">❌ Video Language:</p>
                  <p className="text-white italic">"{point.video}"</p>
                </div>
                <div>
                  <p className="text-green-300 text-sm font-medium mb-1">✅ What's Really Happening:</p>
                  <p className="text-white">{point.reality}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Summary */}
        <div className="bg-orange-900/30 border border-orange-500/30 rounded-lg p-4 mb-6">
          <p className="text-white font-medium text-center">
            💡 {summary}
          </p>
        </div>

        {/* Educational Note */}
        <div className="bg-blue-900/40 border border-blue-500/30 rounded-lg p-4 mb-6">
          <p className="text-white text-sm">
            <strong>Why This Matters:</strong> Using words like "understand," "think," or "know" for AI systems can make us forget they're just sophisticated calculators. This leads to over-trusting their outputs or feeling like they're intelligent beings. They're powerful tools—but they're tools, not thinking entities.
          </p>
        </div>

        {/* Continue Button */}
        <button
          onClick={onComplete}
          className="w-full bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white py-3 rounded-lg font-medium transition-all shadow-lg hover:shadow-xl"
        >
          Got It - Continue Learning →
        </button>
      </div>
    </motion.div>
  );
}
