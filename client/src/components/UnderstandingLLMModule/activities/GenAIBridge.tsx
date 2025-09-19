// Update: /client/src/components/UnderstandingLLMModule/activities/GenAIBridge.tsx

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Brain, ArrowRight, Lightbulb } from 'lucide-react';

interface Props {
  onComplete: () => void;
}

export default function GenAIBridge({ onComplete }: Props) {
  const [showConnection, setShowConnection] = useState(false);

  // Developer Mode: Auto-complete functionality
  useEffect(() => {
    const handleDevAutoComplete = (event: any) => {
      if (event.detail?.moduleId === 'understanding-llms') {
        console.log('🔧 Developer mode: Auto-completing GenAI Bridge');
        if (!showConnection) {
          setShowConnection(true);
          setTimeout(() => onComplete(), 1000);
        } else {
          onComplete();
        }
      }
    };

    window.addEventListener('dev-auto-complete-activity', handleDevAutoComplete);
    return () => window.removeEventListener('dev-auto-complete-activity', handleDevAutoComplete);
  }, [showConnection, onComplete]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto"
    >
      {!showConnection ? (
        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-8 text-center">
          <div className="flex justify-center mb-6">
            <div className="bg-gradient-to-r from-purple-500 to-blue-500 p-4 rounded-full">
              <Brain className="w-16 h-16 text-white" />
            </div>
          </div>
          
          <h1 className="text-3xl font-bold text-white mb-4">
            From Generative AI to Large Language Models
          </h1>
          
          <p className="text-xl text-blue-200 mb-8 max-w-2xl mx-auto">
            You've learned how Generative AI creates new content. Now, let's explore the specific 
            type of AI that powers tools like ChatGPT and Claude: Large Language Models.
          </p>

          <div className="bg-blue-900/30 border border-blue-400/30 rounded-lg p-6 mb-8">
            <h3 className="text-lg font-semibold text-white mb-3">Remember from Generative AI:</h3>
            <ul className="text-left text-blue-200 space-y-2 max-w-xl mx-auto">
              <li>• AI can generate text, images, and more</li>
              <li>• It learns patterns from existing data</li>
              <li>• It creates new content based on those patterns</li>
            </ul>
          </div>

          <button
            onClick={() => setShowConnection(true)}
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-3 rounded-lg font-medium inline-flex items-center gap-2"
          >
            See the Connection <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      ) : (
        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-8">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">
            The Connection: LLMs are Text-Focused Generative AI
          </h2>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="bg-purple-900/30 border border-purple-400/30 rounded-lg p-6">
              <Sparkles className="w-8 h-8 text-purple-400 mb-3" />
              <h3 className="text-xl font-semibold text-white mb-2">Generative AI</h3>
              <p className="text-purple-200">
                The broad category of AI that creates new content across different formats
              </p>
            </div>

            <div className="bg-blue-900/30 border border-blue-400/30 rounded-lg p-6">
              <Brain className="w-8 h-8 text-blue-400 mb-3" />
              <h3 className="text-xl font-semibold text-white mb-2">Large Language Models</h3>
              <p className="text-blue-200">
                Specialized generative AI focused on understanding and creating text
              </p>
            </div>
          </div>

          <div className="bg-gradient-to-r from-purple-800/20 to-blue-800/20 rounded-lg p-6 mb-8">
            <Lightbulb className="w-6 h-6 text-yellow-400 inline mr-2" />
            <span className="text-white font-medium">Key Insight:</span>
            <p className="text-gray-200 mt-2">
              While DALL-E generates images and other AI generates music, LLMs like ChatGPT 
              specialize in language—reading, understanding, and writing text with remarkable fluency.
            </p>
          </div>

          <div className="bg-green-900/30 border border-green-400/30 rounded-lg p-6 mb-6">
            <p className="text-green-200 text-center text-lg">
              🎯 <strong>Ready to explore?</strong> Let's see how these language models actually work!
            </p>
          </div>

          <button
            onClick={onComplete}
            className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white px-8 py-3 rounded-lg font-medium"
          >
            Start Learning About LLMs
          </button>
        </div>
      )}
    </motion.div>
  );
}