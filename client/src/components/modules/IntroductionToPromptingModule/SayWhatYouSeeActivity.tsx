import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import {
  ArrowRight, CheckCircle, Sparkles, Eye, Loader, AlertTriangle, RotateCcw, Lightbulb, MessageSquare
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
  hints: [string, string]; // [vague spatial hint, more specific hint]
}

interface ElementQuote {
  elementId: string;
  studentPhrase: string;
}

interface MissedHint {
  elementId: string;
  hint: string;
}

interface FeedbackSections {
  whatYouDidWell: string;
  techniqueCoaching: string;
  whereToLook: string;
}

interface RoundResult {
  score: number;
  matched: string[];
  missed: string[];
  tip: string;
  elementQuotes?: ElementQuote[];
  missedHints?: MissedHint[];
  feedbackSections?: FeedbackSections;
  usedGemini: boolean;
}

type Step = 'intro' | 'round1' | 'feedback1' | 'round2' | 'feedback2' | 'summary';

// ─── Constants ───────────────────────────────────────────────────────

const MATCH_THRESHOLD = 0.65; // 65% of elements must be matched
const MAX_ATTEMPTS = 3; // Escape hatch after 3 attempts below threshold
const MIN_CHARS = 30;

// ─── AI Prompts Used to Generate the Images ──────────────────────────
// Students see these ONLY after passing or using the escape hatch.

interface PromptSegment {
  text: string;
  elementId?: string;
}

const SUNSET_PROMPT_SEGMENTS: PromptSegment[] = [
  { text: 'Create an image of a vibrant sunset over mountains with ' },
  { text: 'a calm reflective lake in the foreground', elementId: 'lake' },
  { text: '. ' },
  { text: 'The sky has a gradient from deep purple at top through pink to orange near the horizon', elementId: 'sky' },
  { text: '. ' },
  { text: 'A glowing sun near the horizon', elementId: 'sun' },
  { text: '. ' },
  { text: 'Two mountain ranges - distant peaks', elementId: 'back-mountains' },
  { text: ' and ' },
  { text: 'closer silhouettes', elementId: 'front-mountains' },
  { text: '. ' },
  { text: 'Two wispy clouds', elementId: 'clouds' },
  { text: '. ' },
  { text: 'The lake reflects sky colors', elementId: 'reflection' },
  { text: '. Photorealistic, no text.' },
];

const CITYSCAPE_PROMPT_SEGMENTS: PromptSegment[] = [
  { text: 'Create an image of a nighttime cityscape. ' },
  { text: 'Several buildings of different heights', elementId: 'tall-buildings' },
  { text: ' against ' },
  { text: 'a dark blue night sky', elementId: 'night-sky' },
  { text: '. ' },
  { text: 'Crescent moon', elementId: 'moon' },
  { text: ' and ' },
  { text: 'twinkling stars', elementId: 'stars' },
  { text: '. Tallest building has ' },
  { text: 'an antenna with red light', elementId: 'spire' },
  { text: '. Buildings have ' },
  { text: 'glowing windows', elementId: 'windows' },
  { text: '. ' },
  { text: 'Grey street', elementId: 'street' },
  { text: ' with ' },
  { text: 'dashed white road markings', elementId: 'road-markings' },
  { text: '. ' },
  { text: 'A street lamp emitting warm glow', elementId: 'street-lamp' },
  { text: '. Photorealistic, no text.' },
];

// ─── Scene Element Metadata ──────────────────────────────────────────

