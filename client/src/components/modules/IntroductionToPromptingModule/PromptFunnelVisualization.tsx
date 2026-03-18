import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface PromptFunnelVisualizationProps {
  onComplete: () => void;
}

function seededRandom(seed: number) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

interface Dot {
  id: number;
  x: number;
  y: number;
  size: number;
  colorClass: string;
  survivesUntil: number;
}

const DOT_COLORS = [
  'bg-blue-400', 'bg-purple-400', 'bg-pink-400', 'bg-green-400',
  'bg-yellow-400', 'bg-red-400', 'bg-indigo-400', 'bg-teal-400',
  'bg-orange-400', 'bg-cyan-400', 'bg-rose-400', 'bg-emerald-400',
];

// Each layer adds one segment to the growing prompt
const LAYERS = [
  {
    title: 'Starting Prompt',
    // The vague prompt shown before narrowing begins
    vaguePrompt: '"Help me with school"',
    segment: null,
    count: '10,000+',
    textColor: 'text-gray-500',
    highlightClass: 'text-gray-500 bg-gray-100',
    border: 'border-gray-300',
    badgeBg: 'bg-gray-100',
    badgeText: 'text-gray-600',
    principle: null,
  },
  {
    title: 'Be Specific',
    vaguePrompt: null,
    segment: 'Create 10 flashcards on Chapter 5 photosynthesis vocabulary',
    count: '~500',
    textColor: 'text-blue-700',
    highlightClass: 'text-blue-800 bg-blue-100 rounded px-0.5',
    border: 'border-blue-300',
    badgeBg: 'bg-blue-100',
    badgeText: 'text-blue-700',
    principle: 'Vague prompts get vague answers. A specific topic + task cuts 10,000 possibilities to ~500.',
  },
  {
    title: 'Give Context',
    vaguePrompt: null,
    segment: ' for a 10th-grade biology student preparing for a quiz Friday',
    count: '~50',
    textColor: 'text-green-700',
    highlightClass: 'text-green-800 bg-green-100 rounded px-0.5',
    border: 'border-green-300',
    badgeBg: 'bg-green-100',
    badgeText: 'text-green-700',
    principle: 'Now the AI knows the grade level, depth, and urgency — no more guessing.',
  },
  {
    title: 'Set the Tone',
    vaguePrompt: null,
    segment: ' in a friendly, encouraging voice with memory tricks',
    count: '~10',
    textColor: 'text-purple-700',
    highlightClass: 'text-purple-800 bg-purple-100 rounded px-0.5',
    border: 'border-purple-300',
    badgeBg: 'bg-purple-100',
    badgeText: 'text-purple-700',
    principle: 'Tone shapes everything — casual vs. formal, fun vs. dry.',
  },
  {
    title: 'Define the Format',
    vaguePrompt: null,
    segment: ' as a numbered list: term, definition, and a mnemonic hint',
    count: '2–3',
    textColor: 'text-orange-700',
    highlightClass: 'text-orange-800 bg-orange-100 rounded px-0.5',
    border: 'border-orange-300',
    badgeBg: 'bg-orange-100',
    badgeText: 'text-orange-700',
    principle: 'The AI now knows exactly what the output should look like. Almost zero room for error.',
  },
];

const TOTAL_DOTS = 150;

