import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Globe, Camera, FileText, Music, Video, Code, Database, ArrowRight, Sparkles } from 'lucide-react';

interface Props {
  onComplete: () => void;
}

const trainingDataTypes = [
  {
    icon: BookOpen,
    title: "Books & Literature",
    description: "Classic novels, textbooks, reference materials, and educational content",
    examples: ["Wikipedia", "Project Gutenberg", "Academic papers"],
    color: "from-blue-500 to-blue-600",
    percentage: "25%"
  },
  {
    icon: Globe,
    title: "Web Content",
    description: "Websites, blogs, forums, and online articles from across the internet",
    examples: ["News articles", "Blog posts", "Forum discussions"],
    color: "from-green-500 to-green-600",
    percentage: "35%"
  },
  {
    icon: FileText,
    title: "Documents & Papers",
    description: "Research papers, reports, manuals, and professional documents",
    examples: ["Scientific papers", "Technical documentation", "Government reports"],
    color: "from-purple-500 to-purple-600",
    percentage: "20%"
  },
  {
    icon: Code,
    title: "Programming Code",
    description: "Source code from repositories, documentation, and coding tutorials",
    examples: ["GitHub repositories", "Stack Overflow", "Coding tutorials"],
    color: "from-orange-500 to-orange-600",
    percentage: "20%"
  }
];

const keyPoints = [
  {
    icon: Database,
    title: "Massive Scale",
    description: "LLMs are trained on billions of text samples from diverse sources"
  },
  {
    icon: Globe,
    title: "Global Diversity",
    description: "Training data includes content from many languages and cultures"
  },
  {
    icon: Sparkles,
    title: "Quality Filtering",
    description: "Data goes through filtering processes to remove low-quality content"
  }
];

export default function GenericTrainingDataInfo({ onComplete }: Props) {
  const [currentSection, setCurrentSection] = useState(0);
  const [showContinueButton, setShowContinueButton] = useState(false);
  const [animatedCards, setAnimatedCards] = useState<Set<number>>(new Set());

  useEffect(() => {
    // Show continue button after 20 seconds
    const timer = setTimeout(() => {
      setShowContinueButton(true);
    }, 20000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Animate cards one by one
    const timers = trainingDataTypes.map((_, index) =>
      setTimeout(() => {
        setAnimatedCards(prev => new Set([...prev, index]));
      }, (index + 1) * 800)
    );

    return () => timers.forEach(clearTimeout);
  }, []);

  const handleContinue = () => {
    if (currentSection === 0) {
      setCurrentSection(1);
      setShowContinueButton(false);
      setTimeout(() => setShowContinueButton(true), 15000);
    } else {
      onComplete();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-6">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="bg-gradient-to-r from-blue-500 to-purple-500 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Database className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">
            What's in Training Data?
          </h1>
          <p className="text-xl text-white max-w-3xl mx-auto">
            Understanding the diverse sources that teach LLMs about language and the world
          </p>
        </motion.div>

        {currentSection === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-8"
          >
            {/* Introduction */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="bg-white/10 backdrop-blur-lg rounded-xl p-8 border border-white/20"
            >
              <h2 className="text-2xl font-bold text-white mb-4">
                The Foundation of Knowledge
              </h2>
              <p className="text-lg text-white mb-6">
                Large Language Models learn from vast collections of text from many different sources. 
                This diverse training data is what gives them their broad knowledge and language abilities.
              </p>
              <div className="bg-gradient-to-r from-yellow-900/40 to-orange-900/40 rounded-lg p-4 border border-yellow-400">
                <p className="text-white text-center font-medium">
                  💡 Think of it like a student reading millions of books, articles, and websites to learn about the world
                </p>
              </div>
            </motion.div>

            {/* Training Data Types Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {trainingDataTypes.map((type, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -50 }}
                  animate={animatedCards.has(index) ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                  className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300"
                >
                  <div className="flex items-start gap-4">
                    <div className={`bg-gradient-to-r ${type.color} w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0`}>
                      <type.icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-xl font-bold text-white">{type.title}</h3>
                        <span className="text-sm font-medium text-blue-300 bg-blue-900/40 px-2 py-1 rounded">
                          ~{type.percentage}
                        </span>
                      </div>
                      <p className="text-white mb-3">{type.description}</p>
                      <div className="space-y-1">
                        <p className="text-sm text-blue-300 font-medium">Examples:</p>
                        {type.examples.map((example, idx) => (
                          <p key={idx} className="text-sm text-white">• {example}</p>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Auto-advance notification for section 0 */}
            {!showContinueButton && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2 }}
                className="text-center mt-6"
              >
                <p className="text-gray-400 text-sm">Auto-advancing in a few seconds...</p>
              </motion.div>
            )}
          </motion.div>
        )}

        {currentSection === 1 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-8 border border-white/20">
              <h2 className="text-3xl font-bold text-white mb-6 text-center">
                Key Training Data Principles
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {keyPoints.map((point, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.2 }}
                    className="text-center"
                  >
                    <div className="bg-gradient-to-r from-purple-500 to-blue-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                      <point.icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">{point.title}</h3>
                    <p className="text-white">{point.description}</p>
                  </motion.div>
                ))}
              </div>

              <div className="bg-gradient-to-r from-blue-900/40 to-purple-900/40 rounded-lg p-6 border border-blue-400">
                <h3 className="text-xl font-bold text-white mb-4">Why This Matters for Students</h3>
                <div className="space-y-3 text-white">
                  <p>• <strong className="text-white">Diverse Knowledge:</strong> Training on varied sources gives LLMs broad knowledge across many topics</p>
                  <p>• <strong className="text-white">Language Understanding:</strong> Exposure to different writing styles helps them communicate effectively</p>
                  <p>• <strong className="text-white">Cultural Awareness:</strong> Global content helps them understand different perspectives and contexts</p>
                  <p>• <strong className="text-white">Limitations:</strong> Training data has a "knowledge cutoff" - LLMs don't know about events after their training</p>
                </div>
              </div>
            </div>

            {/* Auto-advance notification for section 1 */}
            {!showContinueButton && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                className="text-center mt-6"
              >
                <p className="text-gray-400 text-sm">Auto-advancing in a few seconds...</p>
              </motion.div>
            )}
          </motion.div>
        )}

        {/* Continue Button */}
        <AnimatePresence>
          {showContinueButton && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center mt-8"
            >
              <button
                onClick={handleContinue}
                className="bg-gradient-to-r from-green-500 to-teal-600 text-white py-4 px-8 rounded-xl font-semibold hover:scale-105 transition-all duration-300 flex items-center justify-center mx-auto space-x-2 shadow-lg"
              >
                <span>
                  {currentSection === 0 ? "Learn Key Principles" : "Continue to Tokenization"}
                </span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}