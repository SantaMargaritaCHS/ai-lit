import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import {
  ArrowRight, CheckCircle, Sparkles, Eye, Loader
} from 'lucide-react';
import { generateWithGemini, isGeminiConfigured } from '@/services/geminiClient';

// ─── Types ───────────────────────────────────────────────────────────

interface SayWhatYouSeeActivityProps {
  onComplete: () => void;
  isDevMode?: boolean;
}

interface SceneElement {
  id: string;
  label: string;
  keywords: string[];
  description: string;
}

interface RoundResult {
  score: number;
  matched: string[];
  missed: string[];
  tip: string;
}

type Step = 'intro' | 'round1' | 'feedback1' | 'round2' | 'feedback2' | 'summary';

// ─── Scene Element Metadata ──────────────────────────────────────────

const SUNSET_ELEMENTS: SceneElement[] = [
  { id: 'sky', label: 'Sky Gradient', keywords: ['sky', 'gradient', 'orange', 'pink', 'purple', 'color', 'colours', 'colors'], description: 'A gradient sky transitioning from warm orange at the horizon through pink to deep purple at the top' },
  { id: 'sun', label: 'Glowing Sun', keywords: ['sun', 'circle', 'yellow', 'glow', 'bright', 'setting', 'sunset'], description: 'A glowing yellow-orange sun sitting near the horizon' },
  { id: 'back-mountains', label: 'Back Mountains', keywords: ['mountain', 'mountains', 'peak', 'range', 'hill', 'hills', 'back', 'behind', 'distant', 'far'], description: 'A darker mountain range in the background with multiple peaks' },
  { id: 'front-mountains', label: 'Front Mountains', keywords: ['mountain', 'mountains', 'front', 'foreground', 'closer', 'near', 'dark', 'silhouette'], description: 'A closer, darker mountain silhouette in the foreground' },
  { id: 'lake', label: 'Reflective Lake', keywords: ['lake', 'water', 'reflection', 'pond', 'river', 'reflective', 'mirror'], description: 'A calm lake reflecting the sky colors at the bottom of the scene' },
  { id: 'cloud-left', label: 'Left Cloud', keywords: ['cloud', 'clouds', 'wispy', 'left', 'floating'], description: 'A small wispy cloud on the left side of the sky' },
  { id: 'cloud-right', label: 'Right Cloud', keywords: ['cloud', 'clouds', 'wispy', 'right', 'floating'], description: 'A small wispy cloud on the right side of the sky' },
];

const CITYSCAPE_ELEMENTS: SceneElement[] = [
  { id: 'night-sky', label: 'Night Sky', keywords: ['sky', 'night', 'dark', 'blue', 'navy', 'gradient'], description: 'A dark gradient sky transitioning from deep navy to lighter blue near the horizon' },
  { id: 'moon', label: 'Crescent Moon', keywords: ['moon', 'crescent', 'lunar', 'white', 'curved'], description: 'A white crescent moon in the upper portion of the sky' },
  { id: 'stars', label: 'Stars', keywords: ['star', 'stars', 'twinkle', 'dot', 'dots', 'sparkle', 'light', 'lights', 'tiny'], description: 'Several small twinkling stars scattered across the sky' },
  { id: 'tall-building', label: 'Tall Building', keywords: ['tall', 'building', 'tower', 'skyscraper', 'window', 'windows', 'high-rise'], description: 'A tall rectangular building with lit windows' },
  { id: 'medium-building', label: 'Medium Building', keywords: ['medium', 'building', 'shorter', 'window', 'windows', 'mid'], description: 'A medium-height building with glowing windows' },
  { id: 'short-building', label: 'Short Building', keywords: ['short', 'small', 'building', 'low', 'window', 'windows'], description: 'A shorter building on the right side of the scene' },
  { id: 'antenna', label: 'Antenna/Spire', keywords: ['antenna', 'spire', 'tower', 'pole', 'top', 'tip', 'thin'], description: 'A thin antenna or spire extending from the top of the tallest building' },
  { id: 'ground', label: 'Ground/Street', keywords: ['ground', 'street', 'road', 'pavement', 'floor', 'bottom', 'gray', 'grey'], description: 'A dark ground/street area at the base of the buildings' },
  { id: 'street-lamp', label: 'Street Lamp', keywords: ['lamp', 'lamppost', 'street light', 'streetlight', 'light', 'lantern', 'post', 'glow'], description: 'A street lamp on the right side emitting a warm glow' },
  { id: 'road-markings', label: 'Road Markings', keywords: ['marking', 'markings', 'line', 'lines', 'stripe', 'stripes', 'dashed', 'road', 'lane'], description: 'Dashed white road markings on the street' },
];

