import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowRight, CheckCircle, Brain, Zap, ListChecks } from 'lucide-react';

interface ThinkOutLoudActivityProps {
  onComplete: () => void;
  isDevMode?: boolean;
}

const EXAMPLE = {
  question: 'Is this movie review positive or negative?\n\n"Oh wow, where do I start? The plot was SO original — I\'ve only seen it in about twelve other movies. The lead actor really brought his A-game, if by A-game you mean staring blankly while things explode. And the dialogue? Pure poetry. If poetry were written by a caffeinated chatbot. But hey, at least the popcorn was good."',
  quickAnswer: 'This is a positive review. The reviewer says the plot is "original," the actor brought his "A-game," and calls the dialogue "pure poetry."',
  quickCorrect: false,
  stepByStepAnswer: `Let me analyze the tone carefully:

1. "SO original — I've only seen it in about twelve other movies"
   → Sarcastic. Saying it's been done many times before.

2. "brought his A-game, if by A-game you mean staring blankly"
   → Sarcastic. Actually says the acting was terrible.

3. "Pure poetry. If poetry were written by a caffeinated chatbot."
   → Sarcastic. The dialogue was bad/robotic.

4. "at least the popcorn was good"
   → The only genuine compliment is about the snacks, not the movie.

This is a clearly NEGATIVE review disguised in sarcastic language. Every "compliment" is immediately undercut.`,
  stepByStepCorrect: true,
  verdictExplanation: 'The quick answer took the sarcastic compliments at face value. Step-by-step reasoning examines each sentence and notices that every positive phrase is immediately contradicted — a classic sarcasm pattern that surface-level reading misses.',
};

const ThinkOutLoudActivity: React.FC<ThinkOutLoudActivityProps> = ({
  onComplete,
  isDevMode = false,
}) => {
  const [viewedTabs, setViewedTabs] = useState<Set<string>>(new Set());
  const [verdictRevealed, setVerdictRevealed] = useState(false);

  useEffect(() => {
    if (isDevMode) {
      setVerdictRevealed(true);
      setViewedTabs(new Set(['quick', 'step']));
    }
  }, [isDevMode]);

  const markTabViewed = (tab: string) => {
    setViewedTabs((prev) => {
      const updated = new Set(prev);
      updated.add(tab);
      return updated;
    });
  };

  const bothTabsViewed = viewedTabs.has('quick') && viewedTabs.has('step');

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <Brain className="w-6 h-6 text-purple-600" />
          Think Out Loud
        </CardTitle>
        <p className="text-gray-600">
          Compare a quick AI answer vs. a "think step by step" answer. Which one gets it right?
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Question */}
        <div className="bg-gray-50 border-2 border-gray-200 rounded-lg p-5">
          <p className="text-xs text-gray-500 font-semibold uppercase tracking-wide mb-2">
            The Question:
          </p>
          <p className="text-gray-900 font-medium whitespace-pre-line">{EXAMPLE.question}</p>
        </div>

        {/* Tabs: Quick vs Step-by-Step */}
        <Tabs
          defaultValue="quick"
          onValueChange={(val: string) => markTabViewed(val)}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger
              value="quick"
              className="flex items-center gap-2"
              onClick={() => markTabViewed('quick')}
            >
              <Zap className="w-4 h-4" />
              Quick Answer
            </TabsTrigger>
            <TabsTrigger
              value="step"
              className="flex items-center gap-2"
              onClick={() => markTabViewed('step')}
            >
              <ListChecks className="w-4 h-4" />
              Think Step by Step
            </TabsTrigger>
          </TabsList>
          <TabsContent value="quick">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`rounded-lg p-5 border-2 ${
                verdictRevealed && !EXAMPLE.quickCorrect
                  ? 'bg-red-50 border-red-300'
                  : 'bg-orange-50 border-orange-200'
              }`}
            >
              <div className="flex items-center gap-2 mb-2">
                <Zap className="w-4 h-4 text-orange-600" />
                <span className="text-sm font-semibold text-orange-800">
                  Quick Answer (no reasoning)
                </span>
                {verdictRevealed && (
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-red-200 text-red-800">
                    WRONG
                  </span>
                )}
              </div>
              <p className="text-gray-800 text-sm whitespace-pre-line">
                {EXAMPLE.quickAnswer}
              </p>
            </motion.div>
          </TabsContent>
          <TabsContent value="step">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`rounded-lg p-5 border-2 ${
                verdictRevealed
                  ? 'bg-green-50 border-green-300'
                  : 'bg-purple-50 border-purple-200'
              }`}
            >
              <div className="flex items-center gap-2 mb-2">
                <ListChecks className="w-4 h-4 text-purple-600" />
                <span className="text-sm font-semibold text-purple-800">
                  Step-by-Step Answer
                </span>
                {verdictRevealed && (
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-green-200 text-green-800">
                    CORRECT
                  </span>
                )}
              </div>
              <p className="text-gray-800 text-sm whitespace-pre-line">
                {EXAMPLE.stepByStepAnswer}
              </p>
            </motion.div>
          </TabsContent>
        </Tabs>

        {/* Hint to view both tabs */}
        {!bothTabsViewed && !verdictRevealed && (
          <p className="text-center text-sm text-gray-500">
            View both tabs to unlock the verdict
          </p>
        )}

        {/* Reveal Verdict button */}
        {bothTabsViewed && !verdictRevealed && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-center"
          >
            <Button
              onClick={() => setVerdictRevealed(true)}
              className="bg-purple-600 hover:bg-purple-700 text-white"
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              Reveal the Verdict
            </Button>
          </motion.div>
        )}

        {/* Verdict explanation + Pro tip + Continue */}
        {verdictRevealed && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <div className="bg-purple-50 border-2 border-purple-300 rounded-lg p-5">
              <p className="font-bold text-purple-900 mb-2">Why did step-by-step win?</p>
              <p className="text-gray-800 text-sm">{EXAMPLE.verdictExplanation}</p>
            </div>

            <div className="bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200 rounded-lg p-4">
              <p className="text-sm font-semibold text-purple-900 mb-1">Pro tip</p>
              <p className="text-sm text-gray-800">
                Adding "think step by step" or "show your reasoning" to a prompt forces AI to slow down and work through problems carefully — catching mistakes that quick answers miss.
              </p>
            </div>

            <div className="flex justify-center">
              <Button
                onClick={onComplete}
                size="lg"
                className="bg-purple-600 hover:bg-purple-700 text-white"
              >
                Continue <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </div>
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
};

export default ThinkOutLoudActivity;
