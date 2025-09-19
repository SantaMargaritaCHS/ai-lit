import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, Lightbulb, Calculator, Sparkles, AlertCircle, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface WhatAIIsNotActivityProps {
  onComplete: () => void;
}

interface MisconceptionCard {
  id: string;
  title: string;
  misconception: string;
  reality: string;
  icon: React.ReactNode;
  color: string;
}

const WhatAIIsNotActivity: React.FC<WhatAIIsNotActivityProps> = ({ onComplete }) => {
  const [flippedCards, setFlippedCards] = useState<Set<string>>(new Set());
  const [allFlipped, setAllFlipped] = useState(false);

  const misconceptions: MisconceptionCard[] = [
    {
      id: 'conscious',
      title: 'AI is Conscious',
      misconception: 'AI has thoughts, feelings, and self-awareness like humans',
      reality: 'AI is sophisticated pattern matching software. It processes data and identifies patterns but has no consciousness.',
      icon: <Brain className="w-6 h-6" />,
      color: 'from-purple-500 to-pink-500'
    },
    {
      id: 'understand',
      title: 'AI Understands',
      misconception: 'AI comprehends meaning and context like humans do',
      reality: 'AI recognizes patterns in text and data but doesn\'t truly understand meaning. It predicts likely responses based on training.',
      icon: <Lightbulb className="w-6 h-6" />,
      color: 'from-blue-500 to-cyan-500'
    },
    {
      id: 'infallible',
      title: 'AI is Always Right',
      misconception: 'AI provides perfect, error-free answers every time',
      reality: 'AI can make mistakes, generate false information, and reflect biases from training data. Always verify AI-generated content.',
      icon: <AlertCircle className="w-6 h-6" />,
      color: 'from-red-500 to-orange-500'
    },
    {
      id: 'calculator',
      title: 'AI is Just Math',
      misconception: 'AI is simply a very advanced calculator following fixed rules',
      reality: 'While AI uses math, it learns patterns from data rather than following pre-programmed rules. It can adapt and handle ambiguous situations.',
      icon: <Calculator className="w-6 h-6" />,
      color: 'from-green-500 to-emerald-500'
    },
    {
      id: 'creative',
      title: 'AI Can\'t Be Creative',
      misconception: 'AI can only copy and can\'t generate anything original',
      reality: 'AI can combine learned patterns in novel ways to create new content, though its creativity is based on recombining existing patterns.',
      icon: <Sparkles className="w-6 h-6" />,
      color: 'from-yellow-500 to-amber-500'
    },
    {
      id: 'replace',
      title: 'AI Will Replace Humans',
      misconception: 'AI will soon make human workers obsolete',
      reality: 'AI is a tool that enhances human capabilities. It excels at specific tasks but lacks human judgment, empathy, and general intelligence.',
      icon: <Brain className="w-6 h-6" />,
      color: 'from-indigo-500 to-purple-500'
    }
  ];

  const handleCardFlip = (cardId: string) => {
    const newFlipped = new Set(flippedCards);
    if (newFlipped.has(cardId)) {
      newFlipped.delete(cardId);
    } else {
      newFlipped.add(cardId);
    }
    setFlippedCards(newFlipped);
    
    // Check if all cards have been flipped at least once
    if (newFlipped.size === misconceptions.length && !allFlipped) {
      setAllFlipped(true);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-3">What AI is NOT</h2>
        <p className="text-lg text-gray-600">
          Click each card to reveal common misconceptions about AI
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
        {misconceptions.map((card) => (
          <motion.div
            key={card.id}
            className="relative h-72 cursor-pointer perspective-1000"
            onClick={() => handleCardFlip(card.id)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            style={{ transformStyle: 'preserve-3d' }}
          >
            <AnimatePresence mode="wait">
              {!flippedCards.has(card.id) ? (
                <motion.div
                  key="front"
                  className={`absolute inset-0 rounded-xl bg-gradient-to-br ${card.color} p-6 text-white shadow-xl`}
                  initial={{ rotateY: 0 }}
                  exit={{ rotateY: 90 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="flex flex-col items-center justify-center h-full text-center">
                    <div className="mb-4 bg-white/20 p-3 rounded-full">
                      {card.icon}
                    </div>
                    <h3 className="text-xl font-bold mb-2">{card.title}</h3>
                    <p className="text-sm opacity-90">Click to learn more</p>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="back"
                  className="absolute inset-0 rounded-xl bg-white border-2 border-gray-200 p-4 shadow-xl overflow-hidden"
                  initial={{ rotateY: -90 }}
                  animate={{ rotateY: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="flex flex-col h-full">
                    <div className="flex items-center mb-3">
                      <div className={`bg-gradient-to-br ${card.color} p-1.5 rounded-lg text-white mr-2 flex-shrink-0`}>
                        {card.icon}
                      </div>
                      <h3 className="text-base font-bold text-gray-900 leading-tight">{card.title}</h3>
                    </div>
                    
                    <div className="space-y-2 flex-1 min-h-0">
                      <div className="bg-red-50 border border-red-200 rounded-lg p-2">
                        <p className="text-xs font-medium text-red-900 mb-1">❌ Misconception:</p>
                        <p className="text-xs text-red-700 leading-tight">{card.misconception}</p>
                      </div>
                      
                      <div className="bg-green-50 border border-green-200 rounded-lg p-2">
                        <p className="text-xs font-medium text-green-900 mb-1">✓ Reality:</p>
                        <p className="text-xs text-green-700 leading-tight">{card.reality}</p>
                      </div>
                    </div>

                    <p className="text-xs text-gray-500 mt-2 text-center flex-shrink-0">Click to flip back</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>

      {allFlipped && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-6 mb-6">
            <h3 className="text-xl font-bold text-green-900 mb-2">
              Great job exploring AI misconceptions!
            </h3>
            <p className="text-green-700">
              Understanding what AI is NOT is just as important as understanding what it IS. 
              Remember: AI is a powerful tool, but it's not magic, conscious, or infallible.
            </p>
          </div>

          <Button
            onClick={onComplete}
            size="lg"
            className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold py-3 px-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
          >
            Continue to Final Questions
            <ChevronRight className="ml-2 h-5 w-5" />
          </Button>
        </motion.div>
      )}

      {!allFlipped && flippedCards.size > 0 && (
        <div className="text-center mt-4">
          <p className="text-gray-600">
            {misconceptions.length - flippedCards.size} more cards to explore
          </p>
        </div>
      )}
    </div>
  );
};

export default WhatAIIsNotActivity;