// ─── CSS-Art Scene Components ────────────────────────────────────────

const SunsetScene: React.FC = () => (
  <div
    className="relative w-full rounded-xl overflow-hidden border-2 border-gray-200 shadow-inner"
    style={{ aspectRatio: '4/3' }}
    role="img"
    aria-label="A sunset landscape scene with mountains, a lake, and clouds. Describe what you see in detail."
  >
    {/* Sky gradient */}
    <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, #6b21a8, #db2777, #f97316, #fbbf24)' }} />

    {/* Left cloud */}
    <div className="absolute" style={{ top: '12%', left: '15%', width: '14%', height: '5%', background: 'rgba(255,255,255,0.5)', borderRadius: '50%', filter: 'blur(4px)' }} />
    <div className="absolute" style={{ top: '11%', left: '18%', width: '10%', height: '5%', background: 'rgba(255,255,255,0.4)', borderRadius: '50%', filter: 'blur(3px)' }} />

    {/* Right cloud */}
    <div className="absolute" style={{ top: '18%', right: '12%', width: '16%', height: '5%', background: 'rgba(255,255,255,0.45)', borderRadius: '50%', filter: 'blur(4px)' }} />
    <div className="absolute" style={{ top: '17%', right: '16%', width: '10%', height: '5%', background: 'rgba(255,255,255,0.35)', borderRadius: '50%', filter: 'blur(3px)' }} />

    {/* Sun */}
    <div className="absolute" style={{ top: '35%', left: '50%', transform: 'translateX(-50%)', width: '12%', height: '16%', borderRadius: '50%', background: 'radial-gradient(circle, #fde047, #f97316)', boxShadow: '0 0 40px 15px rgba(251,191,36,0.4)' }} />

    {/* Back mountains */}
    <div className="absolute" style={{ bottom: '28%', left: 0, right: 0, height: '30%' }}>
      <svg viewBox="0 0 400 120" preserveAspectRatio="none" className="w-full h-full">
        <polygon points="0,120 0,80 50,40 100,70 150,25 200,55 250,20 300,50 350,35 400,60 400,120" fill="#581c87" fillOpacity="0.7" />
      </svg>
    </div>

    {/* Front mountains */}
    <div className="absolute" style={{ bottom: '20%', left: 0, right: 0, height: '28%' }}>
      <svg viewBox="0 0 400 110" preserveAspectRatio="none" className="w-full h-full">
        <polygon points="0,110 0,70 60,30 120,65 180,15 240,50 300,25 360,55 400,40 400,110" fill="#1e1b4b" fillOpacity="0.85" />
      </svg>
    </div>

    {/* Lake */}
    <div className="absolute" style={{ bottom: 0, left: 0, right: 0, height: '22%', background: 'linear-gradient(to bottom, rgba(249,115,22,0.4), rgba(107,33,168,0.5), rgba(30,27,75,0.7))', borderTop: '1px solid rgba(255,255,255,0.2)' }} />
    {/* Lake reflection shimmer */}
    <div className="absolute" style={{ bottom: '8%', left: '44%', width: '12%', height: '2%', background: 'rgba(251,191,36,0.3)', borderRadius: '50%', filter: 'blur(3px)' }} />
  </div>
);

