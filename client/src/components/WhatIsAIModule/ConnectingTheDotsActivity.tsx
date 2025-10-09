import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Brain, Zap, GitBranch, Sparkles, CheckCircle } from 'lucide-react';

interface ConnectingTheDotsActivityProps {
  onComplete: () => void;
}

export default function ConnectingTheDotsActivity({ onComplete }: ConnectingTheDotsActivityProps) {
  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center space-y-3">
        <h2 className="text-3xl font-bold text-gray-900">🔗 Connecting the Dots</h2>
        <p className="text-lg text-gray-600">
          Let's bring it all together: What IS AI and how does it work?
        </p>
      </div>

      {/* What You've Learned Summary */}
      <Card className="border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-blue-50">
        <CardContent className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="h-6 w-6 text-purple-600" />
            <h3 className="text-xl font-bold text-gray-900">What You've Discovered So Far</h3>
          </div>

          <div className="space-y-4">
            {/* From AI in My Day */}
            <div className="bg-white rounded-lg p-4 border-l-4 border-purple-500">
              <h4 className="font-semibold text-gray-900 mb-2">From "AI in My Day":</h4>
              <p className="text-gray-700 text-sm leading-relaxed">
                You discovered that <strong>AI is all around you</strong>—in autocorrect, music recommendations,
                search results, and social media feeds. The key difference? <strong>AI learns from data and adapts</strong>,
                while traditional technology follows the same fixed rules every time.
              </p>
            </div>

            {/* From Intro Video */}
            <div className="bg-white rounded-lg p-4 border-l-4 border-blue-500">
              <h4 className="font-semibold text-gray-900 mb-2">From the Introduction Video:</h4>
              <p className="text-gray-700 text-sm leading-relaxed">
                You learned that <strong>AI stands for Artificial Intelligence</strong>—computers and machines
                that can learn and make decisions. AI doesn't just follow instructions; it can <strong>learn from
                experience</strong> and get better at tasks over time, similar to how humans learn.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* The Big Connection */}
      <Card className="border-2 border-blue-300">
        <CardContent className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <GitBranch className="h-6 w-6 text-blue-600" />
            <h3 className="text-xl font-bold text-gray-900">The Big Connection</h3>
          </div>

          <div className="grid md:grid-cols-3 gap-4 mb-6">
            {/* AI */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-5 border-2 border-purple-300"
            >
              <div className="flex flex-col items-center text-center">
                <Brain className="h-12 w-12 text-purple-600 mb-3" />
                <h4 className="font-bold text-lg text-purple-900 mb-2">AI</h4>
                <p className="text-sm text-purple-800">
                  The overall system that can <strong>learn and adapt</strong>
                </p>
              </div>
            </motion.div>

            {/* Patterns */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-5 border-2 border-blue-300"
            >
              <div className="flex flex-col items-center text-center">
                <Zap className="h-12 w-12 text-blue-600 mb-3" />
                <h4 className="font-bold text-lg text-blue-900 mb-2">Patterns</h4>
                <p className="text-sm text-blue-800">
                  What AI <strong>looks for</strong> in data to make predictions
                </p>
              </div>
            </motion.div>

            {/* Algorithms */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-5 border-2 border-green-300"
            >
              <div className="flex flex-col items-center text-center">
                <GitBranch className="h-12 w-12 text-green-600 mb-3" />
                <h4 className="font-bold text-lg text-green-900 mb-2">Algorithms</h4>
                <p className="text-sm text-green-800">
                  The <strong>step-by-step instructions</strong> AI follows to find patterns
                </p>
              </div>
            </motion.div>
          </div>

          {/* Explanation */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 text-white">
            <h4 className="font-bold text-lg mb-3">💡 How It All Works Together:</h4>
            <div className="space-y-3 text-sm leading-relaxed">
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                <p>
                  <strong>AI</strong> is the big picture—a system that can learn and make decisions.
                </p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                <p>
                  <strong>Algorithms</strong> are like the recipe or instructions that tell the AI what steps to follow.
                  Think of it like a recipe for finding patterns!
                </p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                <p>
                  <strong>Patterns</strong> are what the AI discovers when it follows those algorithms.
                  For example: "People who watch action movies usually like more action movies."
                </p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                <p>
                  Once AI finds patterns, it uses them to <strong>make predictions</strong>—like suggesting
                  the perfect song or knowing what you want to search for before you finish typing!
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Real-World Example */}
      <Card className="bg-gradient-to-r from-orange-50 to-pink-50 border-2 border-orange-200">
        <CardContent className="p-6">
          <h3 className="font-bold text-lg text-gray-900 mb-3">🎯 Real Example: Music Recommendations</h3>
          <div className="space-y-3 text-sm text-gray-700">
            <div className="flex items-start gap-3">
              <span className="font-bold text-purple-600 flex-shrink-0">1.</span>
              <p>
                <strong>The AI system</strong>: Spotify's recommendation system
              </p>
            </div>
            <div className="flex items-start gap-3">
              <span className="font-bold text-blue-600 flex-shrink-0">2.</span>
              <p>
                <strong>The algorithms</strong>: Step-by-step instructions to analyze your listening history—what you play, skip, replay
              </p>
            </div>
            <div className="flex items-start gap-3">
              <span className="font-bold text-green-600 flex-shrink-0">3.</span>
              <p>
                <strong>The patterns found</strong>: "This person listens to pop music on Mondays, rock on weekends, and always skips country"
              </p>
            </div>
            <div className="flex items-start gap-3">
              <span className="font-bold text-orange-600 flex-shrink-0">4.</span>
              <p>
                <strong>The prediction</strong>: "Let's recommend more pop and rock, but never country!"
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Next Up Teaser */}
      <Card className="bg-gradient-to-r from-green-50 to-teal-50 border-2 border-green-200">
        <CardContent className="p-6 text-center">
          <h3 className="font-bold text-lg text-gray-900 mb-2">🎯 Ready for Practice?</h3>
          <p className="text-gray-700 text-sm">
            Now that you understand how AI, patterns, and algorithms work together,
            let's practice spotting patterns step-by-step—just like AI does!
          </p>
        </CardContent>
      </Card>

      {/* Continue Button */}
      <div className="text-center pt-2">
        <Button
          onClick={onComplete}
          size="lg"
          className="w-full md:w-auto text-lg h-14 px-8 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
        >
          Practice Pattern Recognition →
        </Button>
      </div>
    </div>
  );
}
