import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Network, AlertCircle, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Props {
  onComplete: () => void;
}

export default function WhyPredictionIsntEnough({ onComplete }: Props) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-4xl w-full"
      >
        {/* Main Content Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/10 backdrop-blur-md rounded-2xl p-8 md:p-12 border-2 border-white/20"
        >
          {/* Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.4, type: "spring", stiffness: 200 }}
            className="flex justify-center mb-6"
          >
            <div className="bg-orange-900/40 p-4 rounded-full">
              <AlertCircle className="h-12 w-12 text-orange-400" />
            </div>
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-3xl md:text-4xl font-bold text-white text-center mb-8"
          >
            Why Simple Predictions Aren't Enough
          </motion.h1>

          {/* Problem Statement */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-red-900/40 border-2 border-red-400 rounded-xl p-6 mb-8"
          >
            <p className="text-white/90 text-lg leading-relaxed">
              Looking at just one letter (or even one word) doesn't give the AI enough{' '}
              <span className="font-bold text-red-300">context</span> to make good predictions.
            </p>
            <p className="text-white/70 text-base mt-3">
              It needs to understand what "it" refers to in a sentence, remember what was said earlier, and grasp the bigger picture.
            </p>
          </motion.div>

          {/* Solution */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.8 }}
            className="bg-gradient-to-br from-blue-500/20 to-purple-500/20 border-2 border-blue-400 rounded-xl p-6 mb-8"
          >
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 mt-1">
                <Network className="h-8 w-8 text-blue-400" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white mb-3">
                  The Solution: Neural Networks
                </h2>
                <p className="text-white/90 text-lg leading-relaxed mb-3">
                  To understand context and make smarter connections, LLMs use a powerful tool called a{' '}
                  <span className="font-bold text-blue-300">neural network</span>.
                </p>
                <p className="text-white/80 text-base">
                  Think of it as a massive "pattern-finding web" that helps the AI make much more sophisticated predictions by looking at longer sequences and understanding relationships between words.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Key Insight */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0 }}
            className="flex items-center justify-center gap-3 mb-8"
          >
            <Zap className="h-6 w-6 text-yellow-400" />
            <p className="text-white/90 text-lg italic">
              More context = Better predictions = More useful AI
            </p>
            <Zap className="h-6 w-6 text-yellow-400" />
          </motion.div>

          {/* Continue Button */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="text-center"
          >
            <Button
              onClick={onComplete}
              className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white px-8 py-6 text-lg rounded-xl"
            >
              Let's See How Neural Networks Work
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </motion.div>
        </motion.div>

        {/* Bottom hint */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4 }}
          className="text-white/60 text-center mt-6 text-sm"
        >
          Up next: A video explaining how neural networks provide context
        </motion.p>
      </motion.div>
    </div>
  );
}