const CityscapeScene: React.FC = () => (
  <div
    className="relative w-full rounded-xl overflow-hidden border-2 border-gray-200 shadow-inner"
    style={{ aspectRatio: '4/3' }}
    role="img"
    aria-label="A night cityscape scene with buildings, a moon, stars, and a street lamp. Describe what you see in detail."
  >
    {/* Night sky gradient */}
    <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, #0f172a, #1e3a5f, #334155)' }} />

    {/* Moon */}
    <div className="absolute" style={{ top: '8%', right: '20%', width: '6%', height: '8%' }}>
      <div style={{ width: '100%', height: '100%', borderRadius: '50%', background: '#f1f5f9', boxShadow: '0 0 15px 5px rgba(241,245,249,0.3)' }} />
      <div className="absolute" style={{ top: '10%', right: '-15%', width: '80%', height: '80%', borderRadius: '50%', background: '#1e3a5f' }} />
    </div>

    {/* Stars */}
    {[
      { top: '5%', left: '10%' }, { top: '12%', left: '35%' }, { top: '8%', left: '60%' },
      { top: '15%', left: '80%' }, { top: '22%', left: '25%' }, { top: '18%', left: '50%' },
      { top: '6%', left: '90%' }, { top: '25%', left: '70%' },
    ].map((pos, i) => (
      <div
        key={i}
        className="absolute rounded-full"
        style={{ ...pos, width: i % 3 === 0 ? 3 : 2, height: i % 3 === 0 ? 3 : 2, background: '#e2e8f0', boxShadow: '0 0 3px 1px rgba(226,232,240,0.5)' }}
      />
    ))}

    {/* Tall building */}
    <div className="absolute" style={{ bottom: '18%', left: '20%', width: '14%', height: '55%', background: '#1e293b', borderRadius: '2px 2px 0 0' }}>
      {/* Windows */}
      {[0, 1, 2, 3, 4, 5, 6].map(row => (
        <React.Fragment key={row}>
          <div className="absolute" style={{ left: '20%', top: `${12 + row * 12}%`, width: '22%', height: '6%', background: '#fbbf24', borderRadius: 1, opacity: row % 2 === 0 ? 0.9 : 0.5 }} />
          <div className="absolute" style={{ right: '20%', top: `${12 + row * 12}%`, width: '22%', height: '6%', background: '#fbbf24', borderRadius: 1, opacity: row % 2 === 1 ? 0.9 : 0.5 }} />
        </React.Fragment>
      ))}
    </div>

    {/* Antenna on tall building */}
    <div className="absolute" style={{ bottom: '73%', left: '26%', width: '2%', height: '8%', background: '#475569' }}>
      <div className="absolute" style={{ top: 0, left: '50%', transform: 'translateX(-50%)', width: 4, height: 4, borderRadius: '50%', background: '#ef4444', boxShadow: '0 0 4px 2px rgba(239,68,68,0.5)' }} />
    </div>

    {/* Medium building */}
    <div className="absolute" style={{ bottom: '18%', left: '38%', width: '16%', height: '42%', background: '#334155', borderRadius: '2px 2px 0 0' }}>
      {[0, 1, 2, 3, 4].map(row => (
        <React.Fragment key={row}>
          <div className="absolute" style={{ left: '15%', top: `${14 + row * 16}%`, width: '18%', height: '8%', background: '#93c5fd', borderRadius: 1, opacity: 0.7 }} />
          <div className="absolute" style={{ left: '42%', top: `${14 + row * 16}%`, width: '18%', height: '8%', background: '#93c5fd', borderRadius: 1, opacity: row === 2 ? 0.9 : 0.5 }} />
          <div className="absolute" style={{ right: '15%', top: `${14 + row * 16}%`, width: '18%', height: '8%', background: '#93c5fd', borderRadius: 1, opacity: 0.6 }} />
        </React.Fragment>
      ))}
    </div>

    {/* Short building */}
    <div className="absolute" style={{ bottom: '18%', right: '18%', width: '18%', height: '30%', background: '#1e293b', borderRadius: '2px 2px 0 0' }}>
      {[0, 1, 2].map(row => (
        <React.Fragment key={row}>
          <div className="absolute" style={{ left: '12%', top: `${18 + row * 24}%`, width: '20%', height: '10%', background: '#fde68a', borderRadius: 1, opacity: 0.8 }} />
          <div className="absolute" style={{ left: '40%', top: `${18 + row * 24}%`, width: '20%', height: '10%', background: '#fde68a', borderRadius: 1, opacity: 0.5 }} />
          <div className="absolute" style={{ right: '12%', top: `${18 + row * 24}%`, width: '20%', height: '10%', background: '#fde68a', borderRadius: 1, opacity: 0.7 }} />
        </React.Fragment>
      ))}
    </div>

    {/* Ground/street */}
    <div className="absolute" style={{ bottom: 0, left: 0, right: 0, height: '18%', background: '#374151' }} />

    {/* Road markings */}
    {[0, 1, 2, 3, 4].map(i => (
      <div
        key={i}
        className="absolute"
        style={{ bottom: '8%', left: `${10 + i * 20}%`, width: '10%', height: '2%', background: '#d1d5db', borderRadius: 2, opacity: 0.7 }}
      />
    ))}

    {/* Street lamp */}
    <div className="absolute" style={{ bottom: '18%', right: '10%', width: '1.5%', height: '22%', background: '#6b7280' }}>
      {/* Lamp head */}
      <div className="absolute" style={{ top: 0, left: '50%', transform: 'translateX(-50%)', width: 12, height: 6, background: '#fbbf24', borderRadius: '3px 3px 0 0' }} />
      {/* Lamp glow */}
      <div className="absolute" style={{ top: '-5%', left: '50%', transform: 'translateX(-50%)', width: 40, height: 40, borderRadius: '50%', background: 'radial-gradient(circle, rgba(251,191,36,0.3), transparent)', pointerEvents: 'none' }} />
    </div>
  </div>
);

