import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, Zap, Target, User, Bot } from 'lucide-react';

interface ZeroVsFewShotActivityProps {
  onComplete: () => void;
  isDevMode?: boolean;
}

// ── Chat bubble components ──

const UserBubble = ({ children }: { children: React.ReactNode }) => (
  <div className="flex justify-end">
    <div className="flex items-start gap-2 max-w-[85%]">
      <div className="bg-blue-600 text-white rounded-2xl rounded-tr-sm px-4 py-3">
        <p className="text-sm whitespace-pre-line">{children}</p>
      </div>
      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
        <User className="w-4 h-4 text-blue-600" />
      </div>
    </div>
  </div>
);

const AIBubble = ({ children }: { children: React.ReactNode }) => (
  <div className="flex justify-start">
    <div className="flex items-start gap-2 max-w-[85%]">
      <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center shrink-0">
        <Bot className="w-4 h-4 text-purple-600" />
      </div>
      <div className="bg-gray-100 text-gray-900 rounded-2xl rounded-tl-sm px-4 py-3">
        <p className="text-sm whitespace-pre-line">{children}</p>
      </div>
    </div>
  </div>
);

const ZeroVsFewShotActivity: React.FC<ZeroVsFewShotActivityProps> = ({ onComplete, isDevMode }) => {
  const [learnStep, setLearnStep] = useState(0);
  // 0 = intro, 1 = zero-shot, 2 = few-shot, 3 = comparison

  const devModeBar = isDevMode ? (
    <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4 flex items-center justify-between">
      <p className="text-sm font-semibold text-red-800">Dev Mode</p>
      <Button onClick={onComplete} className="bg-green-600 hover:bg-green-700 text-white text-xs px-3 py-1 h-auto" size="sm">
        <Zap className="w-3 h-3 mr-1" /> Skip Activity
      </Button>
    </div>
  ) : null;

  return (
    <Card>
      {devModeBar && <div className="px-6 pt-4">{devModeBar}</div>}
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <Target className="w-6 h-6 text-purple-600" />
          Zero-Shot vs. Few-Shot Prompting
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        <AnimatePresence mode="wait">

          {/* ── Intro ── */}
          {learnStep === 0 && (
            <motion.div key="intro" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-4">
              <div className="bg-purple-50 border border-purple-200 rounded-xl p-5">
                <h3 className="font-bold text-purple-900 text-lg mb-2">Two ways to teach AI what you want</h3>
                <p className="text-purple-800">
                  Sometimes you can just <strong>ask</strong> and the AI gets it. Other times, you need to <strong>show</strong> it what you mean with examples. These two approaches have names:
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Zero-Shot Card */}
                <div className="bg-blue-600 rounded-xl p-5 text-white relative overflow-hidden">
                  <div className="absolute top-2 right-2 text-6xl font-black opacity-10 leading-none">0</div>
                  <span className="bg-white text-blue-700 text-xs font-bold px-2 py-1 rounded inline-block mb-3">ZERO-SHOT</span>
                  <p className="font-bold text-lg leading-tight mb-1">Just ask.</p>
                  <p className="text-blue-100 text-sm">No examples needed — the AI already gets it.</p>
                  <div className="mt-3 bg-blue-700/50 rounded-lg p-2">
                    <p className="font-mono text-xs text-blue-100">"Summarize this article."</p>
                  </div>
                </div>
                {/* Few-Shot Card */}
                <div className="bg-amber-500 rounded-xl p-5 text-white relative overflow-hidden">
                  <div className="absolute top-2 right-2 text-6xl font-black opacity-10 leading-none">3+</div>
                  <span className="bg-white text-amber-700 text-xs font-bold px-2 py-1 rounded inline-block mb-3">FEW-SHOT</span>
                  <p className="font-bold text-lg leading-tight mb-1">Show, then ask.</p>
                  <p className="text-amber-100 text-sm">Give examples first so the AI learns the pattern.</p>
                  <div className="mt-3 bg-amber-600/50 rounded-lg p-2">
                    <p className="font-mono text-xs text-amber-100">"Here are 3 examples..."</p>
                  </div>
                </div>
              </div>

              <Button onClick={() => setLearnStep(1)} className="w-full bg-purple-600 hover:bg-purple-700 text-white">
                See it in action <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </motion.div>
          )}

          {/* ── Zero-Shot example ── */}
          {learnStep === 1 && (
            <motion.div key="zero" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-4">
              <div className="flex items-center gap-2 mb-1">
                <span className="bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded">ZERO-SHOT</span>
                <span className="text-gray-500 text-sm">No examples — just a direct prompt</span>
              </div>

              <div className="bg-white border border-gray-200 rounded-2xl p-4 space-y-3">
                <UserBubble>
                  Turn this vocab word into a memorable definition:{'\n\n'}Photosynthesis
                </UserBubble>
                <AIBubble>
                  Photosynthesis is the process by which green plants and some other organisms use sunlight to synthesize foods from carbon dioxide and water, generating oxygen as a byproduct.
                </AIBubble>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-blue-800 text-sm">
                  It works... but the answer is dry and textbook-y. The AI had no idea what style you wanted.
                </p>
              </div>

              <Button onClick={() => setLearnStep(2)} className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                Now see Few-Shot <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </motion.div>
          )}

          {/* ── Few-Shot example ── */}
          {learnStep === 2 && (
            <motion.div key="few" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-4">
              <div className="flex items-center gap-2 mb-1">
                <span className="bg-amber-600 text-white text-xs font-bold px-2 py-1 rounded">FEW-SHOT</span>
                <span className="text-gray-500 text-sm">Same task, but with examples first</span>
              </div>

              <div className="bg-white border border-gray-200 rounded-2xl p-4 space-y-3">
                <UserBubble>
                  Turn vocab words into memorable definitions using my style:{'\n\n'}Mitosis → "Cell copy-paste. One cell splits into two identical ones. Think: ctrl+C, ctrl+V but for biology."{'\n\n'}Osmosis → "Water being nosy. It moves through a membrane to wherever there's less of it. The ultimate follower."{'\n\n'}Now do:{'\n'}Photosynthesis
                </UserBubble>
                <AIBubble>
                  Photosynthesis → "Plants making their own lunch. They grab sunlight, water, and CO₂ and cook up glucose. Solar-powered kitchen, basically."
                </AIBubble>
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                <p className="text-amber-800 text-sm">
                  By showing 2 examples in your style, the AI matched your vibe perfectly — casual, funny, and actually memorable.
                </p>
              </div>

              <Button onClick={() => setLearnStep(3)} className="w-full bg-amber-600 hover:bg-amber-700 text-white">
                Compare them <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </motion.div>
          )}

          {/* ── Comparison ── */}
          {learnStep === 3 && (
            <motion.div key="compare" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-4">
              <h3 className="font-bold text-gray-900 text-lg">When to use each:</h3>

              <div className="space-y-3">
                <div className="bg-blue-50 border-l-4 border-blue-500 rounded-r-lg p-4">
                  <p className="font-semibold text-blue-900">Zero-Shot works when...</p>
                  <ul className="text-blue-800 text-sm mt-1 space-y-1">
                    <li>• The task is common (summarize, translate, explain)</li>
                    <li>• You don't need a specific style or format</li>
                    <li>• Speed matters more than precision</li>
                  </ul>
                </div>

                <div className="bg-amber-50 border-l-4 border-amber-500 rounded-r-lg p-4">
                  <p className="font-semibold text-amber-900">Few-Shot works when...</p>
                  <ul className="text-amber-800 text-sm mt-1 space-y-1">
                    <li>• You need a specific style, tone, or format</li>
                    <li>• The task is unusual or personal</li>
                    <li>• Zero-shot gives you the wrong vibe</li>
                  </ul>
                </div>
              </div>

              <div className="bg-gray-100 rounded-xl p-4 text-center">
                <p className="text-gray-700 font-medium">
                  Think of it this way: <strong>zero-shot</strong> is like telling someone what to do. <strong>Few-shot</strong> is like showing them what you mean.
                </p>
              </div>

              <Button onClick={onComplete} className="w-full bg-purple-600 hover:bg-purple-700 text-white">
                Continue <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </motion.div>
          )}

        </AnimatePresence>
      </CardContent>
    </Card>
  );
};

export default ZeroVsFewShotActivity;
