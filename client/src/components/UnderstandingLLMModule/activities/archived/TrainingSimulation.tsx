import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, Database, ArrowRight, CheckCircle, Sparkles } from 'lucide-react';
import { darkTheme } from '../styles/darkTheme';

interface Props {
  onComplete: () => void;
}

export default function TrainingSimulation({ onComplete }: Props) {
  const [stage, setStage] = useState<'intro' | 'feeding' | 'complete'>('intro');
  const [trainingExamples, setTrainingExamples] = useState(0);
  const [modelAccuracy, setModelAccuracy] = useState(0);

  const trainingData = [
    { input: "What's 2+2?", output: "4" },
    { input: "Capital of France?", output: "Paris" },
    { input: "Color of the sky?", output: "Blue" },
    { input: "Spell 'cat'", output: "C-A-T" },
    { input: "Days in a week?", output: "Seven" },
  ];

  const startTraining = () => {
    setStage('feeding');
    let count = 0;
    
    const interval = setInterval(() => {
      count++;
      setTrainingExamples(count);
      setModelAccuracy(Math.min(count * 20, 100));
      
      if (count >= 5) {
        clearInterval(interval);
        setTimeout(() => setStage('complete'), 1000);
      }
    }, 800);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`${darkTheme.bgPrimary} rounded-xl shadow-xl p-8`}
      >
        {stage === 'intro' && (
          <div className="text-center space-y-6">
            <Brain className="w-16 h-16 text-blue-400 mx-auto animate-pulse" />
            <h2 className={`text-3xl font-bold ${darkTheme.textPrimary}`}>
              Train Your Own Mini AI Model!
            </h2>
            <p className={`${darkTheme.textSecondary} text-lg max-w-2xl mx-auto`}>
              Watch how an AI learns from examples. We'll feed it simple question-answer pairs
              and see how it improves at predicting answers!
            </p>
            <button
              onClick={startTraining}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-medium flex items-center gap-2 mx-auto transition-colors"
            >
              Start Training <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        )}

        {stage === 'feeding' && (
          <div className="space-y-6">
            <h3 className={`text-2xl font-bold ${darkTheme.textPrimary} text-center`}>
              Training in Progress...
            </h3>
            
            <div className={darkTheme.card + ' p-6'}>
              <div className="flex items-center justify-between mb-4">
                <span className={darkTheme.textSecondary}>Examples Fed:</span>
                <span className={`text-2xl font-bold ${darkTheme.textAccent}`}>
                  {trainingExamples}/5
                </span>
              </div>
              
              <div className="space-y-3">
                <AnimatePresence>
                  {trainingData.slice(0, trainingExamples).map((item, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className={`${darkTheme.bgSecondary} rounded-lg p-3 flex items-center gap-3`}
                    >
                      <Database className="w-5 h-5 text-green-400" />
                      <div className="flex-1">
                        <span className="text-blue-300">{item.input}</span>
                        <span className={darkTheme.textMuted + ' mx-2'}>→</span>
                        <span className="text-green-300">{item.output}</span>
                      </div>
                      <CheckCircle className="w-5 h-5 text-green-400" />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
              
              <div className="mt-6">
                <div className={`flex justify-between text-sm ${darkTheme.textSecondary} mb-2`}>
                  <span>Model Accuracy</span>
                  <span>{modelAccuracy}%</span>
                </div>
                <div className={`${darkTheme.bgTertiary} rounded-full h-3 overflow-hidden`}>
                  <motion.div
                    className="bg-gradient-to-r from-blue-500 to-green-500 h-full"
                    animate={{ width: `${modelAccuracy}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {stage === 'complete' && (
          <div className="text-center space-y-6">
            <Sparkles className="w-16 h-16 text-yellow-400 mx-auto" />
            <h3 className={`text-2xl font-bold ${darkTheme.textPrimary}`}>
              Training Complete!
            </h3>
            <div className={`${darkTheme.card} p-6 max-w-lg mx-auto`}>
              <p className={`${darkTheme.textSecondary} mb-4`}>
                Your AI model learned from just 5 examples! Real LLMs train on 
                <span className={`${darkTheme.textAccent} font-bold`}> billions</span> of examples.
              </p>
              <p className="text-yellow-300 text-sm">
                💡 Key Insight: The more quality data, the better the predictions!
              </p>
            </div>
            <button
              onClick={onComplete}
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-medium transition-colors"
            >
              Continue Learning
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
}