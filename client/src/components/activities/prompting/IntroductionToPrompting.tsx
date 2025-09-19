import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Lightbulb } from 'lucide-react';
import PromptingFrameworks from './PromptingFrameworks';
import RoleMatchingActivity from './RoleMatchingActivity';
import FormatTransformationActivity from './FormatTransformationActivity';
import RTFPracticeBuilder from './RTFPracticeBuilder';
import AITaskExamples from './AITaskExamples';
import PromptingExitTicket from './PromptingExitTicket';

// Introduction Component
const PromptingIntro = () => (
  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
    <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-4 flex items-center">
      <Lightbulb className="w-8 h-8 mr-3 text-yellow-500" />
      Welcome to AI Prompting! 🚀
    </h2>
    <div className="prose prose-lg max-w-none">
      <p className="text-gray-700 dark:text-gray-300 mb-4 text-lg">
        Imagine having a super-smart teaching assistant who never gets tired, 
        can create endless practice problems, and helps you save hours on lesson planning. 
        That's what AI can do for you - <strong>if you know how to ask</strong>.
      </p>
      <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6 my-6 border-2 border-blue-200 dark:border-blue-700">
        <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">
          What You'll Learn Today:
        </h3>
        <ul className="space-y-2 text-gray-700 dark:text-gray-300">
          <li className="flex items-start">
            <span className="text-green-600 dark:text-green-400 mr-2">✅</span>
            How to write clear instructions that AI understands
          </li>
          <li className="flex items-start">
            <span className="text-green-600 dark:text-green-400 mr-2">✅</span>
            Four powerful frameworks for organizing your prompts
          </li>
          <li className="flex items-start">
            <span className="text-green-600 dark:text-green-400 mr-2">✅</span>
            When to use different formats for best results
          </li>
          <li className="flex items-start">
            <span className="text-green-600 dark:text-green-400 mr-2">✅</span>
            Common mistakes to avoid
          </li>
          <li className="flex items-start">
            <span className="text-green-600 dark:text-green-400 mr-2">✅</span>
            Real classroom applications you can use tomorrow
          </li>
        </ul>
      </div>
      <p className="text-gray-700 dark:text-gray-300 text-lg">
        By the end of this module, you'll be able to use AI as effectively as you use 
        a search engine - but with much more powerful results!
      </p>
    </div>
  </div>
);

// RTF Video Component with Consistent Sizing
const RTFVideo = () => (
  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
    <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
      Deep Dive: The RTF Framework
    </h2>
    <div className="video-container module-video mb-6">
      <div className="w-full bg-gray-800 rounded-lg flex items-center justify-center" style={{ aspectRatio: '16/9', minHeight: '450px' }}>
        <div className="text-center text-white">
          <div className="text-6xl mb-4">🎬</div>
          <h3 className="text-xl font-semibold mb-2">RTF Framework Video</h3>
          <p className="text-gray-300">Interactive video content coming soon</p>
          <p className="text-sm text-gray-400 mt-2">
            This section will feature an engaging video explanation of Role, Task, and Format
          </p>
        </div>
      </div>
    </div>
    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6 border-2 border-gray-200 dark:border-gray-600">
      <h3 className="font-semibold text-gray-800 dark:text-white mb-3 text-lg">
        Video Summary - The RTF Framework:
      </h3>
      <div className="space-y-3">
        <div className="flex items-start">
          <span className="bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-200 px-3 py-1 rounded-full font-bold mr-3">R</span>
          <div>
            <span className="font-semibold text-gray-800 dark:text-white">Role:</span>
            <span className="text-gray-700 dark:text-gray-300 ml-2">Define who the AI should act as (teacher, expert, coach)</span>
          </div>
        </div>
        <div className="flex items-start">
          <span className="bg-green-100 dark:bg-green-800 text-green-800 dark:text-green-200 px-3 py-1 rounded-full font-bold mr-3">T</span>
          <div>
            <span className="font-semibold text-gray-800 dark:text-white">Task:</span>
            <span className="text-gray-700 dark:text-gray-300 ml-2">Specify exactly what you want done (create, explain, analyze)</span>
          </div>
        </div>
        <div className="flex items-start">
          <span className="bg-purple-100 dark:bg-purple-800 text-purple-800 dark:text-purple-200 px-3 py-1 rounded-full font-bold mr-3">F</span>
          <div>
            <span className="font-semibold text-gray-800 dark:text-white">Format:</span>
            <span className="text-gray-700 dark:text-gray-300 ml-2">Describe how you want the output structured (bullets, steps, email)</span>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const IntroductionToPrompting = () => {
  const [currentSection, setCurrentSection] = useState(0);

  const sections = [
    { 
      id: 'intro', 
      title: 'What is AI Prompting?',
      component: <PromptingIntro />
    },
    { 
      id: 'frameworks', 
      title: 'Prompting Frameworks',
      component: <PromptingFrameworks />
    },
    { 
      id: 'rtf-video', 
      title: 'Understanding RTF',
      component: <RTFVideo />
    },
    { 
      id: 'role-practice', 
      title: 'Practice: Choosing Roles',
      component: <RoleMatchingActivity />
    },
    { 
      id: 'task-examples', 
      title: 'What Can AI Do?',
      component: <AITaskExamples />
    },
    { 
      id: 'format-transform', 
      title: 'Format Transformation',
      component: <FormatTransformationActivity />
    },
    { 
      id: 'rtf-builder', 
      title: 'Build Your RTF Prompt',
      component: <RTFPracticeBuilder />
    },
    { 
      id: 'exit-ticket', 
      title: 'Reflection',
      component: <PromptingExitTicket />
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Progress Bar */}
      <div className="sticky top-0 bg-white dark:bg-gray-800 shadow-md z-10">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center mb-2">
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
              Introduction to AI Prompting for Educators
            </h1>
            <span className="text-sm text-gray-600 dark:text-gray-300">
              {currentSection + 1} of {sections.length}
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <motion.div
              className="bg-blue-600 dark:bg-blue-500 h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${((currentSection + 1) / sections.length) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <motion.div
          key={currentSection}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
        >
          {sections[currentSection].component}
        </motion.div>

        {/* Navigation */}
        <div className="flex justify-between mt-8">
          <button
            onClick={() => setCurrentSection(Math.max(0, currentSection - 1))}
            disabled={currentSection === 0}
            className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:bg-gray-400 dark:bg-gray-700 dark:hover:bg-gray-600 dark:disabled:bg-gray-500"
          >
            Previous
          </button>
          <button
            onClick={() => setCurrentSection(Math.min(sections.length - 1, currentSection + 1))}
            disabled={currentSection === sections.length - 1}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 dark:bg-blue-700 dark:hover:bg-blue-600 dark:disabled:bg-gray-500"
          >
            {currentSection === sections.length - 1 ? 'Complete' : 'Next'}
          </button>
        </div>
      </div>
    </div>
  );
};



export default IntroductionToPrompting;