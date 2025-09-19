import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { ArrowRight, Calendar, Cpu, Eye, MessageSquare, Sparkles } from 'lucide-react';

interface AIThenVsNowProps {
  onComplete: () => void;
}

const comparisons = [
  {
    id: 1,
    icon: MessageSquare,
    then: {
      year: "1950",
      title: "Turing Test",
      description: "Alan Turing proposed a test to see if machines could convince humans they were talking to another person",
      capability: "Text-based conversation mimicry"
    },
    now: {
      year: "2024", 
      title: "ChatGPT - Generative AI",
      description: "AI that doesn't just analyze text - it CREATES entirely new content: stories, code, poems, and solutions that never existed before!",
      capability: "Creates original content from scratch",
      isGenerative: true
    }
  },
  {
    id: 2,
    icon: Cpu,
    then: {
      year: "1997",
      title: "Deep Blue Chess",
      description: "Specialized computer that could only play chess, beating world champion Garry Kasparov",
      capability: "Single-task mastery: chess only"
    },
    now: {
      year: "2024",
      title: "Multimodal AI Systems", 
      description: "AI that can play games, write code, create art, analyze data, and solve diverse problems",
      capability: "Multi-task intelligence across countless domains"
    }
  },
  {
    id: 3,
    icon: Eye,
    then: {
      year: "2012",
      title: "Cat Recognition",
      description: "AI breakthrough: Google's system learned to recognize cats in YouTube videos",
      capability: "Identifying simple objects in still images"
    },
    now: {
      year: "2024",
      title: "Real-time Video Analysis",
      description: "AI can analyze live video, identify thousands of objects, track movements, and understand scenes",
      capability: "Real-time analysis of complex video with context understanding"
    }
  }
];

export const AIThenVsNow: React.FC<AIThenVsNowProps> = ({ onComplete }) => {
  const [currentComparison, setCurrentComparison] = useState(0);
  
  const current = comparisons[currentComparison];
  const Icon = current.icon;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          AI Evolution: Then vs Now
        </h2>
        <p className="text-gray-600">
          Comparison {currentComparison + 1} of {comparisons.length}
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6 items-center mb-8">
        {/* Then - Left Side */}
        <motion.div
          key={`then-${current.id}`}
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <Card className="border-orange-200 bg-orange-50 h-full">
            <CardContent className="p-6 text-center">
              <h3 className="text-lg font-semibold text-orange-600 mb-2">THEN</h3>
              <Icon className="w-12 h-12 mx-auto mb-4 text-orange-600" />
              <h4 className="text-xl font-bold text-orange-800 mb-2">
                {current.then.year}
              </h4>
              <h5 className="text-lg font-semibold text-orange-700 mb-3">
                {current.then.title}
              </h5>
              <p className="text-orange-600 mb-4 text-sm">
                {current.then.description}
              </p>
              <div className="bg-orange-100 rounded-lg p-3">
                <p className="text-xs font-medium text-orange-800">
                  {current.then.capability}
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Now - Right Side */}
        <motion.div
          key={`now-${current.id}`}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <Card className="border-blue-200 bg-blue-50 h-full">
            <CardContent className="p-6 text-center">
              <h3 className="text-lg font-semibold text-blue-600 mb-2">NOW</h3>
              <Icon className="w-12 h-12 mx-auto mb-4 text-blue-600" />
              <h4 className="text-xl font-bold text-blue-800 mb-2">
                {current.now.year}
              </h4>
              <h5 className="text-lg font-semibold text-blue-700 mb-3">
                {current.now.title}
              </h5>
              <p className="text-blue-600 mb-4 text-sm">
                {current.now.description}
              </p>
              <div className="bg-blue-100 rounded-lg p-3">
                <p className="text-xs font-medium text-blue-800">
                  {current.now.capability}
                </p>
              </div>
              
              {current.now.isGenerative && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="bg-gradient-to-r from-purple-100 to-pink-100 border border-purple-300 rounded-lg p-2 mt-3"
                >
                  <div className="flex items-center justify-center">
                    <Sparkles className="h-4 w-4 text-purple-600 mr-2" />
                    <span className="text-sm font-semibold text-purple-700">
                      ✨ This is Generative AI - It creates new content!
                    </span>
                  </div>
                </motion.div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <div className="text-center">
        <Button
          onClick={() => {
            if (currentComparison < comparisons.length - 1) {
              setCurrentComparison(prev => prev + 1);
            } else {
              onComplete();
            }
          }}
          className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg"
        >
          {currentComparison < comparisons.length - 1 ? 'Next Comparison →' : 'Continue →'}
        </Button>
      </div>
    </div>
  );
};