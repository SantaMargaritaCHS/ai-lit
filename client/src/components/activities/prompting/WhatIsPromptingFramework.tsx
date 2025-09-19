import React from 'react';
import { motion } from 'framer-motion';
import { Lightbulb, ChefHat, BookOpen, Target } from 'lucide-react';

interface WhatIsPromptingFrameworkProps {
  onComplete?: () => void;
  isDevMode?: boolean;
}

const WhatIsPromptingFramework = ({ onComplete, isDevMode }: WhatIsPromptingFrameworkProps) => {
  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Main Title */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-4 flex items-center justify-center">
          <Lightbulb className="w-10 h-10 mr-3 text-blue-600 dark:text-blue-400" />
          What is a Prompting Framework?
        </h1>
      </motion.div>

      {/* Reference to Previous Video */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-8 bg-purple-50 dark:bg-purple-900/20 rounded-lg p-6 border-2 border-purple-200 dark:border-purple-700"
      >
        <p className="text-lg text-gray-700 dark:text-gray-300">
          Remember that <strong>"perfect recipe"</strong> we just talked about? Well, prompting frameworks 
          are exactly that – they're your recipe cards for AI conversations!
        </p>
      </motion.div>

      {/* Main Explanation */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mb-8 bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6 border-2 border-blue-200 dark:border-blue-700"
      >
        <div className="flex items-start mb-4">
          <ChefHat className="w-8 h-8 mr-3 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-1" />
          <div>
            <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-3">
              It's Like Following a Recipe
            </h2>
            <p className="text-lg text-gray-700 dark:text-gray-300 mb-4">
              A prompting framework is like a <strong>recipe for talking to AI</strong>. Just like you follow 
              steps when cooking, frameworks give you a structured way to organize your thoughts and get 
              better results from AI tools.
            </p>
          </div>
        </div>
      </motion.div>

      {/* Why Frameworks Help */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mb-8 space-y-4"
      >
        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4 flex items-center">
          <Target className="w-6 h-6 mr-2 text-green-600 dark:text-green-400" />
          Why Do Frameworks Help?
        </h2>
        
        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 border border-green-200 dark:border-green-700">
            <h3 className="font-semibold text-gray-800 dark:text-gray-100 mb-2">Without a Framework:</h3>
            <p className="text-gray-700 dark:text-gray-300 italic">"Help me with math"</p>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
              ❌ Too vague<br />
              ❌ AI doesn't know what you need<br />
              ❌ Results might not be helpful
            </p>
          </div>
          
          <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 border border-green-200 dark:border-green-700">
            <h3 className="font-semibold text-gray-800 dark:text-gray-100 mb-2">With a Framework:</h3>
            <p className="text-gray-700 dark:text-gray-300 italic">
              "Act as a patient math tutor. Create practice problems for fractions. Format as a worksheet with answers."
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
              ✅ Clear role<br />
              ✅ Specific task<br />
              ✅ Exact format needed
            </p>
          </div>
        </div>
      </motion.div>

      {/* The Power of Structure */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="mb-8 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-6 border-2 border-yellow-200 dark:border-yellow-700"
      >
        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-3 flex items-center">
          <BookOpen className="w-6 h-6 mr-2 text-yellow-600 dark:text-yellow-400" />
          The Power of Structure
        </h2>
        <p className="text-lg text-gray-700 dark:text-gray-300 mb-4">
          Think about how you organize your thoughts when asking a friend for help:
        </p>
        <ol className="list-decimal list-inside space-y-2 text-gray-700 dark:text-gray-300 ml-4">
          <li><strong>Who</strong> you need them to be (a study buddy, a coach, an expert)</li>
          <li><strong>What</strong> you need them to do (explain, create, solve)</li>
          <li><strong>How</strong> you want the answer (list, story, step-by-step)</li>
        </ol>
        <p className="text-lg text-gray-700 dark:text-gray-300 mt-4">
          Prompting frameworks help you organize these same thoughts for AI!
        </p>
      </motion.div>

      {/* Preview of Frameworks */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mb-8 bg-gray-50 dark:bg-gray-900/50 rounded-lg p-6 border-2 border-gray-200 dark:border-gray-700"
      >
        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-3">
          What's Coming Next?
        </h2>
        <p className="text-lg text-gray-700 dark:text-gray-300 mb-4">
          You'll learn four powerful frameworks that educators love:
        </p>
        <ul className="space-y-2 text-gray-700 dark:text-gray-300 ml-4">
          <li>🎯 <strong>RTF</strong> - Perfect for beginners!</li>
          <li>⭐ <strong>STAR</strong> - Great for complex problems</li>
          <li>💚 <strong>CARE</strong> - When you need specific examples</li>
          <li>💡 <strong>RISE</strong> - For multi-step processes</li>
        </ul>
      </motion.div>

      {/* Call to Action */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.6 }}
        className="text-center"
      >
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
          onClick={() => {
            if (onComplete) {
              onComplete();
            }
          }}
        >
          Explore the Frameworks →
        </motion.button>
      </motion.div>
    </div>
  );
};

export default WhatIsPromptingFramework;