// Update: /client/src/components/UnderstandingLLMModule/activities/GenAIBridge.tsx

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Brain, ArrowRight, Lightbulb } from 'lucide-react';

interface Props {
  onComplete: () => void;
}

export default function GenAIBridge({ onComplete }: Props) {
  const [currentScreen, setCurrentScreen] = useState(0); // 0 = preview, 1 = bridge
  const [isFadingOut, setIsFadingOut] = useState(false);

  // Developer Mode: Auto-complete functionality
  useEffect(() => {
    const handleDevAutoComplete = (event: any) => {
      if (event.detail?.moduleId === 'understanding-llms') {
        console.log('🔧 Developer mode: Auto-completing GenAI Bridge');
        onComplete();
      }
    };

    window.addEventListener('dev-auto-complete-activity', handleDevAutoComplete);
    return () => window.removeEventListener('dev-auto-complete-activity', handleDevAutoComplete);
  }, [onComplete]);

  const handleComplete = () => {
    setIsFadingOut(true);
    setTimeout(() => {
      onComplete();
    }, 1000); // 1 second fade-out
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: isFadingOut ? 0 : 1, y: isFadingOut ? 20 : 0 }}
        transition={{ duration: isFadingOut ? 1 : 0.3 }}
        className="max-w-4xl w-full"
      >
      {currentScreen === 0 ? (
        /* Screen 1: Module Preview */
        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-8 text-center">
          <div className="flex justify-center mb-6">
            <div className="bg-gradient-to-r from-purple-500 to-blue-500 p-4 rounded-full">
              <Brain className="w-16 h-16 text-white" />
            </div>
          </div>
          
          <h1 className="text-3xl font-bold text-white mb-4">
            Understanding Large Language Models
          </h1>

          <p className="text-xl text-white mb-8 max-w-2xl mx-auto">
            Ever wondered what's really happening when you chat with ChatGPT or Claude?
            It's time to pull back the curtain and see how the magic trick actually works.
          </p>

          <div className="bg-blue-900/40 border border-blue-400 rounded-lg p-6 mb-8">
            <h3 className="text-lg font-semibold text-white mb-3">In this module, you'll discover:</h3>
            <ul className="text-left text-white space-y-2 max-w-xl mx-auto">
              <li>• Why ChatGPT isn't "thinking"—it's just really good at spotting patterns</li>
              <li>• How "predict the next word" is the one function that powers everything</li>
              <li>• What tokens, neural networks, and training loops actually do</li>
              <li>• Why understanding this puts YOU in control of the tool</li>
            </ul>
          </div>

          <button
            onClick={() => setCurrentScreen(1)}
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-3 rounded-lg font-medium inline-flex items-center gap-2"
          >
            Let's Get Started <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      ) : (
        /* Screen 2: Bridge from Gen AI to LLMs */
        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-8">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">
            From Generative AI to LLMs
          </h2>

          <div className="bg-gradient-to-r from-purple-900/40 to-blue-900/40 border border-purple-400 rounded-lg p-6 mb-8">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-purple-400" />
              What You've Learned So Far:
            </h3>
            <ul className="text-white space-y-2 ml-7">
              <li>• Generative AI can create new content—text, images, music, and more</li>
              <li>• It learns patterns from massive amounts of existing data</li>
              <li>• It uses those patterns to generate brand-new content</li>
            </ul>
          </div>

          <div className="flex items-center justify-center mb-8">
            <div className="flex items-center gap-4">
              <div className="bg-purple-600/40 border-2 border-purple-400 rounded-lg px-6 py-3">
                <p className="text-white font-semibold">Generative AI</p>
                <p className="text-white text-sm">Broad category</p>
              </div>
              <ArrowRight className="w-8 h-8 text-yellow-400" />
              <div className="bg-blue-600/40 border-2 border-blue-400 rounded-lg px-6 py-3">
                <p className="text-white font-semibold">Large Language Models</p>
                <p className="text-white text-sm">Specialized type</p>
              </div>
            </div>
          </div>

          <div className="bg-blue-900/40 border border-blue-400 rounded-lg p-6 mb-8">
            <div className="flex items-start gap-3">
              <Brain className="w-8 h-8 text-blue-400 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-xl font-semibold text-white mb-3">The Connection</h3>
                <p className="text-white leading-relaxed mb-3">
                  <strong className="text-white">Large Language Models (LLMs)</strong> are a specific type of Generative AI
                  that specializes in one thing: <strong className="text-yellow-300">language</strong>.
                </p>
                <p className="text-white leading-relaxed">
                  While some Generative AI creates images (like DALL-E) or music, LLMs like ChatGPT and Claude
                  are laser-focused on understanding and generating <strong className="text-yellow-300">text</strong>.
                  They're the tools that can write essays, answer questions, and hold conversations.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-green-900/40 to-emerald-900/40 border border-green-400 rounded-lg p-6 mb-6">
            <Lightbulb className="w-6 h-6 text-yellow-400 inline mr-2" />
            <span className="text-white font-semibold">Key Insight:</span>
            <p className="text-white mt-2 leading-relaxed">
              Think of it like this: If Generative AI is the whole toolkit, then LLMs are the super-powered
              <strong className="text-yellow-300"> word-processing tools</strong> in that kit.
            </p>
          </div>

          <button
            onClick={handleComplete}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 rounded-lg font-medium inline-flex items-center justify-center gap-2"
          >
            Start Learning <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      )}
      </motion.div>
    </div>
  );
}