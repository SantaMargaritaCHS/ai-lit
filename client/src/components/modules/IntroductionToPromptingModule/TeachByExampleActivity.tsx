import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, CheckCircle, BookOpen, RotateCcw } from 'lucide-react';

interface TeachByExampleActivityProps {
  onComplete: () => void;
  isDevMode?: boolean;
}

interface ExampleCard {
  id: string;
  label: string;
  userMessage: string;
  assistantMessage: string;
  color: string;
}

const SCENARIO = {
  title: 'Tone Shift',
  subtitle: 'Add examples to change how the AI talks',
  basePrompt: 'Explain photosynthesis.',
  baseOutput: `Photosynthesis is the biological process by which green plants, algae, and certain bacteria convert light energy, usually from the Sun, into chemical energy in the form of glucose. This process occurs primarily in the chloroplasts of plant cells, utilizing chlorophyll to absorb light. The general equation is: 6CO2 + 6H2O + light energy -> C6H12O6 + 6O2.`,
  examples: [
    {
      id: 'kid',
      label: 'Kid-Friendly',
      userMessage: 'Explain gravity.',
      assistantMessage: 'You know how when you jump, you always come back down? That\'s gravity! It\'s like the Earth is giving you a big invisible hug and pulling you toward it. Everything that has weight gets pulled — that\'s why your ball falls when you drop it!',
      color: 'bg-blue-100 border-blue-300 text-blue-900',
    },
    {
      id: 'sarcastic',
      label: 'Sarcastic Teen',
      userMessage: 'Explain gravity.',
      assistantMessage: 'Oh, gravity? It\'s basically the universe saying "you\'re not going anywhere." You jump, it pulls you back down. You throw your phone, gravity catches it — with the screen, obviously. Isaac Newton got bonked by an apple and suddenly he\'s a genius. Wild.',
      color: 'bg-pink-100 border-pink-300 text-pink-900',
    },
    {
      id: 'rhyming',
      label: 'Rhyming',
      userMessage: 'Explain gravity.',
      assistantMessage: 'There\'s a force that keeps your feet upon the ground,\nIt pulls things down without a single sound.\nNewton saw an apple fall one day,\nAnd figured out why things don\'t float away!',
      color: 'bg-purple-100 border-purple-300 text-purple-900',
    },
  ] as ExampleCard[],
  outputMap: {
    kid: `So you know how you need to eat food to get energy? Well, plants eat too — but their food is sunlight! They soak up sunshine through their leaves (that's why leaves are usually facing up), mix it with water from their roots and air from, well, the air, and BOOM — they make their own sugar snack. Oh, and they breathe out oxygen while they do it, which is pretty nice of them since we need that to, you know, live.`,
    sarcastic: `Photosynthesis is basically plants being overachievers. While you're struggling to microwave ramen, plants are out here making food from literal SUNLIGHT. They grab some CO2 (the stuff you breathe out), add water, throw in some sunshine, and boom — glucose and oxygen. They're essentially running a restaurant powered by the sun while we can't even remember to water them. The audacity.`,
    rhyming: `The sun shines down upon the leaf so green,\nThe finest food factory you've ever seen!\nWater travels up from roots below,\nWhile CO2 joins in to start the show.\n\nChlorophyll catches light so bright,\nAnd turns it into sugar — what a sight!\nOxygen floats out into the air,\nA gift from plants showing that they care.`,
    'kid,sarcastic': `OK so plants are basically the flex champions of nature. They look at the sun and go "yep, that's lunch." They gobble up sunlight through their leaves — you know, those green things you step on — mix it with water and air, and make their own food. Meanwhile you can't even make toast without setting off the smoke alarm. Oh and they breathe out oxygen too, so you're welcome, humans.`,
    'kid,rhyming': `Plants are hungry, just like you and me,\nBut they eat sunlight — how cool is that to see!\nWater from the ground comes up so high,\nAnd CO2 floats in from the sky.\n\nMix them all together with some sun,\nAnd making food is easy, really fun!\nSugar for the plant, and guess what's more?\nThey make the oxygen that you adore!`,
    'sarcastic,rhyming': `The sun comes out, the plants begin to feast,\nWhile you're still sleeping, facing mostly east.\nChlorophyll does work you'd never do,\nConverting light to food — and saving you.\n\nWater, CO2, a dash of light,\nThe recipe that keeps the world running right.\nPlants don't complain, they never phone it in,\nUnlike some people... but I won't begin.`,
    'kid,sarcastic,rhyming': `The sun wakes up and plants say "time to eat!"\nA solar-powered kitchen — pretty neat!\nWhile you hit snooze for time number three,\nThey're cooking glucose from a recipe.\n\nWater from the dirt, air from the sky,\nMixed with sunshine — easy as pie!\nOut comes oxygen for you to breathe,\nHonestly, plants are TOO generous, I believe.`,
  } as Record<string, string>,
};