// ─── Keyword Fallback Evaluator ──────────────────────────────────────

function evaluateWithKeywords(text: string, elements: SceneElement[]): RoundResult {
  const lower = text.toLowerCase();
  const matched: string[] = [];
  const missed: string[] = [];

  for (const el of elements) {
    const found = el.keywords.some(kw => lower.includes(kw));
    if (found) {
      matched.push(el.id);
    } else {
      missed.push(el.id);
    }
  }

  const ratio = matched.length / elements.length;
  let score: number;
  if (ratio >= 0.85) score = 5;
  else if (ratio >= 0.65) score = 4;
  else if (ratio >= 0.45) score = 3;
  else if (ratio >= 0.25) score = 2;
  else score = 1;

  let tip: string;
  if (score >= 4) {
    tip = 'Nice detail! You mentioned most elements. Try adding positions (left, right, top) and relationships between objects for an even stronger description.';
  } else if (score >= 3) {
    tip = 'Good start! You caught several elements. Look more carefully at the edges of the scene and try describing colors and positions more specifically.';
  } else {
    tip = 'Try being more specific! Describe each object you see, its color, size, and where it sits in the scene.';
  }

  return { score, matched, missed, tip };
}

// ─── Gemini Evaluator ────────────────────────────────────────────────

async function evaluateWithGemini(
  text: string,
  elements: SceneElement[],
  roundLabel: string
): Promise<RoundResult | null> {
  const elementList = elements
    .map(el => `- "${el.id}" (${el.label}): ${el.description}`)
    .join('\n');

  const prompt = `You are evaluating a student's description of a ${roundLabel} scene for an AI literacy class.

The scene contains these elements:
${elementList}

The student wrote:
"${text}"

Evaluate which elements the student mentioned (directly or indirectly). Return ONLY valid JSON with no markdown formatting:
{"matched":["element_id",...],"missed":["element_id",...],"score":3,"tip":"One sentence of encouraging feedback about specificity."}

Rules for scoring (1-5):
- 5: Mentioned almost all elements with spatial detail
- 4: Mentioned most elements clearly
- 3: Mentioned about half the elements
- 2: Mentioned only a few elements
- 1: Very vague, almost nothing specific

Rules for matching:
- Match if the student clearly references the element, even with different words
- "the sky changes color" matches "sky" element
- "tall structure" matches "tall-building"
- Be generous with synonyms but don't match pure guesses

The "tip" should be encouraging and specific. For a high schooler.`;

  try {
    const raw = await generateWithGemini(prompt, {
      temperature: 0.3,
      maxOutputTokens: 800,
    });
    if (!raw) return null;

    // Strip markdown code fences if present
    const cleaned = raw.replace(/```json\s*/g, '').replace(/```\s*/g, '').trim();
    const parsed = JSON.parse(cleaned);

    // Validate shape
    if (
      Array.isArray(parsed.matched) &&
      Array.isArray(parsed.missed) &&
      typeof parsed.score === 'number' &&
      typeof parsed.tip === 'string'
    ) {
      return {
        matched: parsed.matched,
        missed: parsed.missed,
        score: Math.max(1, Math.min(5, Math.round(parsed.score))),
        tip: parsed.tip,
      };
    }
    return null;
  } catch {
    return null;
  }
}

// ─── Score Bar Component ─────────────────────────────────────────────

