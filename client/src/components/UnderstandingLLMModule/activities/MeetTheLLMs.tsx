import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, Check } from 'lucide-react';
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
    logoUrl: "/logos/chatgpt-logo.svg"
  },
  {
    name: "Gemini",
    company: "Google",
    description: "Google's multimodal LLM that can process not just text, but images, audio, and video. Built on Google's massive search data.",
    color: "from-blue-500 to-indigo-600",
    textColor: "text-white",
    logoUrl: "/logos/gemini-logo.svg"
  },
  {
    name: "Claude",
    company: "Anthropic",
    description: "Built with a focus on safety and being helpful. Known for nuanced conversations and refusing harmful requests.",
    color: "from-orange-400 to-amber-500",
    textColor: "text-white",
    logoUrl: "/logos/claude-logo.svg"
  },
  {
    name: "DeepSeek",
    company: "DeepSeek AI (China)",
    description: "A powerful Chinese LLM trained on both English and Chinese data. Notable for its strong reasoning and coding abilities.",
    color: "from-cyan-500 to-blue-600",
    textColor: "text-white",
    logoUrl: "/logos/deepseek-logo.svg"
  },
  {
    name: "Llama",
    company: "Meta",
    description: "Meta's open-source LLM family. Unlike others, anyone can download, modify, and use it to build custom AI applications.",
    color: "from-purple-500 to-pink-600",
    textColor: "text-white",
    logoUrl: "/logos/llama-logo.png"
  },
  {
    name: "Grok",
    company: "xAI",
    description: "Elon Musk's LLM with real-time access to X (Twitter) data. Known for a more casual, witty conversational style.",
    color: "from-slate-600 to-gray-700",
    textColor: "text-white",
    logoUrl: "/logos/grok-logo.png"
  },
  {
    name: "Microsoft Copilot",
    company: "Microsoft",
    description: "Microsoft's AI assistant built into Windows, Edge, and Office. It's integrated into everyday tools and can help with writing, coding, and problem-solving.",
    color: "from-slate-600 to-slate-900",
    textColor: "text-white",
    logoUrl: "/logos/copilot-logo.png"
  }
];

export default function MeetTheLLMs({ onComplete }: Props) {
  const [selectedLLMs, setSelectedLLMs] = useState<Set<string>>(new Set());
  const [selectedNone, setSelectedNone] = useState(false);
  const [failedLogos, setFailedLogos] = useState<Set<string>>(new Set());

  const handleLLMClick = (llmName: string) => {
    const newSelected = new Set(selectedLLMs);
    if (newSelected.has(llmName)) {
      newSelected.delete(llmName);
    } else {
      newSelected.add(llmName);
      setSelectedNone(false); // Unselect "None" if they select an LLM
    }
    setSelectedLLMs(newSelected);
  };

  const handleNoneClick = () => {
    if (selectedNone) {
      setSelectedNone(false);
    } else {
      setSelectedNone(true);
      setSelectedLLMs(new Set()); // Clear all LLM selections
    }
  };

  const handleLogoError = (llmName: string) => {
    setFailedLogos(prev => new Set([...prev, llmName]));
  };

  const hasSelection = selectedLLMs.size > 0 || selectedNone;
  const canContinue = hasSelection;

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
            className="text-xl text-white/80 max-w-2xl mx-auto mb-2"
          >
            You've probably heard of some of these! Here are the most popular Large Language Models and what makes each one unique.
          </motion.p>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-lg text-yellow-300 max-w-2xl mx-auto font-semibold"
          >
            Click on the ones you've heard of or used before 👇
          </motion.p>
        </div>

        {/* LLM Gallery Grid - 3 columns */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {llms.map((llm, index) => {
            const isSelected = selectedLLMs.has(llm.name);
            return (
              <motion.div
                key={llm.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 + index * 0.1 }}
                className="group cursor-pointer"
                onClick={() => handleLLMClick(llm.name)}
              >
                <motion.div
                  animate={{
                    scale: isSelected ? 1.05 : 1,
                  }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className={`bg-white/10 backdrop-blur-md rounded-xl p-4 border-2 transition-all duration-300 h-full flex flex-col relative ${
                    isSelected
                      ? 'border-yellow-400 shadow-lg shadow-yellow-400/50'
                      : 'border-white/20 hover:border-white/40'
                  }`}
                >
                  {/* Selected Checkmark */}
                  {isSelected && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 300 }}
                      className="absolute top-3 right-3 bg-yellow-400 rounded-full p-1.5"
                    >
                      <Check className="w-4 h-4 text-white" strokeWidth={3} />
                    </motion.div>
                  )}

                  {/* Logo */}
                  <div className="mb-3">
                    <div className="w-16 h-16 rounded-xl bg-white flex items-center justify-center shadow-xl group-hover:scale-105 transition-transform duration-300 p-2">
                      {failedLogos.has(llm.name) ? (
                        <span className="text-sm font-bold text-gray-900">
                          {llm.name.split(' ').map(word => word[0]).join('').toUpperCase()}
                        </span>
                      ) : (
                        <img
                          src={llm.logoUrl}
                          alt={`${llm.name} logo`}
                          className="w-full h-full object-contain"
                          onError={() => handleLogoError(llm.name)}
                        />
                      )}
                    </div>
                  </div>

                  {/* Name & Company */}
                  <div className="mb-2">
                    <h3 className={`text-lg font-bold mb-1 ${isSelected ? 'text-yellow-300' : 'text-white'}`}>
                      {llm.name}
                    </h3>
                    <p className="text-xs text-white/60 font-medium">
                      by {llm.company}
                    </p>
                  </div>

                  {/* Description */}
                  <p className="text-white/80 text-sm leading-relaxed">
                    {llm.description}
                  </p>
                </motion.div>
              </motion.div>
            );
          })}
        </div>

        {/* "Haven't heard of any" Button */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
          className="text-center mb-8"
        >
          <button
            onClick={handleNoneClick}
            className={`px-6 py-3 rounded-xl border-2 font-semibold transition-all duration-300 ${
              selectedNone
                ? 'border-orange-400 bg-orange-500/20 text-orange-300 shadow-lg shadow-orange-400/50'
                : 'border-white/30 text-white/70 hover:border-white/50 hover:text-white'
            }`}
          >
            {selectedNone && <Check className="inline mr-2 h-4 w-4" strokeWidth={3} />}
            I haven't heard of any of these
          </button>
        </motion.div>

        {/* Continue Button - Only show after selection */}
        {hasSelection && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
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
        )}
      </motion.div>
    </div>
  );
}