const SUNSET_ELEMENTS: SceneElement[] = [
  {
    id: 'sky', label: 'Sky Gradient',
    keywords: ['sky', 'gradient', 'sky color', 'sky changes', 'horizon'],
    description: 'A gradient sky transitioning from warm orange at the horizon through pink to deep purple at the top',
    hints: [
      'Look at the upper portion of the image — how does the color change from top to bottom?',
      'The background shifts through multiple colors from the top of the image down to the horizon. Describe that transition.'
    ],
  },
  {
    id: 'sun', label: 'Glowing Sun',
    keywords: ['sun ', 'the sun', 'a sun', 'sunset', 'glowing', 'bright circle', 'bright light', 'setting sun'],
    description: 'A glowing yellow-orange sun sitting near the horizon',
    hints: [
      'Look at where the mountains meet the sky — what is the brightest object there?',
      'Right at the center horizon, there is a bright, glowing circular shape. What is it?'
    ],
  },
  {
    id: 'back-mountains', label: 'Distant Mountains',
    keywords: ['mountain', 'mountains', 'peaks', 'hills', 'ridges', 'mountain range'],
    description: 'A lighter mountain range in the background with multiple peaks',
    hints: [
      'Look at the middle band of the image — what shapes do you see along the horizon?',
      'Behind the darker shapes, there is a lighter, more distant range of pointed shapes along the horizon.'
    ],
  },
  {
    id: 'front-mountains', label: 'Foreground Mountains',
    keywords: ['silhouette', 'dark mountain', 'foreground', 'closer mountain', 'two mountain', 'two ranges', 'layers of mountain'],
    description: 'Closer, darker mountain silhouettes in the foreground',
    hints: [
      'Are there different layers of terrain? Look at the darker shapes closer to the viewer.',
      'There are dark, almost black shapes on the left and right sides — they are closer to you than the lighter ones behind them.'
    ],
  },
  {
    id: 'lake', label: 'Reflective Lake',
    keywords: ['lake', 'water', 'pond', 'river', 'body of water'],
    description: 'A calm lake reflecting the sky colors and mountains',
    hints: [
      'What fills the entire bottom half of the image? Describe what surface you see.',
      'The lower half is a large, calm, flat surface that has the same colors as the sky. What could it be?'
    ],
  },
  {
    id: 'clouds', label: 'Wispy Clouds',
    keywords: ['cloud', 'clouds', 'wispy', 'streaks in the sky', 'streaks across'],
    description: 'Thin wispy cloud streaks across the sky',
    hints: [
      'Look at the upper part of the sky — are there any thin, diagonal shapes?',
      'In the upper sky area, there are thin white streaks cutting diagonally across the purple background.'
    ],
  },
  {
    id: 'reflection', label: 'Mirror Reflection',
    keywords: ['reflection', 'reflecting', 'mirror', 'reflected', 'symmetr', 'reflects', 'mirrored'],
    description: 'The lake creates a near-perfect mirror reflection of the mountains and sky',
    hints: [
      'Compare the top half and the bottom half of the image — do you notice a pattern?',
      'The bottom half looks almost identical to the top half, flipped upside down. Describe that relationship.'
    ],
  },
];

const CITYSCAPE_ELEMENTS: SceneElement[] = [
  {
    id: '3d-style', label: '3D / Animated Style',
    keywords: ['3d', '3-d', 'cartoon', 'animated', 'render', 'video game', 'cgi', 'computer generated', 'digital art', 'illustration', 'not real', 'fake', 'graphic'],
    description: 'The image is clearly a 3D render or video-game style illustration, not a photograph',
    hints: [
      'Does this look like a real photo? How would you describe the style?',
      'This image looks computer-made. What style or medium does it remind you of?'
    ],
  },
  {
    id: 'night-sky', label: 'Night Sky',
    keywords: ['sky', 'night sky', 'dark sky', 'nighttime', 'night'],
    description: 'A dark blue gradient night sky',
    hints: [
      'What fills the background behind the buildings?',
      'The upper portion is a deep dark color. What is it?'
    ],
  },
  {
    id: 'moon', label: 'Crescent Moon',
    keywords: ['moon', 'crescent', 'lunar'],
    description: 'A white crescent moon in the upper portion of the sky',
    hints: [
      'Look at the upper-right of the sky — see a recognizable shape?',
      'Upper right — a curved white shape you see at nighttime.'
    ],
  },
  {
    id: 'stars', label: 'Stars',
    keywords: ['star', 'stars', 'twinkle', 'sparkle', 'specks of light'],
    description: 'Several small twinkling stars scattered across the sky',
    hints: [
      'Look carefully at the dark sky — any tiny bright spots?',
      'Small bright specks are scattered across the dark background.'
    ],
  },
  {
    id: 'buildings', label: 'City Buildings',
    keywords: ['building', 'buildings', 'skyscraper', 'high-rise', 'skyline', 'tower', 'city', 'cityscape', 'window', 'windows', 'lit windows'],
    description: 'Multiple tall buildings and skyscrapers with glowing lit windows',
    hints: [
      'What are the large structures in the center?',
      'The center has several tall rectangular structures with glowing details on them.'
    ],
  },
  {
    id: 'street', label: 'Street/Road',
    keywords: ['street', 'road', 'pavement', 'sidewalk', 'ground', 'crosswalk', 'markings', 'stripes'],
    description: 'A street with road markings at the base of the buildings',
    hints: [
      'What is at the very bottom of the image?',
      'A flat grey surface with painted patterns sits below the buildings.'
    ],
  },
  {
    id: 'street-lamp', label: 'Street Lamp',
    keywords: ['lamp', 'lamppost', 'street light', 'streetlight', 'lantern', 'light post', 'yellow light', 'warm light', 'glow on the ground'],
    description: 'A street lamp on the left casting a warm yellow glow',
    hints: [
      'Look at the lower-left — anything standing alone with a glow?',
      'Lower-left: a tall thin post with a warm yellowish light at the top.'
    ],
  },
];

