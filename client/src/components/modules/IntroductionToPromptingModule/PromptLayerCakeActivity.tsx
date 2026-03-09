import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, CheckCircle, Layers, Plus } from 'lucide-react';

interface PromptLayerCakeActivityProps {
  onComplete: () => void;
  isDevMode?: boolean;
}

interface Layer {
  id: number;
  label: string;
  shortLabel: string;
  promptAddition: string;
  color: string;
  bgColor: string;
  borderColor: string;
  textColor: string;
  output: string;
}

const LAYERS: Layer[] = [
  {
    id: 0,
    label: 'Base Prompt',
    shortLabel: 'Base',
    promptAddition: 'Help me make a study plan for finals.',
    color: 'bg-gray-400',
    bgColor: 'bg-gray-50',
    borderColor: 'border-gray-300',
    textColor: 'text-gray-800',
    output: `Sure! Here are some tips for studying for finals:

1. Start studying early
2. Make a schedule
3. Review your notes
4. Take breaks
5. Get plenty of sleep

Good luck with your finals!`,
  },
  {
    id: 1,
    label: '+ Role',
    shortLabel: 'Role',
    promptAddition: 'Act as a study coach who specializes in helping high school students prepare for exams.',
    color: 'bg-blue-500',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-300',
    textColor: 'text-blue-900',
    output: `As a study coach, here's the real talk on finals prep:

The #1 mistake students make is trying to study everything the same way. Your brain doesn't work like that. Different subjects need different strategies.

For memorization-heavy classes (history, vocab), spaced repetition beats re-reading every time. For problem-solving classes (math, science), you need to actually DO problems, not just review your notes.

Start by ranking your exams from hardest to easiest, then give the hard ones more time. Most students study what they're already good at because it feels productive — but that's a trap.

And here's something nobody tells you: studying in 45-minute blocks with 10-minute breaks actually helps you remember MORE than grinding for 3 hours straight.`,
  },
  {
    id: 2,
    label: '+ Specific Task',
    shortLabel: 'Task',
    promptAddition: 'Create a 5-day study plan. I have AP US History on Thursday and Chemistry on Friday. I can study about 3 hours each evening.',
    color: 'bg-green-500',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-300',
    textColor: 'text-green-900',
    output: `Here's your 5-day finals plan (Mon–Fri, 3 hrs/evening):

MONDAY — History Focus (2 hrs History, 1 hr Chem)
Start with your weakest APUSH unit. Make a timeline of key events and practice connecting causes to effects. Use your last hour to review Chemistry formulas you've been shaky on.

TUESDAY — Chemistry Focus (1 hr History, 2 hrs Chem)
Flip the ratio. Work through practice problems for your toughest Chemistry topics — don't just read your notes, actually solve problems from scratch. Use your History hour to do a practice DBQ or short-answer question.

WEDNESDAY — Split Day (1.5 hrs each)
This is your "simulate the test" day. Do a timed practice section for each subject. For APUSH, practice writing a thesis statement in under 5 minutes. For Chemistry, do a full problem set without looking at notes.

THURSDAY — History Exam Day (morning: exam, evening: 3 hrs Chem)
After your APUSH exam, take a real break — eat, move around, decompress. Then spend your evening doing a full Chemistry review. Focus on problem types that showed up on recent quizzes.

FRIDAY — Chemistry Exam Day
Light 30-minute review of formulas in the morning. Trust your preparation. You've got this.`,
  },
  {
    id: 3,
    label: '+ Format',
    shortLabel: 'Format',
    promptAddition: 'Format it as a daily checklist with checkboxes, and include a confidence-check rating (1-10) for each day so I can track how ready I feel.',
    color: 'bg-pink-500',
    bgColor: 'bg-pink-50',
    borderColor: 'border-pink-300',
    textColor: 'text-pink-900',
    output: `5-DAY FINALS STUDY PLAN
AP US History (Thursday) + Chemistry (Friday)
3 hours per evening | Confidence tracking included

━━━ MONDAY — History Heavy ━━━          Confidence: _/10
[ ] Review weakest APUSH unit (45 min)
[ ] Build cause-effect timeline for that unit (30 min)
[ ] Practice 1 short-answer question (15 min)
[ ] Break (10 min)
[ ] Chemistry formula review — write them from memory (30 min)
[ ] Fix any formulas you got wrong (20 min)

━━━ TUESDAY — Chemistry Heavy ━━━       Confidence: _/10
[ ] APUSH: Practice 1 DBQ thesis + outline (30 min)
[ ] APUSH: Review key terms from 2 strongest units (30 min)
[ ] Break (10 min)
[ ] Chemistry: Work through hardest problem set (45 min)
[ ] Chemistry: Redo any missed quiz problems (25 min)

━━━ WEDNESDAY — Test Simulation ━━━      Confidence: _/10
[ ] APUSH: Timed practice — write a thesis in 5 min (15 min)
[ ] APUSH: Answer 2 SAQs without notes (30 min)
[ ] APUSH: Check answers and fill gaps (15 min)
[ ] Break (10 min)
[ ] Chemistry: Full problem set, no notes (45 min)
[ ] Chemistry: Review mistakes and rework (15 min)

━━━ THURSDAY — APUSH Exam Day ━━━        Confidence: _/10
[ ] Morning: Take APUSH exam
[ ] Afternoon: Real break — eat, walk, decompress
[ ] Evening: Full Chemistry review session (2 hrs)
[ ] Focus on problem types from recent quizzes (45 min)
[ ] Write out all formulas one last time (15 min)

━━━ FRIDAY — Chemistry Exam Day ━━━      Confidence: _/10
[ ] Morning: Light formula review only (30 min max)
[ ] Trust your prep. You're ready.
[ ] Take Chemistry exam

━━━ READINESS CHECK ━━━
If any day's confidence is below 5, spend extra time there.
By Thursday morning, aim for 7+ on History.
By Friday morning, aim for 7+ on Chemistry.`,
  },
];