const PromptFunnelVisualization: React.FC<PromptFunnelVisualizationProps> = ({ onComplete }) => {
  const [currentLayer, setCurrentLayer] = useState(0);
  const [introSeen, setIntroSeen] = useState(false);

  const dots: Dot[] = useMemo(() => {
    return Array.from({ length: TOTAL_DOTS }, (_, i) => {
      const r1 = seededRandom(i + 1);
      const r2 = seededRandom(i + 100);
      const r3 = seededRandom(i + 200);
      const r4 = seededRandom(i + 300);

      let survivesUntil = 0;
      if (r4 < 0.35) survivesUntil = 1;
      if (r4 < 0.12) survivesUntil = 2;
      if (r4 < 0.06) survivesUntil = 3;
      if (r4 < 0.03) survivesUntil = 4;

      return {
        id: i,
        x: 5 + r1 * 90,
        y: 5 + r2 * 90,
        size: 5 + r3 * 7,
        colorClass: DOT_COLORS[Math.floor(r1 * DOT_COLORS.length)],
        survivesUntil,
      };
    });
  }, []);

  const getPosition = (dot: Dot, layer: number) => {
    if (layer === 0) return { x: dot.x, y: dot.y };
    const cx = 50, cy = 50;
    const spread = [100, 55, 30, 18, 8][layer];
    return {
      x: cx + (dot.x - cx) * (spread / 100),
      y: cy + (dot.y - cy) * (spread / 100),
    };
  };

  const visibleDots = dots.filter(d => d.survivesUntil >= currentLayer);
  const layer = LAYERS[currentLayer];
  const isLast = currentLayer === LAYERS.length - 1;

  const handleAdvance = () => {
    if (!introSeen) setIntroSeen(true);
    setCurrentLayer(prev => prev + 1);
  };

  return (
    <Card>
      <CardContent className="p-4 md:p-6">
        {/* Header */}
        <div className="text-center mb-4">
          <h2 className="text-xl font-bold text-gray-900">The Funnel in Action</h2>
          <p className="text-gray-500 text-sm mt-0.5">
            Each dot = one possible AI response. Watch the prompt build — and the possibilities shrink.
          </p>
        </div>

        {/* Main layout: side-by-side on md+, stacked on mobile */}
        <div className="flex flex-col md:flex-row gap-4 items-stretch">

          {/* Dot cloud */}
          <div className="relative w-full md:w-[44%] shrink-0 h-52 md:h-auto md:aspect-square bg-gray-50 rounded-2xl border border-gray-200 overflow-hidden">

            {/* Intro overlay */}
            {!introSeen && (
              <div className="absolute inset-0 bg-gray-900/80 flex items-center justify-center z-20 rounded-2xl p-4">
                <div className="text-center text-white">
                  <div className="text-3xl mb-2">🔵</div>
                  <p className="font-bold text-sm mb-2">Each dot = 1 possible AI response</p>
                  <p className="text-xs text-gray-200 leading-relaxed mb-1">
                    <span className="text-yellow-300 font-semibold">"Help me with school"</span> could
                    generate <span className="font-bold text-white">10,000+ different answers</span>.
                  </p>
                  <p className="text-xs text-gray-300 leading-relaxed">
                    Watch the prompt build piece by piece — every detail eliminates bad matches.
                    Click <span className="text-purple-300 font-semibold">Start Narrowing</span> to begin.
                  </p>
                </div>
              </div>
            )}

            {/* Count badge */}
            <div className="absolute top-2 right-2 z-10">
              <motion.div
                key={currentLayer}
                initial={{ scale: 1.3, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-white/90 backdrop-blur-sm rounded-full px-2.5 py-0.5 border border-gray-200 shadow-sm"
              >
                <span className="text-xs font-bold text-gray-800">{layer.count} possibilities</span>
              </motion.div>
            </div>

            {/* Dots */}
            <AnimatePresence>
              {visibleDots.map((dot) => {
                const pos = getPosition(dot, currentLayer);
                return (
                  <motion.div
                    key={dot.id}
                    initial={false}
                    animate={{ left: `${pos.x}%`, top: `${pos.y}%`, opacity: 1, scale: 1 }}
                    exit={{
                      opacity: 0,
                      scale: 0,
                      transition: { duration: 0.5, delay: seededRandom(dot.id + 500) * 0.4 },
                    }}
                    transition={{
                      type: 'spring',
                      damping: 18,
                      stiffness: 70,
                      delay: seededRandom(dot.id + 600) * 0.25,
                    }}
                    className={`absolute rounded-full ${dot.colorClass} opacity-80`}
                    style={{
                      width: dot.size,
                      height: dot.size,
                      marginLeft: -dot.size / 2,
                      marginTop: -dot.size / 2,
                    }}
                  />
                );
              })}
            </AnimatePresence>

            {currentLayer >= 4 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 0.25, scale: 1 }}
                transition={{ duration: 0.8 }}
                className="absolute inset-0 flex items-center justify-center pointer-events-none"
              >
                <div className="w-20 h-20 rounded-full bg-orange-400 blur-2xl" />
              </motion.div>
            )}
          </div>

          {/* Info panel */}
          <div className="flex-1 flex flex-col gap-3 min-w-0">

            {/* Growing prompt display */}
            <div className="rounded-lg border border-gray-200 bg-white p-3 flex-1">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Your prompt so far:</p>

              {currentLayer === 0 ? (
                /* Vague starting prompt */
                <p className="font-mono text-sm text-gray-400 italic leading-relaxed">
                  {layer.vaguePrompt}
                </p>
              ) : (
                /* Growing color-coded prompt */
                <p className="font-mono text-sm leading-relaxed">
                  {LAYERS.slice(1, currentLayer + 1).map((l, i) => (
                    <motion.span
                      key={i}
                      initial={i === currentLayer - 1 ? { opacity: 0 } : false}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.5 }}
                      className={l.highlightClass}
                    >
                      {l.segment}
                    </motion.span>
                  ))}
                </p>
              )}

              {/* Color key */}
              {currentLayer >= 1 && (
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {LAYERS.slice(1, currentLayer + 1).map((l, i) => (
                    <span
                      key={i}
                      className={`text-xs font-medium px-2 py-0.5 rounded-full ${l.badgeBg} ${l.badgeText} border ${l.border}`}
                    >
                      {l.title}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Current principle */}
            <AnimatePresence mode="wait">
              {layer.principle && (
                <motion.div
                  key={currentLayer}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.3 }}
                  className={`rounded-lg p-3 border ${layer.border} text-sm text-gray-700 leading-snug`}
                  style={{ backgroundColor: 'white' }}
                >
                  <span className={`font-semibold ${layer.textColor}`}>{layer.title}: </span>
                  {layer.principle}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Progress bar */}
            <div className="flex items-center gap-1">
              {LAYERS.map((_, i) => (
                <div
                  key={i}
                  className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${
                    i <= currentLayer ? 'bg-purple-500' : 'bg-gray-200'
                  }`}
                />
              ))}
            </div>

            {/* Button */}
            {isLast ? (
              <Button
                onClick={onComplete}
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Continue
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            ) : (
              <Button
                onClick={handleAdvance}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white"
              >
                {currentLayer === 0 ? 'Start Narrowing' : 'Add Next Layer'}
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PromptFunnelVisualization;
