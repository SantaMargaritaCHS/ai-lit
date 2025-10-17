import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, Users, Filter, Lightbulb, ArrowRight, ChefHat } from 'lucide-react';

interface Props {
  onComplete: () => void;
}

export default function NeuralNetworkVisual({ onComplete }: Props) {
  const [stage, setStage] = useState<'intro' | 'analogy' | 'demo' | 'summary'>('intro');
  const [currentStep, setCurrentStep] = useState(0);

  const cookingSteps = [
    {
      title: "Ingredients (Input)",
      icon: "🥕",
      description: "Raw text goes in",
      detail: "Like ingredients in a recipe"
    },
    {
      title: "Prep Work (Layer 1)",
      icon: "🔪",
      description: "Break down into basics",
      detail: "Chop and prepare ingredients"
    },
    {
      title: "Cooking (Layer 2)",
      icon: "🍳",
      description: "Combine patterns",
      detail: "Mix ingredients together"
    },
    {
      title: "Final Dish (Output)",
      icon: "🍝",
      description: "Predict next word",
      detail: "The finished meal!"
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-6xl mx-auto"
    >
      {stage === 'intro' && (
        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-8 text-center">
          <Brain className="w-20 h-20 text-purple-400 mx-auto mb-6" />
          <h1 className="text-3xl font-bold text-white mb-4">
            Neural Networks: The Recipe for Language
          </h1>
          <p className="text-xl text-blue-200 mb-8 max-w-3xl mx-auto">
            Neural networks sound complicated, but they're really just like following 
            a recipe. Let's see how they "cook up" the next word in a sentence!
          </p>

          <div className="bg-purple-900/30 rounded-lg p-6 mb-8 max-w-2xl mx-auto">
            <ChefHat className="w-12 h-12 text-purple-400 mx-auto mb-4" />
            <p className="text-purple-200">
              Just like a chef combines ingredients to make a meal, neural networks 
              combine word patterns to predict what comes next.
            </p>
          </div>

          <button
            onClick={() => setStage('analogy')}
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-3 rounded-lg font-medium"
          >
            See the Recipe in Action
          </button>
        </div>
      )}

      {stage === 'analogy' && (
        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-8">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">
            The AI Kitchen: How Neural Networks "Cook" Language
          </h2>

          <div className="grid md:grid-cols-4 gap-4 mb-8">
            {cookingSteps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
                whileHover={{ scale: 1.05 }}
                className={`bg-gradient-to-br ${
                  currentStep === index 
                    ? 'from-purple-600/40 to-blue-600/40 ring-2 ring-blue-400' 
                    : 'from-gray-800/40 to-gray-700/40'
                } rounded-lg p-6 text-center cursor-pointer transition-all`}
                onClick={() => setCurrentStep(index)}
              >
                <div className="text-4xl mb-3">{step.icon}</div>
                <h3 className="text-white font-semibold mb-2">{step.title}</h3>
                <p className="text-gray-300 text-sm mb-2">{step.description}</p>
                <p className="text-blue-300 text-xs italic">{step.detail}</p>
              </motion.div>
            ))}
          </div>

          <div className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 rounded-lg p-6 mb-6">
            <h3 className="text-xl font-semibold text-white mb-4 text-center">
              Let's "Cook" a Sentence!
            </h3>
            
            <div className="text-center mb-6">
              <p className="text-lg text-blue-200 mb-4">
                Input: "The cat __?"
              </p>
              
              <div className="flex justify-center items-center gap-4">
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  className="bg-purple-600/30 rounded-lg p-4"
                >
                  <span className="text-2xl">🥕</span>
                  <p className="text-white text-sm mt-2">"The cat"</p>
                </motion.div>
                
                <ArrowRight className="w-8 h-8 text-white" />
                
                <div className="flex gap-2">
                  {['🔪', '🍳'].map((emoji, i) => (
                    <motion.div
                      key={i}
                      animate={{ rotate: [0, 10, -10, 0] }}
                      transition={{ repeat: Infinity, duration: 2, delay: i * 0.5 }}
                      className="bg-blue-600/30 rounded-lg p-4"
                    >
                      <span className="text-2xl">{emoji}</span>
                    </motion.div>
                  ))}
                </div>
                
                <ArrowRight className="w-8 h-8 text-white" />
                
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ repeat: Infinity, duration: 2, delay: 1 }}
                  className="bg-green-600/30 rounded-lg p-4"
                >
                  <span className="text-2xl">🍝</span>
                  <p className="text-white text-sm mt-2">"sits"</p>
                </motion.div>
              </div>
            </div>

            <div className="bg-black/20 rounded-lg p-4">
              <p className="text-white text-center">
                <strong>The Recipe:</strong> The network processes millions of sentences during training,
                calculating that after "The cat" words like "sits", "runs", or "sleeps" frequently appeared!
              </p>
            </div>
          </div>

          <button
            onClick={() => setStage('demo')}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium"
          >
            Try Another Example
          </button>
        </div>
      )}

      {stage === 'demo' && (
        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-8">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">
            Watch the Network "Cook" Different Sentences
          </h2>

          <div className="space-y-6 mb-8">
            {[
              { input: "The weather is", outputs: ["sunny ☀️", "rainy 🌧️", "cold ❄️"], best: 0 },
              { input: "Students love", outputs: ["learning 📚", "pizza 🍕", "games 🎮"], best: 0 },
              { input: "AI can help", outputs: ["teachers 👩‍🏫", "everyone 🌍", "students 🎓"], best: 0 }
            ].map((example, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.2 }}
                className="bg-gray-800/50 rounded-lg p-6"
              >
                <p className="text-white text-lg mb-4">
                  <span className="text-blue-300">Input:</span> "{example.input} ___"
                </p>
                
                <div className="grid grid-cols-3 gap-4">
                  {example.outputs.map((output, i) => (
                    <motion.div
                      key={i}
                      whileHover={{ scale: 1.05 }}
                      className={`text-center p-4 rounded-lg ${
                        i === example.best 
                          ? 'bg-green-600/30 border-2 border-green-400' 
                          : 'bg-gray-700/50'
                      }`}
                    >
                      <p className="text-white">{output}</p>
                      <p className="text-2xl font-bold mt-2 text-blue-400">
                        {i === example.best ? '65%' : i === 1 ? '20%' : '15%'}
                      </p>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>

          <button
            onClick={() => setStage('summary')}
            className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-medium"
          >
            Understand the Key Points
          </button>
        </div>
      )}

      {stage === 'summary' && (
        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-8">
          <h2 className="text-3xl font-bold text-white mb-6 text-center">
            The Simple Truth About Neural Networks
          </h2>

          <div className="space-y-6 mb-8 max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-r from-purple-900/30 to-blue-900/30 rounded-lg p-6"
            >
              <h3 className="text-xl font-semibold text-white mb-3 flex items-center gap-2">
                <ChefHat className="w-6 h-6" />
                It's Just a Recipe!
              </h3>
              <p className="text-gray-200">
                Neural networks follow a "recipe" calculated from millions of examples.
                They don't think—they just match which "ingredients" (words) appeared together in training data.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-gradient-to-r from-blue-900/30 to-green-900/30 rounded-lg p-6"
            >
              <h3 className="text-xl font-semibold text-white mb-3 flex items-center gap-2">
                <Filter className="w-6 h-6" />
                Layers = Steps in the Recipe
              </h3>
              <p className="text-gray-200">
                Each layer is like a step in cooking: prep the ingredients, combine them, 
                cook them, and serve. More layers = more complex "recipes" for language!
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-gradient-to-r from-green-900/30 to-yellow-900/30 rounded-lg p-6"
            >
              <h3 className="text-xl font-semibold text-white mb-3 flex items-center gap-2">
                <Users className="w-6 h-6" />
                Practice Makes Perfect
              </h3>
              <p className="text-gray-200">
                Just like a chef gets better with practice, neural networks improve by 
                "tasting" billions of sentences during training. That's why they need so much data!
              </p>
            </motion.div>
          </div>

          <div className="bg-blue-900/20 border border-blue-400/30 rounded-lg p-6 mb-6 text-center">
            <Lightbulb className="w-8 h-8 text-yellow-400 mx-auto mb-3" />
            <p className="text-blue-200 text-lg">
              <strong>Remember:</strong> Neural networks are pattern-matching systems that have
              calculated statistical probabilities from millions of word combinations. They're powerful tools,
              but they don't actually understand what they're processing!
            </p>
          </div>

          <button
            onClick={onComplete}
            className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white py-3 rounded-lg font-medium"
          >
            Continue to Knowledge Check
          </button>
        </div>
      )}
    </motion.div>
  );
}