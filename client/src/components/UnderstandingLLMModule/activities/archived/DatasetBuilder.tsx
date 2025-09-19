// ✅ FIXED: White text on white background - fixed in this file
// ISSUE: Activity too complex - will be replaced in file 4

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Database, Plus, Check, Trash2, BookOpen } from 'lucide-react';
import { darkTheme } from '../styles/darkTheme';

interface Props {
  onComplete: () => void;
}

interface DataExample {
  id: string;
  input: string;
  output: string;
}

const STARTER_EXAMPLES: DataExample[] = [
  {
    id: '1',
    input: 'What is the capital of France?',
    output: 'The capital of France is Paris.'
  },
  {
    id: '2',
    input: 'How do plants make food?',
    output: 'Plants make food through photosynthesis, using sunlight, water, and carbon dioxide.'
  }
];

export default function DatasetBuilder({ onComplete }: Props) {
  const [examples, setExamples] = useState<DataExample[]>(STARTER_EXAMPLES);
  const [newInput, setNewInput] = useState('');
  const [newOutput, setNewOutput] = useState('');
  const [showingHint, setShowingHint] = useState(false);

  const addExample = () => {
    if (newInput.trim() && newOutput.trim()) {
      setExamples([...examples, {
        id: Date.now().toString(),
        input: newInput,
        output: newOutput
      }]);
      setNewInput('');
      setNewOutput('');
    }
  };

  const removeExample = (id: string) => {
    setExamples(examples.filter(ex => ex.id !== id));
  };

  const canComplete = examples.length >= 4;

  return (
    <div className="max-w-5xl mx-auto p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`${darkTheme.bgPrimary} rounded-xl shadow-xl p-8`}
      >
        <div className="flex items-center gap-3 mb-6">
          <Database className="w-8 h-8 text-green-400" />
          <h2 className={`text-2xl font-bold ${darkTheme.textPrimary}`}>
            Build a Mini Training Dataset
          </h2>
        </div>

        <div className="mb-6">
          <p className={`${darkTheme.textSecondary} mb-4`}>
            LLMs learn from examples. Create a mini dataset that could teach an AI to answer 
            questions about your subject area. Add at least 2 more examples!
          </p>
          
          <button
            onClick={() => setShowingHint(!showingHint)}
            className={`${darkTheme.textAccent} hover:text-blue-300 underline text-sm transition-colors`}
          >
            Need ideas?
          </button>
          
          <AnimatePresence>
            {showingHint && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className={`mt-2 ${darkTheme.cardHighlight} p-4`}
              >
                <p className="text-blue-200 text-sm">
                  Try classroom scenarios: "How should students cite sources?" → "Students should...",
                  or subject-specific: "What is the water cycle?" → "The water cycle is..."
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Existing Examples */}
        <div className="space-y-3 mb-6 max-h-64 overflow-y-auto">
          <AnimatePresence>
            {examples.map((example) => (
              <motion.div
                key={example.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className={`${darkTheme.card} p-4`}
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="flex-1">
                    <div className="mb-2">
                      <span className={`${darkTheme.textAccent} font-medium`}>Input:</span>
                      <p className={darkTheme.textPrimary}>{example.input}</p>
                    </div>
                    <div>
                      <span className="text-green-400 font-medium">Output:</span>
                      <p className={darkTheme.textPrimary}>{example.output}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => removeExample(example.id)}
                    className="ml-4 p-2 text-red-400 hover:bg-red-900/30 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Add New Example */}
        <div className="bg-green-900/20 border-2 border-dashed border-green-400/50 rounded-lg p-4 mb-6">
          <h3 className="font-medium text-green-300 mb-3 flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Add New Training Example
          </h3>
          <div className="space-y-3">
            <div>
              <label className={`block text-sm font-medium ${darkTheme.textSecondary} mb-1`}>
                Question/Input:
              </label>
              <input
                type="text"
                value={newInput}
                onChange={(e) => setNewInput(e.target.value)}
                placeholder="What question should the AI learn to answer?"
                className={`w-full px-4 py-2 ${darkTheme.input} hover:border-blue-300 transition-colors rounded-lg`}
              />
            </div>
            <div>
              <label className={`block text-sm font-medium ${darkTheme.textSecondary} mb-1`}>
                Expected Answer/Output:
              </label>
              <textarea
                value={newOutput}
                onChange={(e) => setNewOutput(e.target.value)}
                placeholder="What should the AI respond with?"
                className={`w-full px-4 py-2 ${darkTheme.input} hover:border-blue-300 transition-colors rounded-lg h-24`}
              />
            </div>
            <button
              onClick={addExample}
              disabled={!newInput.trim() || !newOutput.trim()}
              className={`w-full py-2 rounded-lg font-medium transition-all duration-200 ${
                newInput.trim() && newOutput.trim()
                  ? 'bg-green-600 text-white hover:bg-green-700'
                  : 'bg-gray-600 text-gray-400 cursor-not-allowed'
              }`}
            >
              Add to Dataset
            </button>
          </div>
        </div>

        {/* Complete Button */}
        <div className="flex justify-between items-center">
          <p className={darkTheme.textSecondary}>
            {examples.length} examples in dataset
            {canComplete && <Check className="inline w-5 h-5 text-green-400 ml-2" />}
          </p>
          <motion.button
            whileHover={{ scale: canComplete ? 1.02 : 1 }}
            whileTap={{ scale: canComplete ? 0.98 : 1 }}
            onClick={onComplete}
            disabled={!canComplete}
            className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
              canComplete
                ? 'bg-green-600 text-white hover:bg-green-700'
                : 'bg-gray-600 text-gray-400 cursor-not-allowed'
            }`}
          >
            Complete Dataset ({examples.length}/4 minimum)
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}