const PromptLayerCakeActivity: React.FC<PromptLayerCakeActivityProps> = ({
  onComplete,
  isDevMode = false,
}) => {
  const [currentLayer, setCurrentLayer] = useState(0);
  const [viewedLayer, setViewedLayer] = useState(0);
  const [allDone, setAllDone] = useState(false);

  useEffect(() => {
    if (isDevMode) {
      setAllDone(true);
    }
  }, [isDevMode]);

  const handleAddLayer = () => {
    if (currentLayer < LAYERS.length - 1) {
      const next = currentLayer + 1;
      setCurrentLayer(next);
      setViewedLayer(next);
    } else {
      setAllDone(true);
    }
  };

  const handleViewLayer = (idx: number) => {
    if (idx <= viewedLayer) {
      setCurrentLayer(idx);
    }
  };

  if (allDone) {
    return (
      <Card>
        <CardContent className="p-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-6"
          >
            <h3 className="text-2xl font-bold text-gray-900 text-center">Your Full Prompt</h3>
            <p className="text-gray-700 text-center">
              Here's everything you built, layer by layer:
            </p>
            <div className="bg-gray-900 rounded-lg p-6 max-w-2xl mx-auto space-y-3">
              {LAYERS.map((layer) => (
                <p key={layer.id} className={`text-sm font-mono leading-relaxed ${
                  layer.id === 0 ? 'text-gray-300' :
                  layer.id === 1 ? 'text-blue-400' :
                  layer.id === 2 ? 'text-green-400' :
                  'text-pink-400'
                }`}>
                  {layer.promptAddition}
                </p>
              ))}
            </div>
            <p className="text-center text-sm text-gray-600">
              Each color is one layer you added. Together, they transform a generic response into a personalized study plan.
            </p>
            <div className="flex justify-center">
              <Button
                onClick={onComplete}
                size="lg"
                className="bg-pink-600 hover:bg-pink-700 text-white"
              >
                Continue to Exit Ticket <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </div>
          </motion.div>
        </CardContent>
      </Card>
    );
  }

  const activeLayer = LAYERS[currentLayer];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <Layers className="w-6 h-6 text-pink-600" />
          Prompt Layer Cake
        </CardTitle>
        <p className="text-gray-600">
          Build a powerful prompt one layer at a time. Watch how each addition transforms the output.
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid md:grid-cols-5 gap-6">
          {/* Left: The Cake (2 cols) */}
          <div className="md:col-span-2 space-y-3">
            <p className="text-sm font-semibold text-gray-700">Prompt Layers:</p>
            <div className="flex flex-col-reverse gap-2">
              {LAYERS.slice(0, viewedLayer + 1).map((layer) => (
                <motion.button
                  key={layer.id}
                  initial={{ opacity: 0, scaleY: 0 }}
                  animate={{ opacity: 1, scaleY: 1 }}
                  transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                  onClick={() => handleViewLayer(layer.id)}
                  className={`w-full text-left rounded-lg border-2 p-3 transition-all ${
                    currentLayer === layer.id
                      ? `${layer.bgColor} ${layer.borderColor} ring-2 ring-offset-1`
                      : 'bg-white border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-3 h-3 rounded-full flex-shrink-0 ${layer.color}`}
                    />
                    <span className="text-sm font-semibold text-gray-800">
                      {layer.label}
                    </span>
                    {currentLayer === layer.id && (
                      <CheckCircle className="w-4 h-4 text-green-600 ml-auto flex-shrink-0" />
                    )}
                  </div>
                  <p className="text-xs text-gray-600 mt-1 ml-5 line-clamp-2">
                    {layer.promptAddition}
                  </p>
                </motion.button>
              ))}
            </div>

            {/* Add Layer button */}
            {viewedLayer < LAYERS.length - 1 && currentLayer === viewedLayer && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Button
                  onClick={handleAddLayer}
                  className={`w-full text-white ${LAYERS[viewedLayer + 1].color} hover:opacity-90`}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add: {LAYERS[viewedLayer + 1].label}
                </Button>
              </motion.div>
            )}

            {/* Final button when all layers shown */}
            {viewedLayer === LAYERS.length - 1 && currentLayer === viewedLayer && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Button
                  onClick={handleAddLayer}
                  size="lg"
                  className="w-full bg-green-600 hover:bg-green-700 text-white"
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  See Your Full Prompt
                </Button>
              </motion.div>
            )}
          </div>

          {/* Right: Output (3 cols) */}
          <div className="md:col-span-3">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentLayer}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className={`rounded-lg border-2 p-5 ${activeLayer.bgColor} ${activeLayer.borderColor}`}
              >
                <div className="flex items-center gap-2 mb-3">
                  <div
                    className={`w-3 h-3 rounded-full ${activeLayer.color}`}
                  />
                  <span className={`text-sm font-semibold ${activeLayer.textColor}`}>
                    {activeLayer.label} — AI Output
                  </span>
                  <span className="text-xs bg-white bg-opacity-60 text-gray-600 px-2 py-0.5 rounded-full ml-auto">
                    Layer {currentLayer + 1} of {LAYERS.length}
                  </span>
                </div>

                {/* Prompt text */}
                <div className="bg-white bg-opacity-70 rounded-lg p-3 mb-3 border border-gray-200">
                  <p className="text-xs text-gray-500 font-semibold uppercase tracking-wide mb-1">
                    Prompt addition:
                  </p>
                  <p className="text-gray-800 font-mono text-xs">
                    "{activeLayer.promptAddition}"
                  </p>
                </div>

                {/* Output */}
                <div className="bg-white rounded-lg p-4 border border-gray-200 max-h-96 overflow-y-auto">
                  <p className="text-gray-800 text-sm whitespace-pre-line leading-relaxed">
                    {activeLayer.output}
                  </p>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PromptLayerCakeActivity;
