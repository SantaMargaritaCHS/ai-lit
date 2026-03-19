import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { ArrowRight, Zap, CheckCircle, AlertCircle, Sparkles, Loader, PenTool, User, Bot, X } from 'lucide-react';
import { useDevMode } from '@/context/DevModeContext';
import { isNonsensical } from '@/utils/aiEducationFeedback';

interface PromptEnhancerExitTicketProps {
  onComplete: () => void;
}

// ── The vague prompt students must enhance ──

const VAGUE_PROMPT = "Help me study for my science test.";

const ELEMENTS = [
  { id: 'role', label: 'Role', description: 'Gave the AI a specific identity or expertise', color: 'bg-blue-100 text-blue-800 border-blue-300' },
  { id: 'task', label: 'Task', description: 'Clear, specific action with detail', color: 'bg-green-100 text-green-800 border-green-300' },
  { id: 'format', label: 'Format', description: 'Specified how the output should look', color: 'bg-purple-100 text-purple-800 border-purple-300' },
  { id: 'context', label: 'Context', description: 'Added background info about their situation', color: 'bg-orange-100 text-orange-800 border-orange-300' },
  { id: 'few-shot', label: 'Few-Shot', description: 'Included examples to show the AI the pattern', color: 'bg-amber-100 text-amber-800 border-amber-300' },
  { id: 'cot', label: 'Chain-of-Thought', description: 'Asked AI to think step by step or show reasoning', color: 'bg-teal-100 text-teal-800 border-teal-300' },
];

const PASSING_ELEMENTS = Math.ceil(ELEMENTS.length * 0.6); // 4 out of 6
const MIN_LENGTH = 100;
const MAX_ATTEMPTS = 2;

// ── Gemini prompt for analysis ──

function buildAnalysisPrompt(studentPrompt: string): string {
  return `You are evaluating a high school student's enhanced AI prompt. They started with a vague prompt: "${VAGUE_PROMPT}" and rewrote it to be better.

Here is their enhanced prompt:
---
${studentPrompt}
---

Analyze their prompt for these 6 elements. For each, respond YES or NO, followed by a brief reason:

1. ROLE: Did they assign the AI a specific role or expertise? (e.g., "Act as a biology tutor")
2. TASK: Did they include a clear, specific action beyond just "help me study"? (e.g., "Create practice questions on chapter 5")
3. FORMAT: Did they specify how the output should look? (e.g., "as a table", "in bullet points", "as flashcards")
4. CONTEXT: Did they include background info about their situation? (e.g., grade level, subject, when the test is, what they struggle with)
5. FEW-SHOT: Did they include examples to show the AI what kind of output they want?
6. COT: Did they ask the AI to think step by step, show reasoning, or break things down?

Then write 2-3 sentences of encouraging, specific feedback for the student. If they missed elements, suggest one concrete way to improve.

Format your response EXACTLY like this:
ROLE: YES/NO - [reason]
TASK: YES/NO - [reason]
FORMAT: YES/NO - [reason]
CONTEXT: YES/NO - [reason]
FEW-SHOT: YES/NO - [reason]
COT: YES/NO - [reason]
FEEDBACK: [your feedback]`;
}

interface AnalysisResult {
  elements: { id: string; found: boolean; reason: string }[];
  feedback: string;
  score: number;
}

function parseAnalysis(response: string): AnalysisResult {
  const elementIds = ['role', 'task', 'format', 'context', 'few-shot', 'cot'];
  const labels = ['ROLE', 'TASK', 'FORMAT', 'CONTEXT', 'FEW-SHOT', 'COT'];
  const elements: { id: string; found: boolean; reason: string }[] = [];

  for (let i = 0; i < labels.length; i++) {
    const regex = new RegExp(`${labels[i]}:\\s*(YES|NO)\\s*[-–—]\\s*(.+?)(?=\\n|$)`, 'i');
    const match = response.match(regex);
    elements.push({
      id: elementIds[i],
      found: match ? match[1].toUpperCase() === 'YES' : false,
      reason: match ? match[2].trim() : 'Could not analyze this element.',
    });
  }

  const feedbackMatch = response.match(/FEEDBACK:\s*([\s\S]+)/i);
  const feedback = feedbackMatch ? feedbackMatch[1].trim() : 'Good effort! Keep practicing with the RTFC framework and advanced techniques.';

  const score = elements.filter(e => e.found).length;

  return { elements, feedback, score };
}

// ── Component ──