// ─── Image Paths ─────────────────────────────────────────────────────

const SUNSET_IMAGE = '/images/say-what-you-see/sunset-landscape.png';
const CITYSCAPE_IMAGE = '/images/say-what-you-see/night-cityscape.png';

// ─── Keyword Fallback Evaluator ──────────────────────────────────────

// Word-boundary match to avoid substring false positives (e.g. "orange" matching "range")
function matchesKeyword(text: string, keyword: string): boolean {
  // For multi-word keywords, just check includes (they're specific enough)
  if (keyword.includes(' ')) {
    return text.includes(keyword);
  }
  // For single-word keywords, require word boundaries
  const regex = new RegExp(`\\b${keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`, 'i');
  return regex.test(text);
}

function evaluateWithKeywords(
  text: string,
  elements: SceneElement[],
  attemptNumber: number
): RoundResult {
  const lower = text.toLowerCase();
  const matched: string[] = [];
  const missed: string[] = [];
  const elementQuotes: ElementQuote[] = [];

  for (const el of elements) {
    const matchedKeyword = el.keywords.find(kw => matchesKeyword(lower, kw));
    if (matchedKeyword) {
      matched.push(el.id);
      // Find the student's actual phrase that contains the keyword
      const trimmedKw = matchedKeyword.trim();
      // Try to extract a short surrounding phrase from the student's text
      const kwIndex = lower.indexOf(trimmedKw);
      if (kwIndex !== -1) {
        // Grab up to ~40 chars of context around the keyword
        const start = Math.max(0, text.lastIndexOf(' ', Math.max(0, kwIndex - 15)) + 1);
        const end = Math.min(text.length, text.indexOf(' ', kwIndex + trimmedKw.length + 15));
        const phrase = text.slice(start, end === -1 ? text.length : end).trim();
        elementQuotes.push({ elementId: el.id, studentPhrase: phrase });
      } else {
        elementQuotes.push({ elementId: el.id, studentPhrase: matchedKeyword.trim() });
      }
    } else {
      missed.push(el.id);
    }
  }

  const ratio = matched.length / elements.length;
  let score: number;
  if (ratio >= 0.85) score = 5;
  else if (ratio >= 0.65) score = 4;
  else if (ratio >= 0.50) score = 3;
  else if (ratio >= 0.30) score = 2;
  else score = 1;

  let tip: string;
  if (ratio >= MATCH_THRESHOLD) {
    tip = 'You hit the 65% threshold! Try adding positions and relationships between objects for even stronger descriptions.';
  } else if (ratio >= 0.45) {
    tip = 'Getting closer! Describe colors, shapes, and positions more specifically.';
  } else {
    tip = 'Describe each part of the image — its color, shape, and position. Work from center outward.';
  }

  // Build progressive hints from element hint data
  const hintLevel = attemptNumber >= 2 ? 1 : 0;
  const missedHints: MissedHint[] = missed.map(id => {
    const el = elements.find(e => e.id === id);
    if (!el) return { elementId: id, hint: '' };
    return { elementId: id, hint: el.hints[hintLevel] };
  }).filter(h => h.hint);

  // Build structured feedback — keep it short for teens
  const matchedLabels = matched.slice(0, 3).map(id => elements.find(e => e.id === id)?.label).filter(Boolean);
  let whatYouDidWell: string;
  if (matched.length === 0) {
    whatYouDidWell = 'Start with the most obvious thing in the center, then work outward.';
  } else if (ratio >= MATCH_THRESHOLD) {
    whatYouDidWell = `Nice! You captured the key elements: ${matchedLabels.join(', ')}.`;
  } else {
    whatYouDidWell = '';  // Matched quotes already show what they got — no need to repeat
  }

  const techniqueCoaching = attemptNumber === 0
    ? 'Tip: Describe background, middle, and foreground separately.'
    : 'Tip: Say WHERE things are, not just what they are.';

  const whereToLook = missedHints.length > 0
    ? missedHints.slice(0, 3).map(h => h.hint).join(' ')
    : '';

  return {
    score, matched, missed, tip,
    elementQuotes,
    missedHints,
    feedbackSections: { whatYouDidWell, techniqueCoaching, whereToLook },
    usedGemini: false,
  };
}

// ─── Gemini Evaluator ────────────────────────────────────────────────

