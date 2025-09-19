import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, Send, Sparkles } from 'lucide-react';

interface Props {
  onComplete: () => void;
}

export default function PatternReflection({ onComplete }: Props) {
  const [response, setResponse] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    if (response.trim().length > 20) {
      setSubmitted(true);
      setTimeout(() => {
        onComplete();
      }, 3000);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-xl shadow-xl p-8"
      >
        <div className="flex items-center gap-3 mb-6">
          <MessageSquare className="w-8 h-8 text-blue-600" />
          <h2 className="text-2xl font-bold text-gray-800">
            Reflection: Pattern Recognition
          </h2>
        </div>

        {!submitted ? (
          <>
            <div className="mb-6">
              <p className="text-lg text-gray-700 mb-4">
                You just learned that LLMs work by recognizing patterns in text. 
                Think about your classroom:
              </p>
              <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6">
                <p className="text-blue-800 font-medium">
                  In your own words, explain how an LLM is like a 'pattern recognition system' 
                  rather than a system that truly understands language. How might this 
                  affect how you teach students about AI-generated text?
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <textarea
                value={response}
                onChange={(e) => setResponse(e.target.value)}
                placeholder="Share your thoughts here... (minimum 20 characters)"
                className="w-full h-32 p-4 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none resize-none text-gray-800 placeholder-gray-400"
              />
              
              <button
                onClick={handleSubmit}
                disabled={response.trim().length < 20}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                Submit Reflection
              </button>
            </div>
          </>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
              <Sparkles className="w-12 h-12 text-green-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-green-800 mb-2">
                Excellent Reflection!
              </h3>
              <p className="text-green-700">
                You're thinking critically about how pattern recognition works in both 
                human learning and AI systems. This understanding will help you guide 
                students in using AI tools effectively while maintaining critical thinking skills.
              </p>
            </div>
            <p className="text-gray-600">
              Continuing to the next activity in 3 seconds...
            </p>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}