const ScoreBar: React.FC<{ score: number; label?: string }> = ({ score, label }) => {
  const colors = ['#ef4444', '#f97316', '#eab308', '#84cc16', '#22c55e'];
  return (
    <div className="space-y-1">
      {label && <p className="text-sm font-medium text-gray-700">{label}</p>}
      <div className="flex gap-1.5 items-center">
        {[1, 2, 3, 4, 5].map(n => (
          <div
            key={n}
            className="h-5 flex-1 rounded-sm transition-all duration-500"
            style={{
              background: n <= score ? colors[score - 1] : '#e5e7eb',
              opacity: n <= score ? 1 : 0.4,
            }}
          />
        ))}
        <span className="ml-2 text-lg font-bold text-gray-800">{score}/5</span>
      </div>
    </div>
  );
};

// ─── Element Badges Component ────────────────────────────────────────

const ElementBadges: React.FC<{ elements: SceneElement[]; matched: string[]; missed: string[] }> = ({
  elements, matched, missed
}) => (
  <div className="flex flex-wrap gap-2">
    {elements.map(el => {
      const isMatched = matched.includes(el.id);
      return (
        <span
          key={el.id}
          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium transition-all ${
            isMatched
              ? 'bg-green-100 text-green-800 border border-green-300'
              : 'bg-gray-100 text-gray-500 border border-gray-200'
          }`}
        >
          {isMatched && <CheckCircle className="w-3 h-3" />}
          {el.label}
        </span>
      );
    })}
  </div>
);

// ─── Main Component ──────────────────────────────────────────────────

const SayWhatYouSeeActivity: React.FC<SayWhatYouSeeActivityProps> = ({
  onComplete,
  isDevMode = false,
}) => {
  const [step, setStep] = useState<Step>('intro');
  const [round1Text, setRound1Text] = useState('');
  const [round2Text, setRound2Text] = useState('');
  const [round1Result, setRound1Result] = useState<RoundResult | null>(null);
  const [round2Result, setRound2Result] = useState<RoundResult | null>(null);
  const [isEvaluating, setIsEvaluating] = useState(false);

  // Dev mode: jump straight to summary
  useEffect(() => {
    if (isDevMode) {
      setRound1Result({ score: 3, matched: ['sky', 'sun', 'back-mountains'], missed: ['front-mountains', 'lake', 'cloud-left', 'cloud-right'], tip: 'Dev mode auto-complete.' });
      setRound2Result({ score: 4, matched: ['night-sky', 'moon', 'stars', 'tall-building', 'medium-building', 'short-building', 'ground', 'street-lamp'], missed: ['antenna', 'road-markings'], tip: 'Dev mode auto-complete.' });
      setStep('summary');
    }
  }, [isDevMode]);

  const handleEvaluate = async (round: 1 | 2) => {
    const text = round === 1 ? round1Text : round2Text;
    const elements = round === 1 ? SUNSET_ELEMENTS : CITYSCAPE_ELEMENTS;
    const label = round === 1 ? 'sunset landscape' : 'night cityscape';

    setIsEvaluating(true);

    let result: RoundResult | null = null;

    if (isGeminiConfigured()) {
      result = await evaluateWithGemini(text, elements, label);
    }

    // Fallback to keyword matching
    if (!result) {
      result = evaluateWithKeywords(text, elements);
    }

    if (round === 1) {
      setRound1Result(result);
      setStep('feedback1');
    } else {
      setRound2Result(result);
      setStep('feedback2');
    }

    setIsEvaluating(false);
  };

  const MIN_CHARS = 30;

  // ─── Render Steps ────────────────────────────────────────────────

  const renderIntro = () => (
    <motion.div
      key="intro"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6 text-center"
    >
      <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
        <Eye className="h-10 w-10 text-purple-600 mx-auto mb-3" />
        <h3 className="text-lg font-semibold text-purple-900 mb-2">How This Works</h3>
        <p className="text-purple-800">
          You'll see two scenes. For each one, describe everything you notice in as much
          detail as possible. Then AI will evaluate how specific your description was.
        </p>
        <p className="text-sm text-purple-700 mt-2">
          This is the same skill you use when writing good AI prompts — being specific gets better results!
        </p>
      </div>
      <Button
        onClick={() => setStep('round1')}
        size="lg"
        className="bg-purple-600 hover:bg-purple-700 text-white"
      >
        Start Round 1
        <ArrowRight className="ml-2 h-5 w-5" />
      </Button>
    </motion.div>
  );

  const renderRound = (round: 1 | 2) => {
    const text = round === 1 ? round1Text : round2Text;
    const setText = round === 1 ? setRound1Text : setRound2Text;
    const Scene = round === 1 ? SunsetScene : CityscapeScene;
    const sceneLabel = round === 1 ? 'Sunset Landscape' : 'Night Cityscape';

    return (
      <motion.div
        key={`round${round}`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="space-y-5"
      >
        <div className="text-center">
          <span className="inline-block bg-purple-100 text-purple-800 text-xs font-semibold px-3 py-1 rounded-full mb-2">
            Round {round} of 2
          </span>
          <h3 className="text-xl font-bold text-gray-900">{sceneLabel}</h3>
          <p className="text-sm text-gray-600 mt-1">Describe everything you see — colors, shapes, positions, details.</p>
        </div>

        <Scene />

        <div className="space-y-2">
          <Textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="I see a scene with..."
            className="min-h-[120px] text-gray-900"
            aria-label={`Describe the ${sceneLabel.toLowerCase()} scene`}
          />
          <div className="flex justify-between items-center text-sm">
            <span className={text.length < MIN_CHARS ? 'text-gray-500' : 'text-green-600'}>
              {text.length} / {MIN_CHARS} min characters
            </span>
            {text.length >= MIN_CHARS && <CheckCircle className="h-4 w-4 text-green-600" />}
          </div>
        </div>

        <Button
          onClick={() => handleEvaluate(round)}
          disabled={text.trim().length < MIN_CHARS || isEvaluating}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white"
          size="lg"
        >
          {isEvaluating ? (
            <>
              <Loader className="mr-2 h-5 w-5 animate-spin" />
              Evaluating...
            </>
          ) : (
            <>
              <Eye className="mr-2 h-5 w-5" />
              Check My Description
            </>
          )}
        </Button>
      </motion.div>
    );
  };

  const renderFeedback = (round: 1 | 2) => {
    const result = round === 1 ? round1Result : round2Result;
    const elements = round === 1 ? SUNSET_ELEMENTS : CITYSCAPE_ELEMENTS;
    const Scene = round === 1 ? SunsetScene : CityscapeScene;
    const sceneLabel = round === 1 ? 'Sunset Landscape' : 'Night Cityscape';

    if (!result) return null;

    const scoreDiff = round === 2 && round1Result ? result.score - round1Result.score : null;

    return (
      <motion.div
        key={`feedback${round}`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="space-y-5"
      >
        <div className="text-center">
          <h3 className="text-xl font-bold text-gray-900">
            {sceneLabel} — Results
          </h3>
        </div>

        <Scene />

        <div className="bg-white border border-gray-200 rounded-lg p-5 space-y-4">
          <ScoreBar score={result.score} label="Specificity Score" />

          {scoreDiff !== null && (
            <p className={`text-sm font-medium ${scoreDiff > 0 ? 'text-green-700' : scoreDiff === 0 ? 'text-gray-600' : 'text-orange-600'}`}>
              {scoreDiff > 0 && `+${scoreDiff} improvement from Round 1!`}
              {scoreDiff === 0 && 'Same score as Round 1 — consistency is good!'}
              {scoreDiff < 0 && `${scoreDiff} from Round 1 — this scene had more elements to spot.`}
            </p>
          )}

          <div>
            <p className="text-sm font-medium text-gray-700 mb-2">Elements Detected:</p>
            <ElementBadges elements={elements} matched={result.matched} missed={result.missed} />
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-sm text-blue-900">
              <span className="font-semibold">Tip:</span> {result.tip}
            </p>
          </div>
        </div>

        <Button
          onClick={() => setStep(round === 1 ? 'round2' : 'summary')}
          size="lg"
          className="w-full bg-purple-600 hover:bg-purple-700 text-white"
        >
          {round === 1 ? (
            <>
              Try Scene 2
              <ArrowRight className="ml-2 h-5 w-5" />
            </>
          ) : (
            <>
              See Summary
              <ArrowRight className="ml-2 h-5 w-5" />
            </>
          )}
        </Button>
      </motion.div>
    );
  };

  const renderSummary = () => (
    <motion.div
      key="summary"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      <div className="text-center">
        <Sparkles className="h-10 w-10 text-purple-600 mx-auto mb-2" />
        <h3 className="text-2xl font-bold text-gray-900">Activity Complete!</h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {round1Result && (
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 space-y-2">
            <p className="text-sm font-semibold text-orange-900">Round 1: Sunset</p>
            <ScoreBar score={round1Result.score} />
            <p className="text-xs text-orange-800">
              {round1Result.matched.length}/{SUNSET_ELEMENTS.length} elements found
            </p>
          </div>
        )}
        {round2Result && (
          <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4 space-y-2">
            <p className="text-sm font-semibold text-indigo-900">Round 2: Cityscape</p>
            <ScoreBar score={round2Result.score} />
            <p className="text-xs text-indigo-800">
              {round2Result.matched.length}/{CITYSCAPE_ELEMENTS.length} elements found
            </p>
          </div>
        )}
      </div>

      <div className="bg-purple-50 border border-purple-200 rounded-lg p-5">
        <h4 className="font-semibold text-purple-900 mb-2">Key Takeaway</h4>
        <p className="text-sm text-purple-800">
          The more specific and detailed your description, the more elements the AI could
          identify. This is exactly how prompting works — <strong>specific prompts produce
          better AI outputs</strong>. Vague instructions lead to vague results. As you learn
          to write prompts, remember: details matter.
        </p>
      </div>

      <Button
        onClick={onComplete}
        size="lg"
        className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
      >
        Continue to Next Activity
        <ArrowRight className="ml-2 h-5 w-5" />
      </Button>
    </motion.div>
  );

  // ─── Main Render ─────────────────────────────────────────────────

  return (
    <Card className="overflow-hidden">
      <div className="p-6 md:p-8 space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-bold text-gray-900 flex items-center justify-center gap-2">
            <Sparkles className="h-8 w-8 text-purple-500" />
            Say What You See
          </h2>
          <p className="text-lg text-gray-600">
            How precisely can you describe a scene? Test your observation skills!
          </p>
        </div>

        {/* Step progress */}
        {!isDevMode && (
          <div className="flex items-center justify-center gap-2">
            {(['intro', 'round1', 'feedback1', 'round2', 'feedback2', 'summary'] as Step[]).map((s, i) => {
              const stepLabels: Record<Step, string> = {
                intro: 'Start',
                round1: 'Scene 1',
                feedback1: 'Results 1',
                round2: 'Scene 2',
                feedback2: 'Results 2',
                summary: 'Done',
              };
              const stepOrder: Step[] = ['intro', 'round1', 'feedback1', 'round2', 'feedback2', 'summary'];
              const currentIdx = stepOrder.indexOf(step);
              const thisIdx = i;
              const isPast = thisIdx < currentIdx;
              const isCurrent = s === step;

              return (
                <React.Fragment key={s}>
                  {i > 0 && <div className={`w-4 h-0.5 ${isPast ? 'bg-purple-400' : 'bg-gray-300'}`} />}
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                      isCurrent ? 'bg-purple-600 text-white' :
                      isPast ? 'bg-purple-400 text-white' :
                      'bg-gray-200 text-gray-500'
                    }`}
                    title={stepLabels[s]}
                    aria-label={`${stepLabels[s]}${isCurrent ? ' (current)' : ''}`}
                  >
                    {isPast ? <CheckCircle className="w-3.5 h-3.5" /> : i + 1}
                  </div>
                </React.Fragment>
              );
            })}
          </div>
        )}

        <AnimatePresence mode="wait">
          {step === 'intro' && renderIntro()}
          {step === 'round1' && renderRound(1)}
          {step === 'feedback1' && renderFeedback(1)}
          {step === 'round2' && renderRound(2)}
          {step === 'feedback2' && renderFeedback(2)}
          {step === 'summary' && renderSummary()}
        </AnimatePresence>

        {isDevMode && (
          <div className="mt-4 p-3 bg-yellow-100 border border-yellow-500 rounded-lg">
            <p className="text-sm text-yellow-800 font-medium flex items-center gap-2">
              <Sparkles className="h-4 w-4" />
              Dev Mode: Auto-completed to summary
            </p>
          </div>
        )}
      </div>
    </Card>
  );
};

export default SayWhatYouSeeActivity;
