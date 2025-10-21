import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Props {
  onComplete: () => void;
}

interface LLM {
  name: string;
  company: string;
  description: string;
  color: string;
  textColor: string;
  logoUrl: string; // URL to actual logo image
}

const llms: LLM[] = [
  {
    name: "ChatGPT",
    company: "OpenAI",
    description: "The LLM that started the AI revolution. Trained on diverse internet text and fine-tuned with human feedback to have natural conversations.",
    color: "from-emerald-500 to-teal-600",
    textColor: "text-white",
    logoUrl: "https://upload.wikimedia.org/wikipedia/commons/0/04/ChatGPT_logo.svg"
  },
  {
    name: "Gemini",
    company: "Google",
    description: "Google's multimodal LLM that can process not just text, but images, audio, and video. Built on Google's massive search data.",
    color: "from-blue-500 to-indigo-600",
    textColor: "text-white",
    logoUrl: "https://upload.wikimedia.org/wikipedia/commons/8/8a/Google_Gemini_logo.svg"
  },
  {
    name: "Claude",
    company: "Anthropic",
    description: "Built with a focus on safety and being helpful. Known for nuanced conversations and refusing harmful requests.",
    color: "from-orange-400 to-amber-500",
    textColor: "text-white",
    logoUrl: "https://upload.wikimedia.org/wikipedia/commons/8/8a/Claude_AI_logo.svg"
  },
  {
    name: "DeepSeek",
    company: "DeepSeek AI (China)",
    description: "A powerful Chinese LLM trained on both English and Chinese data. Notable for its strong reasoning and coding abilities.",
    color: "from-cyan-500 to-blue-600",
    textColor: "text-white",
    logoUrl: "https://upload.wikimedia.org/wikipedia/commons/e/ec/DeepSeek_logo.svg"
  },
  {
    name: "Llama",
    company: "Meta",
    description: "Meta's open-source LLM family. Unlike others, anyone can download, modify, and use it to build custom AI applications.",
    color: "from-purple-500 to-pink-600",
    textColor: "text-white",
    logoUrl: "https://vectorseek.com/wp-content/uploads/2023/07/LLaMA-Meta-Logo-Vector.png"
  },
  {
    name: "Grok",
    company: "xAI",
    description: "Elon Musk's LLM with real-time access to X (Twitter) data. Known for a more casual, witty conversational style.",
    color: "from-slate-600 to-gray-700",
    textColor: "text-white",
    logoUrl: "https://upload.wikimedia.org/wikipedia/commons/3/3e/Logo_Grok_AI_%28xAI%29_2025.png"
  }
];

export default function MeetTheLLMs({ onComplete }: Props) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-5xl w-full"
      >
        {/* Header */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="inline-block mb-4"
          >
            <Sparkles className="h-16 w-16 text-yellow-400" />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-4xl md:text-5xl font-bold text-white mb-4"
          >
            Meet the LLMs
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-xl text-white/80 max-w-2xl mx-auto"
          >
            You've probably used some of these already! Here are the most popular Large Language Models and what makes each one unique.
          </motion.p>
        </div>

        {/* LLM Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {llms.map((llm, index) => (
            <motion.div
              key={llm.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + index * 0.1 }}
              className="group"
            >
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border-2 border-white/20 hover:border-white/40 transition-all duration-300 h-full flex flex-col">
                {/* Logo */}
                <div className="mb-4">
                  <div className="w-24 h-24 rounded-2xl bg-white flex items-center justify-center shadow-xl group-hover:scale-105 transition-transform duration-300 p-3">
                    <img
                      src={llm.logoUrl}
                      alt={`${llm.name} logo`}
                      className="w-full h-full object-contain"
                    />
                  </div>
                </div>

                {/* Name & Company */}
                <div className="mb-3">
                  <h3 className="text-2xl font-bold text-white mb-1">
                    {llm.name}
                  </h3>
                  <p className="text-sm text-white/60 font-medium">
                    by {llm.company}
                  </p>
                </div>

                {/* Description */}
                <p className="text-white/80 text-base leading-relaxed">
                  {llm.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom Note */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.0 }}
          className="bg-white/10 backdrop-blur-md rounded-xl p-6 border-2 border-blue-400 mb-8"
        >
          <p className="text-white/90 text-center text-lg">
            <span className="font-semibold text-blue-300">Remember:</span> They all work the same way—predicting the next word based on patterns in their training data!
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
            Continue
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </motion.div>
      </motion.div>
    </div>
  );
}