const TeachByExampleActivity: React.FC<TeachByExampleActivityProps> = ({
  onComplete,
  isDevMode = false,
}) => {
  const [selectedExamples, setSelectedExamples] = useState<string[]>([]);
  const [hasInteracted, setHasInteracted] = useState(false);

  useEffect(() => {
    if (isDevMode) {
      setSelectedExamples(['kid']);
      setHasInteracted(true);
    }
  }, [isDevMode]);

  const toggleExample = (id: string) => {
    setSelectedExamples((prev) =>
      prev.includes(id) ? prev.filter((e) => e !== id) : [...prev, id],
    );
    setHasInteracted(true);
  };

  const handleReset = () => {
    setSelectedExamples([]);
  };

  const getOutputForSelection = (): string => {
    if (selectedExamples.length === 0) return SCENARIO.baseOutput;
    const key = [...selectedExamples].sort().join(',');
    return SCENARIO.outputMap[key] || SCENARIO.baseOutput;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <BookOpen className="w-6 h-6 text-teal-600" />
          Teach By Example
        </CardTitle>
        <p className="text-gray-600">
          Show the AI what you want by adding example conversations. Watch how the output changes to match.
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="text-center">
          <span className="inline-block bg-teal-100 text-teal-800 text-sm font-semibold px-3 py-1 rounded-full">
            {SCENARIO.title}
          </span>
          <p className="text-gray-600 text-sm mt-1">{SCENARIO.subtitle}</p>
        </div>

        {/* Two-panel layout */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Left: Prompt + examples */}
          <div className="space-y-4">
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <p className="text-xs text-gray-500 font-semibold uppercase tracking-wide mb-1">
                Your Prompt:
              </p>
              <p className="text-gray-900 font-mono text-sm font-medium">
                "{SCENARIO.basePrompt}"
              </p>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-semibold text-gray-700">
                  Add examples to teach the AI:
                </p>
                {selectedExamples.length > 0 && (
                  <button
                    onClick={handleReset}
                    className="text-xs text-gray-500 hover:text-gray-700 flex items-center gap-1"
                  >
                    <RotateCcw className="w-3 h-3" />
                    Reset
                  </button>
                )}
              </div>
              <div className="space-y-3">
                {SCENARIO.examples.map((example) => {
                  const isSelected = selectedExamples.includes(example.id);
                  return (
                    <button
                      key={example.id}
                      onClick={() => toggleExample(example.id)}
                      className={`w-full text-left rounded-lg border-2 p-3 transition-all ${
                        isSelected
                          ? `${example.color} ring-2 ring-offset-1`
                          : 'bg-white border-gray-200 hover:border-teal-300'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-bold text-gray-800">
                          {example.label}
                        </span>
                        {isSelected && (
                          <CheckCircle className="w-4 h-4 text-green-600" />
                        )}
                      </div>
                      <div className="text-xs text-gray-600 space-y-1">
                        <p>
                          <span className="font-semibold">User:</span> {example.userMessage}
                        </p>
                        <p className="whitespace-pre-line">
                          <span className="font-semibold">AI:</span> {example.assistantMessage}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right: AI output */}
          <div className="space-y-4">
            <div className="sticky top-4">
              <AnimatePresence mode="wait">
                <motion.div
                  key={selectedExamples.join(',')}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className={`rounded-lg border-2 p-5 ${
                    selectedExamples.length > 0
                      ? 'bg-teal-50 border-teal-300'
                      : 'bg-gray-50 border-gray-200'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                      AI Output
                    </span>
                    {selectedExamples.length > 0 && (
                      <span className="text-xs bg-teal-200 text-teal-800 px-2 py-0.5 rounded-full">
                        {selectedExamples.length} example{selectedExamples.length > 1 ? 's' : ''} applied
                      </span>
                    )}
                  </div>
                  <p className="text-gray-800 text-sm whitespace-pre-line leading-relaxed">
                    {getOutputForSelection()}
                  </p>
                </motion.div>
              </AnimatePresence>

              {selectedExamples.length === 0 && (
                <p className="text-center text-xs text-gray-500 mt-2">
                  Select at least one example to see the output change
                </p>
              )}
            </div>
          </div>
        </div>

        {/* "Try this tonight" challenge card + Continue */}
        {hasInteracted && selectedExamples.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <div className="bg-gradient-to-r from-teal-50 to-cyan-50 border border-teal-200 rounded-lg p-4">
              <p className="text-sm font-semibold text-teal-900 mb-1">Try this tonight</p>
              <p className="text-sm text-gray-800">
                Next time you use ChatGPT, paste an example of the writing style you want before asking it to write something. This is called "few-shot prompting" — and it works even better than detailed instructions.
              </p>
            </div>

            <div className="flex justify-center">
              <Button
                onClick={onComplete}
                size="lg"
                className="bg-teal-600 hover:bg-teal-700 text-white"
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

export default TeachByExampleActivity;