async function evaluateWithGemini(
  text: string,
  elements: SceneElement[],
  roundLabel: string,
  attemptNumber: number
): Promise<RoundResult | null> {
  const elementList = elements
    .map(el => `- "${el.id}" (${el.label}): ${el.description}`)
    .join('\n');

  const prompt = `You are evaluating a high school student's description of a ${roundLabel} scene for an AI literacy class about prompting. This is their attempt #${attemptNumber + 1}.

The scene contains these elements:
${elementList}

The student wrote:
"${text}"

Evaluate which elements the student mentioned (directly or indirectly). Return ONLY valid JSON with no markdown formatting:
{
  "matched": ["element_id", ...],
  "missed": ["element_id", ...],
  "score": 3,
  "elementQuotes": [
    {"elementId": "sky", "studentPhrase": "the sky fades from orange to purple"}
  ],
  "missedHints": [
    {"elementId": "lake", "hint": "Look at the bottom half — what large surface fills that space?"}
  ],
  "feedbackSections": {
    "whatYouDidWell": "",
    "techniqueCoaching": "Tip: Describe background, middle, and foreground.",
    "whereToLook": "Check the bottom half and upper corners."
  }
}

Rules for scoring (1-5):
- 5: Mentioned almost all elements with spatial detail
- 4: Mentioned most elements clearly (65%+ match)
- 3: Mentioned about half the elements
- 2: Mentioned only a few elements
- 1: Very vague, almost nothing specific

Rules for matching:
- Match if the student clearly references the element, even with different words
- "the sky changes color" matches "sky" element
- "tall structure" matches "tall-buildings"
- Be generous with synonyms but don't match pure guesses

Rules for elementQuotes:
- For EACH matched element, quote the student's EXACT words (3-10 words, copy verbatim from their text)
- Only include quotes for matched elements

Rules for missedHints:
- For each missed element, write a SPATIAL or VISUAL hint
- NEVER name the element or use its label in the hint
- Use directions like "top", "bottom", "left", "right", "center", "foreground"
- Use visual cues: "there's something reflective", "notice the thin shapes"
- For attempt #2+, make hints more specific than attempt #1
- Keep each hint to 1 sentence

Rules for feedbackSections (KEEP EACH FIELD TO 1 SHORT SENTENCE — this is for teens, not essays):
- whatYouDidWell: Only fill this if they matched 65%+. One short sentence, e.g. "Nice — you nailed the main elements."  Leave empty string "" otherwise (the matched quotes already show what they got).
- techniqueCoaching: One quick tip, max 10 words, e.g. "Tip: Describe background, middle, and foreground separately."
- whereToLook: Spatial directions only, 1-2 short sentences, e.g. "Check the bottom half and upper corners." Do NOT name the elements.`;

  try {
    const raw = await generateWithGemini(prompt, {
      temperature: 0.3,
      maxOutputTokens: 1200,
    });
    if (!raw) return null;

    const cleaned = raw.replace(/```json\s*/g, '').replace(/```\s*/g, '').trim();
    const parsed = JSON.parse(cleaned);

    if (
      Array.isArray(parsed.matched) &&
      Array.isArray(parsed.missed) &&
      typeof parsed.score === 'number'
    ) {
      return {
        matched: parsed.matched,
        missed: parsed.missed,
        score: Math.max(1, Math.min(5, Math.round(parsed.score))),
        tip: typeof parsed.tip === 'string' ? parsed.tip : '',
        elementQuotes: Array.isArray(parsed.elementQuotes) ? parsed.elementQuotes : undefined,
        missedHints: Array.isArray(parsed.missedHints) ? parsed.missedHints : undefined,
        feedbackSections: parsed.feedbackSections && typeof parsed.feedbackSections === 'object'
          ? {
              whatYouDidWell: parsed.feedbackSections.whatYouDidWell || '',
              techniqueCoaching: parsed.feedbackSections.techniqueCoaching || '',
              whereToLook: parsed.feedbackSections.whereToLook || '',
            }
          : undefined,
        usedGemini: true,
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

// ─── Match Percentage Bar ────────────────────────────────────────────

const MatchBar: React.FC<{ matched: number; total: number }> = ({ matched, total }) => {
  const pct = Math.round((matched / total) * 100);
  const passed = pct >= MATCH_THRESHOLD * 100;
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-sm font-medium">
        <span className="text-gray-700">Elements Matched</span>
        <span className={passed ? 'text-green-700' : 'text-orange-600'}>
          {matched}/{total} ({pct}%)
        </span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-700 ${passed ? 'bg-green-500' : 'bg-orange-400'}`}
          style={{ width: `${pct}%` }}
        />
        {/* Threshold marker */}
        <div
          className="relative"
          style={{ marginTop: '-16px', marginLeft: `${MATCH_THRESHOLD * 100}%` }}
        >
          <div className="w-0.5 h-4 bg-gray-700" />
        </div>
      </div>
      <p className="text-xs text-gray-500">
        Goal: {Math.round(MATCH_THRESHOLD * 100)}% match to proceed
      </p>
    </div>
  );
};

// ─── Element Badges Component ────────────────────────────────────────

const ElementBadges: React.FC<{
  elements: SceneElement[];
  matched: string[];
  revealAll: boolean;
}> = ({ elements, matched, revealAll }) => (
  <div className="flex flex-wrap gap-2">
    {elements.map(el => {
      const isMatched = matched.includes(el.id);
      if (isMatched) {
        return (
          <span
            key={el.id}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-300"
          >
            <CheckCircle className="w-3 h-3" />
            {el.label}
          </span>
        );
      }
      // Missed elements: show name only if revealAll (pass or escape hatch)
      return (
        <span
          key={el.id}
          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-400 border border-gray-200"
        >
          {revealAll ? el.label : '?'}
        </span>
      );
    })}
  </div>
);

// ─── Feedback Card Component ─────────────────────────────────────────
// Shows student's description + AI evaluation + spatial hints

const FeedbackCard: React.FC<{
  text: string;
  result: RoundResult;
  elements: SceneElement[];
  passed: boolean;
  revealAll: boolean;
}> = ({ text, result, elements, passed, revealAll }) => {
  const getElementLabel = (id: string) => {
    const el = elements.find(e => e.id === id);
    return el ? el.label : id;
  };

  return (
    <div className="space-y-4">
      {/* Student's description */}
      <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 space-y-3">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-slate-600 flex-shrink-0" />
          <h4 className="text-sm font-semibold text-slate-900">Your Description</h4>
        </div>
        <div className="bg-white rounded-lg p-4 border border-slate-100">
          <p className="text-sm leading-relaxed text-gray-800 italic">&ldquo;{text}&rdquo;</p>
        </div>

        {/* Matched quotes — show which words triggered each match */}
        {result.elementQuotes && result.elementQuotes.length > 0 && (
          <div className="space-y-2">
            <p className="text-xs font-semibold text-green-700 uppercase tracking-wide">Your Words That Matched</p>
            <div className="grid gap-1.5">
              {result.elementQuotes.map((eq, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2 text-sm bg-green-50 border border-green-100 rounded px-3 py-1.5"
                >
                  <CheckCircle className="w-3.5 h-3.5 text-green-600 flex-shrink-0" />
                  <span className="text-green-900 font-medium">&ldquo;{eq.studentPhrase}&rdquo;</span>
                  <ArrowRight className="w-3 h-3 text-green-400 flex-shrink-0" />
                  <span className="text-green-700 text-xs">{getElementLabel(eq.elementId)}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Element badges */}
        <div>
          <p className="text-sm font-medium text-gray-700 mb-1">
            Scene Elements ({result.matched.length} of {elements.length} found):
          </p>
          <p className="text-xs text-gray-500 mb-2">
            Green = found. Gray = missed.
          </p>
          <ElementBadges elements={elements} matched={result.matched} revealAll={revealAll} />
        </div>
      </div>

      {/* AI Feedback — single consolidated box */}
      {result.feedbackSections && (
        <div className="space-y-3">
          {/* Success message — only on pass */}
          {passed && result.feedbackSections.whatYouDidWell && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                <p className="text-sm text-green-900">{result.feedbackSections.whatYouDidWell}</p>
              </div>
            </div>
          )}

          {/* Hints + tip — single box on failure */}
          {!passed && (result.feedbackSections.whereToLook || result.feedbackSections.techniqueCoaching) && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 space-y-2">
              <div className="flex items-center gap-2">
                <Lightbulb className="w-4 h-4 text-amber-600 flex-shrink-0" />
                <p className="text-xs font-semibold text-amber-800 uppercase tracking-wide">Hints</p>
              </div>
              {result.feedbackSections.whereToLook && (
                <p className="text-sm text-amber-900 pl-6">{result.feedbackSections.whereToLook}</p>
              )}
              {result.feedbackSections.techniqueCoaching && (
                <p className="text-sm text-amber-800 pl-6 italic">{result.feedbackSections.techniqueCoaching}</p>
              )}
            </div>
          )}
        </div>
      )}

      {/* Progressive hints for missed elements — only on failure, only if no feedbackSections */}
      {!passed && !result.feedbackSections && result.missedHints && result.missedHints.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 space-y-2">
          <div className="flex items-center gap-2">
            <Lightbulb className="w-4 h-4 text-amber-600 flex-shrink-0" />
            <p className="text-xs font-semibold text-amber-800 uppercase tracking-wide">Hints</p>
          </div>
          <div className="space-y-2">
            {result.missedHints.slice(0, 4).map((hint, i) => (
              <p key={i} className="text-sm text-amber-900 leading-relaxed pl-6">
                {hint.hint}
              </p>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// ─── Highlighted Prompt Component ─────────────────────────────────────
// Shows the actual AI prompt with each element phrase color-coded

const HighlightedPrompt: React.FC<{
  segments: PromptSegment[];
  matched: string[];
  sceneLabel: string;
}> = ({ segments, matched, sceneLabel }) => {
  const matchedCount = segments.filter(s => s.elementId && matched.includes(s.elementId)).length;
  const elementCount = segments.filter(s => s.elementId).length;

  return (
    <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4 space-y-3">
      <div className="flex items-center gap-2">
        <Sparkles className="w-5 h-5 text-indigo-600 flex-shrink-0" />
        <h4 className="text-sm font-semibold text-indigo-900">
          The AI Prompt That Generated This {sceneLabel}
        </h4>
      </div>

      <div className="bg-white rounded-lg p-4 border border-indigo-100">
        <p className="text-sm leading-relaxed font-mono">
          {segments.map((seg, i) => {
            if (!seg.elementId) {
              return <span key={i} className="text-gray-600">{seg.text}</span>;
            }
            const isMatched = matched.includes(seg.elementId);
            return (
              <span
                key={i}
                className={`font-semibold rounded px-0.5 ${
                  isMatched
                    ? 'bg-green-100 text-green-800 border-b-2 border-green-400'
                    : 'bg-red-50 text-red-700 border-b-2 border-red-300'
                }`}
                title={isMatched ? 'You spotted this!' : 'You missed this element'}
              >
                {seg.text}
              </span>
            );
          })}
        </p>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 text-xs">
        <span className="flex items-center gap-1">
          <span className="inline-block w-3 h-3 rounded bg-green-200 border border-green-400" />
          <span className="text-green-800">You described ({matchedCount})</span>
        </span>
        <span className="flex items-center gap-1">
          <span className="inline-block w-3 h-3 rounded bg-red-50 border border-red-300" />
          <span className="text-red-700">You missed ({elementCount - matchedCount})</span>
        </span>
      </div>

      <p className="text-xs text-indigo-700">
        This image was generated by AI. Notice how <strong>each highlighted phrase</strong> in the
        prompt became a specific element in the image. The more detail in a prompt, the more control
        you have over the output. <strong>That&apos;s the power of specific prompting!</strong>
      </p>
    </div>
  );
};

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

  // Attempt tracking for escape hatch
  const [round1Attempts, setRound1Attempts] = useState(0);
  const [round2Attempts, setRound2Attempts] = useState(0);
  const [showEscapeHatch1, setShowEscapeHatch1] = useState(false);
  const [showEscapeHatch2, setShowEscapeHatch2] = useState(false);

  // Dev mode: jump straight to summary
  useEffect(() => {
    if (isDevMode) {
      setRound1Result({ score: 4, matched: ['sky', 'sun', 'back-mountains', 'front-mountains', 'lake'], missed: ['clouds', 'reflection'], tip: 'Dev mode auto-complete.', usedGemini: false });
      setRound2Result({ score: 4, matched: ['night-sky', 'moon', 'stars', 'tall-buildings', 'windows', 'spire', 'street', 'street-lamp'], missed: ['road-markings', 'cylindrical-building'], tip: 'Dev mode auto-complete.', usedGemini: false });
      setStep('summary');
    }
  }, [isDevMode]);

  const getMatchPercentage = (result: RoundResult, elements: SceneElement[]) => {
    return result.matched.length / elements.length;
  };

  const handleEvaluate = async (round: 1 | 2) => {
    const text = round === 1 ? round1Text : round2Text;
    const elements = round === 1 ? SUNSET_ELEMENTS : CITYSCAPE_ELEMENTS;
    const label = round === 1 ? 'sunset landscape' : 'night cityscape';
    const currentAttempts = round === 1 ? round1Attempts : round2Attempts;

    setIsEvaluating(true);

    let result: RoundResult | null = null;

    if (isGeminiConfigured()) {
      result = await evaluateWithGemini(text, elements, label, currentAttempts);
    }

    // Fallback to keyword matching
    if (!result) {
      result = evaluateWithKeywords(text, elements, currentAttempts);
    }

    const matchPct = result.matched.length / elements.length;
    const passed = matchPct >= MATCH_THRESHOLD;

    if (round === 1) {
      setRound1Result(result);
      const newAttempts = round1Attempts + 1;
      setRound1Attempts(newAttempts);
      if (!passed && newAttempts >= MAX_ATTEMPTS) {
        setShowEscapeHatch1(true);
      }
      setStep('feedback1');
    } else {
      setRound2Result(result);
      const newAttempts = round2Attempts + 1;
      setRound2Attempts(newAttempts);
      if (!passed && newAttempts >= MAX_ATTEMPTS) {
        setShowEscapeHatch2(true);
      }
      setStep('feedback2');
    }

    setIsEvaluating(false);
  };

  const handleTryAgain = (round: 1 | 2) => {
    if (round === 1) {
      setRound1Text('');
      setRound1Result(null);
      setStep('round1');
      // DON'T reset attempts or escape hatch
    } else {
      setRound2Text('');
      setRound2Result(null);
      setStep('round2');
    }
  };

  const handleSkipRound = (round: 1 | 2) => {
    if (round === 1) {
      setStep('round2');
    } else {
      setStep('summary');
    }
  };

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
          You&apos;ll see two AI-generated scenes. For each one, describe everything you notice in as much
          detail as possible. You need to identify at least <strong>65% of the elements</strong> to move on.
        </p>
        <p className="text-sm text-purple-700 mt-2">
          This is the same skill you use when writing AI prompts &mdash; being specific gets better results!
          Once you pass, you&apos;ll see the actual AI prompt used to create the image.
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
    const imageSrc = round === 1 ? SUNSET_IMAGE : CITYSCAPE_IMAGE;
    const sceneLabel = round === 1 ? 'Sunset Landscape' : 'Night Cityscape';
    const attempts = round === 1 ? round1Attempts : round2Attempts;

    return (
      <motion.div
        key={`round${round}-attempt${attempts}`}
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
          <p className="text-sm text-gray-600 mt-1">
            Describe everything you see &mdash; colors, shapes, positions, details.
            {attempts > 0 && (
              <span className="text-orange-600 font-medium"> Use the hints from your last attempt!</span>
            )}
          </p>
        </div>

        <div className="relative w-full rounded-xl overflow-hidden border-2 border-gray-200 shadow-inner">
          <img
            src={imageSrc}
            alt={`AI-generated ${sceneLabel.toLowerCase()} scene. Describe what you see in detail.`}
            className="w-full h-auto"
            style={{ aspectRatio: '4/3', objectFit: 'cover' }}
          />
          <div className="absolute top-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded-full">
            AI Generated
          </div>
        </div>

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
    const studentText = round === 1 ? round1Text : round2Text;
    const elements = round === 1 ? SUNSET_ELEMENTS : CITYSCAPE_ELEMENTS;
    const imageSrc = round === 1 ? SUNSET_IMAGE : CITYSCAPE_IMAGE;
    const sceneLabel = round === 1 ? 'Sunset Landscape' : 'Night Cityscape';
    const showEscape = round === 1 ? showEscapeHatch1 : showEscapeHatch2;
    const attempts = round === 1 ? round1Attempts : round2Attempts;

    if (!result) return null;

    const matchPct = getMatchPercentage(result, elements);
    const passed = matchPct >= MATCH_THRESHOLD;
    const revealAll = passed || showEscape;

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
            {sceneLabel} &mdash; Results
          </h3>
          {attempts > 1 && (
            <p className="text-xs text-gray-500 mt-1">Attempt {attempts}</p>
          )}
        </div>

        <div className="relative w-full rounded-xl overflow-hidden border-2 border-gray-200 shadow-inner">
          <img
            src={imageSrc}
            alt={`AI-generated ${sceneLabel.toLowerCase()} scene`}
            className="w-full h-auto"
            style={{ aspectRatio: '4/3', objectFit: 'cover' }}
          />
        </div>

        {/* Scores */}
        <div className="bg-white border border-gray-200 rounded-lg p-5 space-y-4">
          <ScoreBar score={result.score} label="Specificity Score" />
          <MatchBar matched={result.matched.length} total={elements.length} />

          {passed && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-3 flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
              <p className="text-sm text-green-800 font-medium">
                You passed the 65% threshold! Nice observational skills.
              </p>
            </div>
          )}

          {!passed && (
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
              <p className="text-sm text-orange-800">
                You matched {result.matched.length} of {elements.length} elements.
                Use the hints below to find what you missed and try again.
              </p>
            </div>
          )}
        </div>

        {/* Student's description + feedback + hints */}
        <FeedbackCard
          text={studentText}
          result={result}
          elements={elements}
          passed={passed}
          revealAll={revealAll}
        />

        {/* AI prompt — ONLY shown on pass or escape hatch */}
        {revealAll && (
          <HighlightedPrompt
            segments={round === 1 ? SUNSET_PROMPT_SEGMENTS : CITYSCAPE_PROMPT_SEGMENTS}
            matched={result.matched}
            sceneLabel={sceneLabel}
          />
        )}

        {/* Teaser when prompt is hidden */}
        {!revealAll && (
          <div className="bg-indigo-50 border border-indigo-200 border-dashed rounded-lg p-4 text-center">
            <Sparkles className="w-5 h-5 text-indigo-400 mx-auto mb-2" />
            <p className="text-sm text-indigo-700 font-medium">
              Match 65% of the scene elements to reveal the AI prompt that created this image!
            </p>
          </div>
        )}

        {/* Action buttons */}
        {passed ? (
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
        ) : (
          <div className="space-y-3">
            <Button
              onClick={() => handleTryAgain(round)}
              size="lg"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            >
              <RotateCcw className="mr-2 h-5 w-5" />
              Try Again &mdash; Use the Hints Above
            </Button>

            {/* Escape hatch after MAX_ATTEMPTS */}
            {showEscape && (
              <div className="bg-amber-50 border border-amber-300 rounded-lg p-4 space-y-3">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-amber-900">
                      Having trouble? That&apos;s okay!
                    </p>
                    <p className="text-xs text-amber-800 mt-1">
                      You&apos;ve given it {attempts} tries. Check out the AI prompt above to see
                      how each detail in the prompt became a specific element in the image, then continue or try again.
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={() => handleTryAgain(round)}
                    variant="outline"
                    size="sm"
                    className="text-amber-800 border-amber-400 hover:bg-amber-100"
                  >
                    Try One More Time
                  </Button>
                  <Button
                    onClick={() => handleSkipRound(round)}
                    size="sm"
                    className="bg-amber-600 hover:bg-amber-700 text-white"
                  >
                    Continue Anyway
                    <ArrowRight className="ml-1 h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </motion.div>
    );
  };

  const renderSummary = () => {
    const r1Pct = round1Result ? Math.round((round1Result.matched.length / SUNSET_ELEMENTS.length) * 100) : 0;
    const r2Pct = round2Result ? Math.round((round2Result.matched.length / CITYSCAPE_ELEMENTS.length) * 100) : 0;

    return (
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
                {round1Result.matched.length}/{SUNSET_ELEMENTS.length} elements ({r1Pct}%)
                {round1Attempts > 1 && ` \u2022 ${round1Attempts} attempts`}
              </p>
            </div>
          )}
          {round2Result && (
            <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4 space-y-2">
              <p className="text-sm font-semibold text-indigo-900">Round 2: Cityscape</p>
              <ScoreBar score={round2Result.score} />
              <p className="text-xs text-indigo-800">
                {round2Result.matched.length}/{CITYSCAPE_ELEMENTS.length} elements ({r2Pct}%)
                {round2Attempts > 1 && ` \u2022 ${round2Attempts} attempts`}
              </p>
            </div>
          )}
        </div>

        {/* Show both highlighted prompts in summary */}
        <div className="space-y-4">
          <h4 className="text-sm font-semibold text-gray-700">The AI prompts that created these images:</h4>
          {round1Result && (
            <HighlightedPrompt
              segments={SUNSET_PROMPT_SEGMENTS}
              matched={round1Result.matched}
              sceneLabel="Sunset Landscape"
            />
          )}
          {round2Result && (
            <HighlightedPrompt
              segments={CITYSCAPE_PROMPT_SEGMENTS}
              matched={round2Result.matched}
              sceneLabel="Night Cityscape"
            />
          )}
        </div>

        <div className="bg-purple-50 border border-purple-200 rounded-lg p-5">
          <h4 className="font-semibold text-purple-900 mb-2">Key Takeaway</h4>
          <p className="text-sm text-purple-800">
            The more specific and detailed your description, the more elements the AI could
            identify. Look at the highlighted prompts above &mdash; every <span className="bg-green-100 text-green-800 px-1 rounded">green phrase</span> is
            a detail you noticed, and every <span className="bg-red-50 text-red-700 px-1 rounded">red phrase</span> is
            one you missed. <strong>Specific prompts produce specific AI outputs</strong>. Vague
            instructions lead to vague results. As you learn to write prompts, remember: details matter.
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
  };

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
