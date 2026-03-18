import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import {
  ArrowRight, CheckCircle, Sparkles, Eye, Loader, AlertTriangle, AlertCircle, RotateCcw, Lightbulb, MessageSquare, Brain
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

type Step = 'intro' | 'round1' | 'feedback1' | 'round2' | 'reveal' | 'takeaway';

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

const WAVE_PROMPT_SEGMENTS: PromptSegment[] = [
  { text: 'Create an image in the style of a ' },
  { text: 'Japanese ukiyo-e woodblock print', elementId: 'art-style' },
  { text: '. ' },
  { text: 'A massive curling wave dominates the foreground', elementId: 'great-wave' },
  { text: ' with ' },
  { text: 'white foam and spray at the crest', elementId: 'foam' },
  { text: '. ' },
  { text: 'A small snow-capped mountain in the distant background', elementId: 'mountain' },
  { text: '. ' },
  { text: 'Small wooden boats with rowers caught in the waves', elementId: 'boats' },
  { text: '. ' },
  { text: 'Deep indigo and Prussian blue ocean water', elementId: 'blue-water' },
  { text: '. ' },
  { text: 'Pale sky with subtle clouds', elementId: 'sky' },
  { text: '. No text.' },
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

const WAVE_ELEMENTS: SceneElement[] = [
  {
    id: 'art-style', label: 'Ukiyo-e / Woodblock Print Style',
    keywords: ['woodblock', 'ukiyo', 'japanese art', 'japanese style', 'print', 'traditional japanese', 'painted', 'illustration', 'artistic style', 'flat color', 'woodcut'],
    description: 'The image is rendered in the style of a Japanese ukiyo-e woodblock print with flat colors and bold outlines',
    hints: [
      'This doesn\'t look like a photograph. What art style or tradition does it remind you of?',
      'Think about the flat colors and bold outlines — this is a famous Japanese art technique. What is it called?'
    ],
  },
  {
    id: 'great-wave', label: 'Great Curling Wave',
    keywords: ['wave', 'waves', 'curling wave', 'big wave', 'ocean wave', 'towering wave', 'crashing wave', 'surge', 'swell'],
    description: 'A massive curling wave dominates the foreground of the image',
    hints: [
      'What is the largest, most dramatic shape in the image?',
      'The foreground is dominated by a huge curved shape made of water — describe its size and motion.'
    ],
  },
  {
    id: 'foam', label: 'White Foam & Spray',
    keywords: ['foam', 'spray', 'white cap', 'whitecap', 'crest', 'froth', 'splashing', 'mist', 'fingers of foam', 'claws'],
    description: 'White foam and spray at the crest of the wave, with finger-like tendrils',
    hints: [
      'Look at the very top of the wave — what is happening at its tip?',
      'The crest breaks into white tendrils that look almost like fingers reaching out.'
    ],
  },
  {
    id: 'mountain', label: 'Distant Mountain',
    keywords: ['mountain', 'fuji', 'mount fuji', 'snow', 'snow-capped', 'peak', 'volcano', 'distant mountain', 'background mountain'],
    description: 'A small snow-capped mountain visible in the distant background, framed by the waves',
    hints: [
      'Look far into the background, between or below the waves — is there a landform?',
      'In the gap between the waves, far in the distance, there is a small triangular shape with white on top.'
    ],
  },
  {
    id: 'boats', label: 'Wooden Boats',
    keywords: ['boat', 'boats', 'ship', 'vessel', 'canoe', 'rowing', 'rowers', 'fishermen', 'people', 'figures'],
    description: 'Small wooden boats with rowers caught in the turbulent waves',
    hints: [
      'Look beneath and between the waves — are there any objects or people?',
      'There are narrow wooden shapes with tiny figures inside them, being tossed by the water.'
    ],
  },
  {
    id: 'blue-water', label: 'Deep Blue Ocean',
    keywords: ['blue', 'indigo', 'prussian blue', 'dark blue', 'deep blue', 'ocean', 'sea', 'water color', 'navy'],
    description: 'Deep indigo and Prussian blue coloring of the ocean water',
    hints: [
      'What are the dominant colors of the water? Be specific about the shades.',
      'The water isn\'t just "blue" — describe the specific shade. Is it light? Dark? What would an artist call it?'
    ],
  },
  {
    id: 'sky', label: 'Pale Sky',
    keywords: ['sky', 'pale sky', 'light sky', 'background sky', 'clouds', 'overcast', 'grey sky', 'gray sky', 'yellowish sky'],
    description: 'A pale, muted sky visible in the background with subtle clouds',
    hints: [
      'What fills the space above and behind the wave?',
      'Behind all the action, the upper background has a light, muted tone — describe its color.'
    ],
  },
];

// ─── Image Paths ─────────────────────────────────────────────────────

const SUNSET_IMAGE = '/images/say-what-you-see/sunset-landscape.png';
const WAVE_IMAGE = '/images/say-what-you-see/ukiyo-wave.png';

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
        Each <strong>highlighted phrase</strong> in the prompt became a specific element in the image.
        More detail = more control.
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
  const [isEvaluating, setIsEvaluating] = useState(false);

  // Attempt tracking for escape hatch (round 1 only — round 2 is single-attempt)
  const [round1Attempts, setRound1Attempts] = useState(0);
  const [showEscapeHatch1, setShowEscapeHatch1] = useState(false);

  // Round 2: simplified — just tracks if they mentioned the style
  const [round2MentionedStyle, setRound2MentionedStyle] = useState(false);

  // Dev mode: manual skip to takeaway
  const handleDevAutoComplete = () => {
    setRound1Result({ score: 4, matched: ['sky', 'sun', 'back-mountains', 'front-mountains', 'lake'], missed: ['clouds', 'reflection'], tip: 'Dev mode auto-complete.', usedGemini: false });
    setRound2MentionedStyle(false);
    setStep('takeaway');
  };

  const getMatchPercentage = (result: RoundResult, elements: SceneElement[]) => {
    return result.matched.length / elements.length;
  };

  const handleEvaluate = async (round: 1 | 2) => {
    const text = round === 1 ? round1Text : round2Text;
    const elements = round === 1 ? SUNSET_ELEMENTS : WAVE_ELEMENTS;
    const label = round === 1 ? 'sunset landscape' : 'Japanese wave';
    const currentAttempts = round === 1 ? round1Attempts : 0;

    if (round === 2) {
      // Round 2: No heavy evaluation — just check if they mentioned the art style
      const mentionedStyle = WAVE_ELEMENTS[0].keywords.some(kw =>
        text.toLowerCase().includes(kw.toLowerCase())
      );
      setRound2MentionedStyle(mentionedStyle);
      setStep('reveal');
      return;
    }

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

    setRound1Result(result);
    const newAttempts = round1Attempts + 1;
    setRound1Attempts(newAttempts);
    if (!passed && newAttempts >= MAX_ATTEMPTS) {
      setShowEscapeHatch1(true);
    }
    setStep('feedback1');

    setIsEvaluating(false);
  };

  const handleTryAgain = () => {
    setRound1Text('');
    setRound1Result(null);
    setStep('round1');
    // DON'T reset attempts or escape hatch
  };

  const handleSkipRound1 = () => {
    setStep('round2');
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
        <h3 className="text-lg font-semibold text-purple-900 mb-2">Your First Prompt Challenge</h3>
        <p className="text-purple-800">
          You&apos;ll see two AI-generated images. Describe every detail you see &mdash;
          like you&apos;re writing the prompt that created it.
        </p>
        <p className="text-sm text-purple-700 mt-2">
          Match <strong>65% of the elements</strong> to unlock the actual AI prompt.
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
    const imageSrc = round === 1 ? SUNSET_IMAGE : WAVE_IMAGE;
    const sceneLabel = round === 1 ? 'Sunset Landscape' : 'The Great Wave';
    const attempts = round === 1 ? round1Attempts : 0;

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
            Describe what you see &mdash; colors, shapes, positions, style. Be specific.
            {round === 1 && attempts > 0 && (
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
            placeholder="Create an image of..."
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

  // ─── Round 1 Feedback (multi-attempt with escape hatch) ──────────
  const renderRound1Feedback = () => {
    if (!round1Result) return null;

    const matchPct = getMatchPercentage(round1Result, SUNSET_ELEMENTS);
    const passed = matchPct >= MATCH_THRESHOLD;
    const revealAll = passed || showEscapeHatch1;

    return (
      <motion.div
        key="feedback1"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="space-y-5"
      >
        <h3 className="text-xl font-bold text-gray-900 text-center">
          Sunset Landscape &mdash; Results
        </h3>

        <div className="relative w-full rounded-xl overflow-hidden border-2 border-gray-200 shadow-inner">
          <img
            src={SUNSET_IMAGE}
            alt="AI-generated sunset landscape scene"
            className="w-full h-auto"
            style={{ aspectRatio: '4/3', objectFit: 'cover' }}
          />
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-5 space-y-4">
          <ScoreBar score={round1Result.score} label="Specificity Score" />
          <MatchBar matched={round1Result.matched.length} total={SUNSET_ELEMENTS.length} />

          {passed && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-3 flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
              <p className="text-sm text-green-800 font-medium">
                Nice observational skills!
              </p>
            </div>
          )}

          {!passed && (
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
              <p className="text-sm text-orange-800">
                {round1Result.matched.length}/{SUNSET_ELEMENTS.length} elements matched. Use the hints below and try again.
              </p>
            </div>
          )}
        </div>

        <FeedbackCard
          text={round1Text}
          result={round1Result}
          elements={SUNSET_ELEMENTS}
          passed={passed}
          revealAll={revealAll}
        />

        {revealAll && (
          <HighlightedPrompt
            segments={SUNSET_PROMPT_SEGMENTS}
            matched={round1Result.matched}
            sceneLabel="Sunset Landscape"
          />
        )}

        {!revealAll && (
          <div className="bg-indigo-50 border border-indigo-200 border-dashed rounded-lg p-4 text-center">
            <Sparkles className="w-5 h-5 text-indigo-400 mx-auto mb-2" />
            <p className="text-sm text-indigo-700 font-medium">
              Match 65% to unlock the actual AI prompt!
            </p>
          </div>
        )}

        {passed ? (
          <Button
            onClick={() => setStep('round2')}
            size="lg"
            className="w-full bg-purple-600 hover:bg-purple-700 text-white"
          >
            Try Scene 2
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        ) : (
          <div className="space-y-3">
            <Button
              onClick={handleTryAgain}
              size="lg"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            >
              <RotateCcw className="mr-2 h-5 w-5" />
              Try Again
            </Button>

            {showEscapeHatch1 && (
              <div className="bg-amber-50 border border-amber-300 rounded-lg p-4 space-y-3">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-amber-800">
                    No worries! Check out the AI prompt above, then continue.
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={handleTryAgain}
                    variant="outline"
                    size="sm"
                    className="text-amber-800 border-amber-400 hover:bg-amber-100"
                  >
                    Try One More Time
                  </Button>
                  <Button
                    onClick={handleSkipRound1}
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

  // ─── Round 2 Reveal: Step-by-step pop-up sequence ──────────────
  const [revealStep, setRevealStep] = useState(0);

  const renderReveal = () => {
    const bubbles = [
      {
        icon: <Eye className="w-8 h-8 text-white" />,
        bg: 'from-blue-500 to-blue-700',
        border: 'border-blue-400',
        title: 'Did you include this in your prompt attempt?',
        content: (
          <p className="text-lg text-gray-900">
            <span className="font-mono bg-blue-50 border border-blue-200 rounded px-2 py-1 text-blue-800">...in the style of a <strong>Japanese ukiyo-e woodblock print</strong>...</span>
          </p>
        ),
      },
      {
        icon: <AlertCircle className="w-8 h-8 text-white" />,
        bg: 'from-orange-500 to-red-500',
        border: 'border-orange-400',
        title: round2MentionedStyle ? 'Nice — you knew the term!' : 'Most people don\u2019t know this term.',
        content: (
          <p className="text-lg text-gray-900">
            You could get <em>close</em> without it — but it would take more words, more back-and-forth, and the result still wouldn&apos;t be as accurate.
            Knowing the right term gets you there in <strong>one shot</strong>.
          </p>
        ),
      },
      {
        icon: <Brain className="w-8 h-8 text-white" />,
        bg: 'from-purple-500 to-purple-700',
        border: 'border-purple-400',
        title: 'Techniques + Knowledge',
        content: (
          <div className="space-y-3">
            <p className="text-lg text-gray-900">
              We&apos;re about to teach you prompting techniques — but <strong>what you know</strong> should always be front and center.
            </p>
            <p className="text-gray-700">
              Techniques structure your prompt. <strong>Your knowledge fills it with the right words.</strong>
            </p>
          </div>
        ),
      },
    ];

    const current = bubbles[revealStep];
    const isLast = revealStep === bubbles.length - 1;

    return (
      <motion.div
        key="reveal"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="space-y-5"
      >
        {/* Wave image stays visible in background, smaller */}
        <div className="relative w-full rounded-xl overflow-hidden border-2 border-gray-200 shadow-inner opacity-80">
          <img
            src={WAVE_IMAGE}
            alt="AI-generated Japanese wave scene"
            className="w-full h-auto"
            style={{ aspectRatio: '4/3', objectFit: 'cover' }}
          />
        </div>

        {/* Pop-up bubble */}
        <AnimatePresence mode="wait">
          <motion.div
            key={revealStep}
            initial={{ opacity: 0, scale: 0.8, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: -30 }}
            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
            className={`border-2 ${current.border} rounded-2xl p-6 shadow-lg bg-white`}
          >
            <div className="flex flex-col items-center text-center space-y-4">
              <div className={`inline-flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-br ${current.bg} shadow-md`}>
                {current.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-900">{current.title}</h3>
              {current.content}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Progress dots */}
        <div className="flex items-center justify-center gap-2">
          {bubbles.map((_, i) => (
            <div
              key={i}
              className={`w-2.5 h-2.5 rounded-full transition-all ${
                i === revealStep ? 'bg-purple-600 scale-125' : i < revealStep ? 'bg-purple-300' : 'bg-gray-300'
              }`}
            />
          ))}
        </div>

        <Button
          onClick={() => {
            if (isLast) {
              setStep('takeaway');
            } else {
              setRevealStep(revealStep + 1);
            }
          }}
          size="lg"
          className={`w-full ${isLast
            ? 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white'
            : 'bg-purple-600 hover:bg-purple-700 text-white'
          }`}
        >
          {isLast ? (
            <>The Takeaway <ArrowRight className="ml-2 h-5 w-5" /></>
          ) : (
            'Next'
          )}
        </Button>
      </motion.div>
    );
  };

  // ─── Takeaway: Image + prompt, then popup on continue ───────────
  const [showTakeawayPopup, setShowTakeawayPopup] = useState(false);

  const renderTakeaway = () => (
    <motion.div
      key="takeaway"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      {/* Image and prompt side by side */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="rounded-xl overflow-hidden border-2 border-gray-200 shadow-inner">
          <img
            src={WAVE_IMAGE}
            alt="AI-generated Japanese wave scene"
            className="w-full h-auto"
            style={{ aspectRatio: '4/3', objectFit: 'cover' }}
          />
        </div>
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 flex flex-col justify-center">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">The actual prompt:</p>
          <p className="text-sm text-gray-800 font-mono leading-relaxed">
            &ldquo;Create an image in the style of a <strong className="text-blue-700 bg-blue-50 px-1 rounded">Japanese ukiyo-e woodblock print</strong>.
            A massive curling wave dominates the foreground with white foam and spray at the crest.
            A small snow-capped mountain in the distant background.
            Small wooden boats with rowers caught in the waves.
            Deep indigo and Prussian blue ocean water. Pale sky with subtle clouds. No text.&rdquo;
          </p>
        </div>
      </div>

      <Button
        onClick={() => setShowTakeawayPopup(true)}
        size="lg"
        className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
      >
        Continue to Next Activity
        <ArrowRight className="ml-2 h-5 w-5" />
      </Button>

      {/* Takeaway popup */}
      <AnimatePresence>
        {showTakeawayPopup && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 text-center space-y-4"
            >
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 mx-auto">
                <Lightbulb className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">
                AI doesn&apos;t think for you — it responds to how well <em className="text-purple-700">you</em> think.
              </h3>
              <p className="text-base text-gray-700 leading-relaxed">
                Every class, every project, every random thing you learned that you thought you&apos;d never use — that&apos;s your edge. Education builds the vocabulary AI needs to hear. The sharper your thinking, the sharper the output.
              </p>
              <Button
                onClick={onComplete}
                size="lg"
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
              >
                Got It
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
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
            Reverse-engineer an AI prompt from its image.
          </p>
        </div>

        {/* Step progress */}
        {!isDevMode && (
          <div className="flex items-center justify-center gap-2">
            {(['intro', 'round1', 'feedback1', 'round2', 'reveal', 'takeaway'] as Step[]).map((s, i) => {
              const stepLabels: Record<Step, string> = {
                intro: 'Start',
                round1: 'Scene 1',
                feedback1: 'Results 1',
                round2: 'Scene 2',
                reveal: 'Reveal',
                takeaway: 'Takeaway',
              };
              const stepOrder: Step[] = ['intro', 'round1', 'feedback1', 'round2', 'reveal', 'takeaway'];
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
          {step === 'feedback1' && renderRound1Feedback()}
          {step === 'round2' && renderRound(2)}
          {step === 'reveal' && renderReveal()}
          {step === 'takeaway' && renderTakeaway()}
        </AnimatePresence>

        {isDevMode && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <h3 className="text-sm font-semibold text-red-800 mb-2">Developer Mode: Say What You See Shortcuts</h3>
            <div className="flex flex-wrap gap-2">
              <Button
                onClick={handleDevAutoComplete}
                className="bg-green-600 hover:bg-green-700 text-white text-xs px-3 py-1 h-auto"
                size="sm"
              >
                <Sparkles className="w-3 h-3 mr-1" />
                Auto-Fill & Complete
              </Button>
              <Button
                onClick={onComplete}
                className="bg-purple-600 hover:bg-purple-700 text-white text-xs px-3 py-1 h-auto"
                size="sm"
              >
                <ArrowRight className="w-3 h-3 mr-1" />
                Skip Activity
              </Button>
            </div>
            <p className="text-xs text-red-600 mt-1">Auto-Fill shows results; Skip moves to next segment</p>
          </div>
        )}
      </div>
    </Card>
  );
};

export default SayWhatYouSeeActivity;
