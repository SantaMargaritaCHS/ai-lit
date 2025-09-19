import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sparkles, Brain, ArrowRight, MessageSquare, Palette, Code, Music, Lightbulb, Target } from 'lucide-react';
import { motion } from 'framer-motion';

interface GenerativeAITransitionProps {
  onComplete: () => void;
}

export const GenerativeAITransition: React.FC<GenerativeAITransitionProps> = ({ onComplete }) => {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-purple-300">
        <CardContent className="p-8">
          {/* Header */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="text-center mb-8"
          >
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mb-4">
              <Sparkles className="h-10 w-10 text-white" />
            </div>
            
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Welcome to the Generative AI Era!
            </h2>
            <p className="text-lg text-purple-700 max-w-2xl mx-auto">
              You've witnessed an incredible transformation - from AI that could only analyze 
              to AI that creates. And the best part? You're living in this revolutionary time!
            </p>
          </motion.div>

          {/* Simple Comparison */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <Card className="bg-white border-blue-200">
              <CardContent className="p-6 text-center">
                <Brain className="h-12 w-12 text-blue-600 mx-auto mb-3" />
                <h3 className="font-bold text-gray-800 mb-2">Before 2018</h3>
                <p className="text-gray-700 mb-3">AI could only work with what exists:</p>
                <div className="space-y-2 text-sm text-gray-600">
                  <div>📧 Filter your emails</div>
                  <div>📷 Recognize faces</div>
                  <div>🎯 Recommend movies</div>
                  <div>♟️ Play games</div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-purple-300">
              <CardContent className="p-6 text-center">
                <Sparkles className="h-12 w-12 text-purple-600 mx-auto mb-3" />
                <h3 className="font-bold text-purple-800 mb-2">Today (2024)</h3>
                <p className="text-purple-700 mb-3">AI creates brand new things:</p>
                <div className="space-y-2 text-sm text-purple-600">
                  <div>✍️ Write original stories</div>
                  <div>🎨 Create unique artwork</div>
                  <div>💻 Generate working code</div>
                  <div>🎵 Compose new music</div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* What Changed Everything */}
          <div className="bg-white rounded-lg p-6 mb-6 border border-purple-200">
            <h3 className="font-semibold text-gray-800 mb-3 text-center">
              The ChatGPT Revolution
            </h3>
            <p className="text-gray-700 text-center mb-4">
              Before ChatGPT, generative AI was complex and technical. ChatGPT changed that by making it as simple as having a conversation. No coding, no complex tools - just type and create!
            </p>
            <div className="flex justify-center space-x-8">
              <div className="text-center">
                <div className="text-3xl mb-1">🔬</div>
                <p className="text-sm text-gray-600">Before: Labs & Tech Companies</p>
              </div>
              <div className="text-center">
                <div className="text-3xl mb-1">→</div>
              </div>
              <div className="text-center">
                <div className="text-3xl mb-1">🌍</div>
                <p className="text-sm text-gray-600">After: Everyone, Everywhere</p>
              </div>
            </div>
          </div>

          {/* The Memorable Takeaway */}
          <Card className="bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-300 mb-6">
            <CardContent className="p-4">
              <p className="text-center text-lg text-yellow-900">
                <strong>Remember:</strong> Traditional AI is like a <strong>librarian</strong> 📚 who finds information.
                <br />
                Generative AI is like an <strong>author</strong> ✍️ who writes new stories!
              </p>
            </CardContent>
          </Card>

          {/* Continue Button */}
          <div className="text-center">
            <Button
              onClick={onComplete}
              size="lg"
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
            >
              Continue Learning
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};