const PromptEnhancerExitTicket: React.FC<PromptEnhancerExitTicketProps> = ({ onComplete }) => {
  const { isDevModeActive } = useDevMode();
  const [enhanced, setEnhanced] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [attemptCount, setAttemptCount] = useState(0);
  const [showEscapeHatch, setShowEscapeHatch] = useState(false);

  const passed = result !== null && result.score >= PASSING_ELEMENTS;
  const needsRetry = result !== null && !passed;

  const trackFailedAttempt = () => {
    const newCount = attemptCount + 1;
    setAttemptCount(newCount);
    if (newCount >= MAX_ATTEMPTS) setShowEscapeHatch(true);
  };

  const handleSubmit = async () => {
    if (enhanced.trim().length < MIN_LENGTH) return;

    // Pre-filter
    if (isNonsensical(enhanced.trim())) {
      setResult({
        elements: ELEMENTS.map(e => ({ id: e.id, found: false, reason: 'Response was not a valid prompt.' })),
        feedback: 'Your response needs to be an actual enhanced prompt. Take the vague prompt and rewrite it using the techniques you learned — add a Role, Task, Format, Context, and maybe some examples or chain-of-thought.',
        score: 0,
      });
      trackFailedAttempt();
      return;
    }

    setIsAnalyzing(true);
    let analysisResult: AnalysisResult;
    try {
      const { generateWithGemini } = await import('@/services/geminiClient');
      const text = await generateWithGemini(buildAnalysisPrompt(enhanced), {
        temperature: 0.3,
        maxOutputTokens: 1000,
      });

      if (text) {
        analysisResult = parseAnalysis(text);
      } else {
        analysisResult = fallbackAnalysis(enhanced);
      }
    } catch {
      analysisResult = fallbackAnalysis(enhanced);
    } finally {
      setIsAnalyzing(false);
    }

    setResult(analysisResult!);
    if (analysisResult!.score < PASSING_ELEMENTS) {
      trackFailedAttempt();
    }
  };

  const handleTryAgain = () => {
    // Keep the text so they can edit, not start over
    setResult(null);
    // Don't reset attemptCount or showEscapeHatch
  };

  const handleContinueAnyway = () => {
    onComplete();
  };

  // ── Dev mode shortcuts ──
  const DEV_GOOD = `Act as an experienced AP Biology teacher who specializes in helping students prepare for exams.

Create a set of 15 practice questions covering Chapter 7: Cell Energy (photosynthesis and cellular respiration). Focus on the differences between the two processes, where each occurs in the cell, and the inputs/outputs of each.

Here's the style I want for the questions:
"What is the primary function of the mitochondria?" → "To produce ATP through cellular respiration"
"Where does the light-dependent reaction occur?" → "In the thylakoid membrane of the chloroplast"

Format the questions as a two-column table with the question on the left and the answer hidden in a spoiler format on the right. Include a difficulty rating (easy/medium/hard) for each question.

Context: I'm a 10th grader in AP Biology. The test is on Friday and covers cellular respiration and photosynthesis. I understand the basic concepts but get confused about the specific steps of glycolysis vs. the Calvin cycle.

For the harder questions, think through the reasoning step by step so I can understand the logic, not just memorize the answer.`;

  const DEV_GENERIC = "Help me study for my science test. I want to do well. Can you make some questions? I'm in high school.";

  const handleDevAutoFill = () => {
    setEnhanced(DEV_GOOD);
    setResult({
      elements: ELEMENTS.map(e => ({ id: e.id, found: true, reason: 'Identified in dev mode.' })),
      feedback: 'Excellent work! You\'ve incorporated all six prompting techniques into a single, powerful prompt.',
      score: 6,
    });
    setTimeout(() => onComplete(), 1000);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <PenTool className="w-6 h-6 text-blue-600" />
          Exit Ticket: Enhance This Prompt
        </CardTitle>
        <p className="text-gray-700 mt-2">
          Time to put everything together. Take this vague prompt and make it great.
        </p>
      </CardHeader>
      <CardContent className="space-y-5">

        {/* Dev mode bar */}
        {isDevModeActive && !result && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <h3 className="text-sm font-semibold text-red-800 mb-2">Developer Mode: Exit Ticket Shortcuts</h3>
            <div className="flex flex-wrap gap-2">
              <Button onClick={handleDevAutoFill} className="bg-green-600 hover:bg-green-700 text-white text-xs px-3 py-1 h-auto" size="sm">
                <Zap className="w-3 h-3 mr-1" /> Auto-Fill & Complete
              </Button>
              <Button onClick={() => setEnhanced(DEV_GOOD)} className="bg-blue-600 hover:bg-blue-700 text-white text-xs px-3 py-1 h-auto" size="sm">
                Fill Good Response
              </Button>
              <Button onClick={() => setEnhanced(DEV_GENERIC)} className="bg-orange-600 hover:bg-orange-700 text-white text-xs px-3 py-1 h-auto" size="sm">
                Fill Generic Response
              </Button>
              <Button onClick={() => setEnhanced("asdfkj laskdjf whatever blah blah")} className="bg-red-600 hover:bg-red-700 text-white text-xs px-3 py-1 h-auto" size="sm">
                Fill Gibberish
              </Button>
            </div>
          </div>
        )}

        {/* The vague prompt */}
        <div className="bg-white border border-gray-200 rounded-2xl p-4">
          <div className="flex justify-end">
            <div className="flex items-start gap-2 max-w-[85%]">
              <div className="bg-red-500 text-white rounded-2xl rounded-tr-sm px-4 py-3">
                <p className="text-xs font-bold uppercase tracking-wide text-red-200 mb-1">Vague Prompt</p>
                <p className="text-lg font-medium">{VAGUE_PROMPT}</p>
              </div>
              <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center shrink-0">
                <User className="w-4 h-4 text-red-500" />
              </div>
            </div>
          </div>
        </div>

        {/* What to include */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
          <p className="font-semibold text-blue-900 text-sm mb-2">Rewrite this prompt using what you learned. Try to include:</p>
          <div className="flex flex-wrap gap-2">
            {ELEMENTS.map(el => (
              <span key={el.id} className={`text-xs font-bold px-2 py-1 rounded border ${el.color}`}>
                {el.label}
              </span>
            ))}
          </div>
          <p className="text-blue-700 text-xs mt-2">You need at least {PASSING_ELEMENTS} out of {ELEMENTS.length} to pass.</p>
        </div>

        {/* Text input */}
        <div>
          <Textarea
            value={enhanced}
            onChange={(e) => setEnhanced(e.target.value)}
            disabled={result !== null && !needsRetry}
            placeholder="Rewrite the prompt here. Add a role, be specific about the task, specify a format, add your context, include examples if helpful, and ask for step-by-step reasoning if it makes sense..."
            rows={8}
            className="w-full text-gray-900 disabled:opacity-60"
          />
          <p className="text-xs text-gray-600 mt-1">
            {enhanced.length} / {MIN_LENGTH} characters minimum
          </p>
        </div>

        {/* Loading */}
        {isAnalyzing && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center justify-center gap-3 text-blue-700 bg-blue-50 rounded-lg p-4 border border-blue-200">
            <Loader className="w-5 h-5 animate-spin" />
            <span>Analyzing your enhanced prompt...</span>
          </motion.div>
        )}

        {/* Results */}
        {result && !isAnalyzing && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
            {/* Score */}
            <div className={`rounded-xl p-4 text-center ${passed ? 'bg-green-50 border-2 border-green-300' : 'bg-amber-50 border-2 border-amber-300'}`}>
              <p className={`text-3xl font-extrabold ${passed ? 'text-green-700' : 'text-amber-700'}`}>
                {result.score} / {ELEMENTS.length}
              </p>
              <p className={`text-sm font-medium ${passed ? 'text-green-800' : 'text-amber-800'}`}>
                {passed ? 'You passed! Great use of prompting techniques.' : `You need at least ${PASSING_ELEMENTS} elements. Keep going!`}
              </p>
            </div>

            {/* Element checklist */}
            <div className="space-y-2">
              {result.elements.map((el) => {
                const meta = ELEMENTS.find(e => e.id === el.id)!;
                return (
                  <div key={el.id} className={`rounded-lg border-2 p-3 flex items-start gap-3 ${el.found ? 'bg-green-50 border-green-300' : 'bg-red-50 border-red-200'}`}>
                    <div className="mt-0.5">
                      {el.found ? (
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      ) : (
                        <X className="w-5 h-5 text-red-400" />
                      )}
                    </div>
                    <div className="flex-1">
                      <span className={`text-sm font-bold ${el.found ? 'text-green-800' : 'text-red-800'}`}>{meta.label}</span>
                      <p className={`text-xs mt-0.5 ${el.found ? 'text-green-700' : 'text-red-600'}`}>{el.reason}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* AI Feedback */}
            <div className={`border-2 rounded-lg p-4 ${passed ? 'bg-green-50 border-green-400' : 'bg-yellow-50 border-yellow-400'}`}>
              <div className="flex items-start gap-3">
                {passed ? (
                  <Sparkles className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-yellow-600 shrink-0 mt-0.5" />
                )}
                <p className="text-sm text-gray-900">{result.feedback}</p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Escape Hatch */}
        {showEscapeHatch && needsRetry && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-red-50 border-2 border-red-400 rounded-lg p-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-6 h-6 text-red-600 shrink-0 mt-1" />
              <div className="w-full">
                <h3 className="text-lg font-bold text-gray-900 mb-2">Multiple Attempts Detected</h3>
                <p className="text-gray-900 mb-3">
                  You've tried {attemptCount} times. You can try again or continue to get your certificate.
                </p>
                <div className="bg-yellow-100 border border-yellow-400 rounded-lg p-3 mb-4">
                  <p className="text-gray-900 text-sm">
                    <strong className="text-yellow-700">Note:</strong> If you continue, your response will be flagged for instructor review.
                  </p>
                </div>
                <div className="flex gap-3">
                  <Button onClick={handleTryAgain} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white">
                    Try One More Time
                  </Button>
                  <Button onClick={handleContinueAnyway} className="flex-1 bg-gray-600 hover:bg-gray-700 text-white">
                    Continue Anyway
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Submit / Continue Button */}
        {!(showEscapeHatch && needsRetry) && (
          <Button
            onClick={() => {
              if (passed) {
                onComplete();
              } else if (needsRetry) {
                handleTryAgain();
              } else {
                handleSubmit();
              }
            }}
            disabled={!result && (enhanced.length < MIN_LENGTH || isAnalyzing)}
            size="lg"
            className={`w-full ${
              passed
                ? 'bg-green-600 hover:bg-green-700 text-white'
                : needsRetry
                ? 'bg-orange-600 hover:bg-orange-700 text-white'
                : enhanced.length >= MIN_LENGTH && !isAnalyzing
                ? 'bg-blue-600 hover:bg-blue-700 text-white'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            {passed ? (
              <>Get Your Certificate <ArrowRight className="ml-2 w-5 h-5" /></>
            ) : needsRetry ? (
              'Edit & Resubmit'
            ) : (
              'Submit My Enhanced Prompt'
            )}
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

// ── Fallback analysis when Gemini is unavailable ──

function fallbackAnalysis(text: string): AnalysisResult {
  const lower = text.toLowerCase();
  const elements = [
    {
      id: 'role',
      found: /act as|you are|pretend|role|expert|tutor|teacher|coach|specialist/.test(lower),
      reason: /act as|you are|pretend|role|expert|tutor|teacher|coach|specialist/.test(lower)
        ? 'Found a role assignment.' : 'No role detected — try "Act as a..."',
    },
    {
      id: 'task',
      found: /create|explain|summarize|compare|list|write|generate|analyze|make|quiz|questions|practice/.test(lower) && text.length > 150,
      reason: text.length > 150 ? 'Found a specific task.' : 'Task could be more specific.',
    },
    {
      id: 'format',
      found: /table|bullet|list|flashcard|step.by.step format|numbered|paragraph|outline|checkboxe?s|column/.test(lower),
      reason: /table|bullet|list|flashcard|numbered|paragraph|outline/.test(lower)
        ? 'Found a format specification.' : 'No format specified — try "as a table" or "in bullet points".',
    },
    {
      id: 'context',
      found: /grade|class|ap |test|exam|chapter|due|struggle|topic|subject|friday|tomorrow|week/.test(lower),
      reason: /grade|class|ap |test|exam|chapter/.test(lower)
        ? 'Found context about your situation.' : 'Add context like your grade level or what the test covers.',
    },
    {
      id: 'few-shot',
      found: /example|→|like this|here'?s? (a |an |what|how)|for instance|such as.*:/.test(lower) && /[""]/.test(text),
      reason: /example|→|like this/.test(lower)
        ? 'Found examples in the prompt.' : 'No examples detected — try showing the AI what you want.',
    },
    {
      id: 'cot',
      found: /step.by.step|think.through|walk.me.through|break.*(down|it)|reasoning|thought.process|explain.*(how|why|your)/.test(lower),
      reason: /step.by.step|think.through|reasoning/.test(lower)
        ? 'Found chain-of-thought request.' : 'No chain-of-thought detected — try "think step by step".',
    },
  ];

  const score = elements.filter(e => e.found).length;
  const feedback = score >= PASSING_ELEMENTS
    ? `Great job! You included ${score} out of ${ELEMENTS.length} prompting techniques. Your enhanced prompt is much more powerful than the original.`
    : `You included ${score} out of ${ELEMENTS.length} techniques. Try adding ${ELEMENTS.filter((_, i) => !elements[i].found).map(e => e.label).slice(0, 2).join(' and ')} to strengthen your prompt.`;

  return { elements, feedback, score };
}

export default PromptEnhancerExitTicket;
