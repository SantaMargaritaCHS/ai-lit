import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Layers, RefreshCw, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Props {
  onComplete: () => void;
}

interface ConceptCard {
  icon: React.ReactNode;
  title: string;
  description: string;
  color: string;
  delay: number;
}

export default function WeavingItTogether({ onComplete }: Props) {
  const concepts: ConceptCard[] = [
    {
      icon: <Layers className="h-8 w-8" />,
      title: "1. Tokenization",
      description: "Instead of letters, the AI 'sees' text broken into tokens (pieces of words). This helps it understand word roots and build new words it hasn't seen before.",
      color: "from-blue-500 to-cyan-500",
      delay: 0.4
    },
    {
      icon: <RefreshCw className="h-8 w-8" />,
      title: "2. Training Loop",
      description: "The AI 'learns' by adjusting its web of connections over and over—billions of times! Predict → compare → adjust → repeat.",
      color: "from-purple-500 to-pink-500",
      delay: 0.6
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: "3. Human Tuning",
      description: "Finally, humans help fine-tune the AI's responses to make sure it produces reasonable, helpful, and safe results in all kinds of situations.",
      color: "from-orange-500 to-amber-500",
      delay: 0.8
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-5xl w-full"
      >
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Weaving It All Together
          </h1>
          <p className="text-xl text-white/80 max-w-2xl mx-auto">
            That video covered three big ideas that make LLMs work. Let's break them down:
          </p>
        </motion.div>

        {/* Concept Cards */}
        <div className="space-y-6 mb-12">
          {concepts.map((concept) => (
            <motion.div
              key={concept.title}
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: concept.delay, type: "spring", stiffness: 100 }}
              className="group"
            >
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border-2 border-white/20 hover:border-white/40 transition-all duration-300">
                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <div className={`flex-shrink-0 bg-gradient-to-br ${concept.color} p-4 rounded-xl text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    {concept.icon}
                  </div>

                  {/* Content */}
                  <div className="flex-grow">
                    <h2 className="text-2xl font-bold text-white mb-3">
                      {concept.title}
                    </h2>
                    <p className="text-white/80 text-lg leading-relaxed">
                      {concept.description}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0 }}
          className="bg-gradient-to-br from-indigo-900/40 to-purple-900/40 backdrop-blur-md rounded-xl p-6 border-2 border-indigo-400 mb-8"
        >
          <p className="text-white/90 text-lg leading-relaxed text-center">
            <span className="font-bold text-indigo-300">Put it all together:</span> Tokens give the AI building blocks, the training loop helps it learn patterns, and human tuning makes sure it's helpful and safe.
          </p>
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
            Explore These Ideas Hands-On
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </motion.div>

        {/* Bottom hint */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4 }}
          className="text-white/60 text-center mt-6 text-sm"
        >
          Next: Interactive activities to dive deeper into these concepts
        </motion.p>
      </motion.div>
    </div>
  );
}
