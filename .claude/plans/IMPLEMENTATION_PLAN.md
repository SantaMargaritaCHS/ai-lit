# Introduction to Prompting Module — Full Overhaul Implementation Plan

## New Video: `The_Explainer__How_to_Actually_Use_AI.mp4`
- **Duration:** 464.6s (7:44)
- **Firebase Path:** `Videos/Student Videos/Introduction to Prompting/The_Explainer__How_to_Actually_Use_AI.mp4`
- **Code constant:** Change `VIDEO_URL` in `IntroductionToPromptingModule.tsx`

```typescript
// OLD
const VIDEO_URL = 'Videos/Student Videos/Introduction to Prompting/How_Prompting_Actually_Works.mp4';

// NEW
const VIDEO_URL = 'Videos/Student Videos/Introduction to Prompting/The_Explainer__How_to_Actually_Use_AI.mp4';
```

---

## Video Clip Mapping (7 clips from 1 video)

The old video had 4 clips. The new video has **7 clips** because we're interweaving each RTFC step with its own video segment + activity.

| Clip # | Title | Start (s) | End (s) | Duration | Purpose |
|--------|-------|-----------|---------|----------|---------|
| 1 | The Prediction Machine | 0.00 | 104.34 | ~104s | Hook + LLMs as prediction machines + why vague prompts fail |
| 2 | The Funnel | 104.82 | 170.54 | ~66s | Funnel metaphor + introduces the 4 building blocks by name |
| 3 | Role: The First Layer | 171.10 | 204.84 | ~34s | Vague prompt → adding Role (AP History teacher) |
| 4 | Task & Format: Getting Tighter | 205.42 | 224.70 | ~19s | Adding Task (10 review questions) + Format (with answers) |
| 5 | Context: The Final Layer | 225.42 | 244.32 | ~19s | Adding Context (WWI causes, alliance system) |
| 6 | Advanced Tricks | 244.96 | 330.00 | ~85s | Iterative prompting + few-shot + chain-of-thought |
| 7 | The Golden Rules | 330.68 | 461.32 | ~131s | AI literacy language + hallucinations + creativity warning + "you are the thinker" |

### Clean Cut Verification (word-level)
- **104.34** — ends on "...what you actually want." Next word at 104.82.
- **170.54** — ends on "...something great." Next word at 171.10.
- **204.84** — ends on "It's an immediate upgrade." Next word at 205.42.
- **224.70** — ends on "We're in control." Next word at 225.42.
- **244.32** — ends on "...four simple layers." Next word at 244.96.
- **330.00** — ends on "...jumping to the wrong answer." Next word at 330.68.
- **461.32** — ends on "So use it wisely." (video end)

---

## New Module Structure (25 Segments)

Old: 21 segments. New: **25 segments** (4 added, 2 removed, net +4).

| # | Segment Title | Type | Component | Change |
|---|--------------|------|-----------|--------|
| 0 | Welcome | intro | Inline | **UPDATE** language |
| 1 | Say What You See | interactive | `SayWhatYouSeeActivity.tsx` | No change |
| 2 | Video: The Prediction Machine | video | Clip 1 (0.00–104.34) | **NEW timestamps, new video** |
| 3 | What Is a Prompt? | transition | Inline | **UPDATE** examples to match video |
| 4 | Rate the Prompts | interactive | `PromptRaterActivity.tsx` | No change |
| 5 | Prompting Principles | interactive | Inline (card flip) | No change |
| 6 | Video: The Funnel | video | Clip 2 (104.82–170.54) | **NEW clip, renamed** |
| 7 | The Funnel in Action | interactive | **`DynamicFunnelVisualization.tsx`** (NEW) | **REPLACE** old PromptFunnelVisualization |
| 8 | Video: Role — The First Layer | video | Clip 3 (171.10–204.84) | **NEW clip** |
| 9 | Role: Your AI Expert | interactive | Inline (matching game) | No change |
| 10 | Video: Task & Format | video | Clip 4 (205.42–224.70) | **NEW clip** |
| 11 | Task: What You Want | interactive | Inline (fix-the-vague-task) | No change |
| 12 | Format: How You Want It | interactive | `FormatActivity.tsx` | No change |
| 13 | Video: Context — The Final Layer | video | Clip 5 (225.42–244.32) | **NEW clip** |
| 14 | Context: Background Info | interactive | Inline (comparison) | No change |
| 15 | Build Your RTFC Prompt | interactive | `RTFOutputBuilder.tsx` | No change |
| 16 | Video: Advanced Tricks | video | Clip 6 (244.96–330.00) | **NEW clip, renamed** |
| 17 | **Steer the Conversation** | interactive | **`SteerTheConversationActivity.tsx`** (NEW) | **NEW activity** |
| 18 | Think Out Loud | interactive | `ThinkOutLoudActivity.tsx` | No change |
| 19 | Teach By Example | interactive | `TeachByExampleActivity.tsx` | No change |
| 20 | Can AI Admit It? | interactive | `CanAIAdmitItActivity.tsx` | No change |
| 21 | **Say It Right** | interactive | **`SayItRightActivity.tsx`** (NEW) | **NEW activity** |
| 22 | Prompt Layer Cake | interactive | `PromptLayerCakeActivity.tsx` | No change |
| 23 | Video: The Golden Rules | video | Clip 7 (330.68–461.32) | **NEW clip, renamed** |
| 24 | Exit Ticket | exit-ticket | Inline | **UPDATE** prompt to include uniqueness |
| 25 | Certificate | certificate | `<Certificate />` | No change |

### What Changed:
- **Old Segment 6** "Video: The Funnel of Control" → split into Clip 2 (funnel intro) + Clip 3/4/5 (one per RTFC element)
- **Old Segments 8-11** (R, T, F, C activities) now each get a video intro clip right before them
- **Old Segment 7** (PromptFunnelVisualization) → replaced with DynamicFunnelVisualization (3D/immersive)
- **New Segment 17** "Steer the Conversation" — iterative prompting activity
- **New Segment 21** "Say It Right" — AI literacy precise language activity
- **Segment numbering shifted** — everything after the new clips renumbers

---

## TASK 1: Upload New Video to Firebase

**Manual step** — Upload `The_Explainer__How_to_Actually_Use_AI.mp4` to:
```
gs://ai-literacy-platform-175d4.firebasestorage.app/Videos/Student Videos/Introduction to Prompting/The_Explainer__How_to_Actually_Use_AI.mp4
```

---

## TASK 2: Update VIDEO_URL Constant

**File:** `client/src/components/modules/IntroductionToPromptingModule.tsx`
**Line ~33**

```typescript
// OLD
const VIDEO_URL = 'Videos/Student Videos/Introduction to Prompting/How_Prompting_Actually_Works.mp4';

// NEW
const VIDEO_URL = 'Videos/Student Videos/Introduction to Prompting/The_Explainer__How_to_Actually_Use_AI.mp4';
```

---

## TASK 3: Update Segments Array

**File:** `IntroductionToPromptingModule.tsx` (~line 77-99)

Replace the `segments` array with:

```typescript
const segments = [
  { id: 0, title: 'Welcome', type: 'intro' as const },
  { id: 1, title: 'Say What You See', type: 'interactive' as const },
  { id: 2, title: 'Video: The Prediction Machine', type: 'video' as const },
  { id: 3, title: 'What Is a Prompt?', type: 'transition' as const },
  { id: 4, title: 'Rate the Prompts', type: 'interactive' as const },
  { id: 5, title: 'Prompting Principles', type: 'interactive' as const },
  { id: 6, title: 'Video: The Funnel', type: 'video' as const },
  { id: 7, title: 'The Funnel in Action', type: 'interactive' as const },
  { id: 8, title: 'Video: Role — The First Layer', type: 'video' as const },
  { id: 9, title: 'Role: Your AI Expert', type: 'interactive' as const },
  { id: 10, title: 'Video: Task & Format', type: 'video' as const },
  { id: 11, title: 'Task: What You Want', type: 'interactive' as const },
  { id: 12, title: 'Format: How You Want It', type: 'interactive' as const },
  { id: 13, title: 'Video: Context — The Final Layer', type: 'video' as const },
  { id: 14, title: 'Context: Background Info', type: 'interactive' as const },
  { id: 15, title: 'Build Your RTFC Prompt', type: 'interactive' as const },
  { id: 16, title: 'Video: Advanced Tricks', type: 'video' as const },
  { id: 17, title: 'Steer the Conversation', type: 'interactive' as const },
  { id: 18, title: 'Think Out Loud', type: 'interactive' as const },
  { id: 19, title: 'Teach By Example', type: 'interactive' as const },
  { id: 20, title: 'Can AI Admit It?', type: 'interactive' as const },
  { id: 21, title: 'Say It Right', type: 'interactive' as const },
  { id: 22, title: 'Prompt Layer Cake', type: 'interactive' as const },
  { id: 23, title: 'Video: The Golden Rules', type: 'video' as const },
  { id: 24, title: 'Exit Ticket', type: 'exit-ticket' as const },
  { id: 25, title: 'Certificate', type: 'certificate' as const },
];
```

---

## TASK 4: Update renderVideoClip Calls

Replace all 4 existing `renderVideoClip` calls with 7 new ones in the `renderSegment()` switch:

```typescript
// ──── Segment 2: Video Clip 1 — The Prediction Machine (0.00–104.34) ────
case 2:
  return renderVideoClip(
    1,
    'The Prediction Machine',
    'Watch this short clip about how AI actually processes your words — it\'s not magic, it\'s prediction. This explains why being specific matters.',
    0,
    104,
    'text-blue-600'
  );

// ──── Segment 6: Video Clip 2 — The Funnel (104.82–170.54) ────
case 6:
  return renderVideoClip(
    2,
    'The Funnel',
    'See how prompting works like a funnel — every detail you add narrows the AI\'s output from infinite possibilities to exactly what you need.',
    105,
    171,
    'text-green-600'
  );

// ──── Segment 8: Video Clip 3 — Role: The First Layer (171.10–204.84) ────
case 8:
  return renderVideoClip(
    3,
    'Role — The First Layer',
    'Watch how adding just a Role transforms a useless prompt into something that sounds like it came from an expert.',
    171,
    205,
    'text-blue-600'
  );

// ──── Segment 10: Video Clip 4 — Task & Format (205.42–224.70) ────
case 10:
  return renderVideoClip(
    4,
    'Task & Format — Getting Tighter',
    'Now see how adding a specific Task and Format eliminates all the wrong options — the AI has no choice but to give you exactly what you asked for.',
    205,
    225,
    'text-green-600'
  );

// ──── Segment 13: Video Clip 5 — Context: The Final Layer (225.42–244.32) ────
case 13:
  return renderVideoClip(
    5,
    'Context — The Final Layer',
    'The last piece of the puzzle. Watch how Context makes the output hyper-targeted to exactly what you need.',
    225,
    244,
    'text-orange-600'
  );

// ──── Segment 16: Video Clip 6 — Advanced Tricks (244.96–330.00) ────
case 16:
  return renderVideoClip(
    6,
    'Advanced Tricks',
    'You\'ve mastered the four building blocks — now learn advanced techniques that give you even more precise control over AI output.',
    245,
    330,
    'text-purple-600'
  );

// ──── Segment 23: Video Clip 7 — The Golden Rules (330.68–461.32) ────
case 23:
  return renderVideoClip(
    7,
    'The Golden Rules',
    'The most important lesson: why you must always verify AI output, why precise language matters, and the golden rule — you are the thinker, AI is the tool.',
    331,
    462,
    'text-orange-600'
  );
```

---

## TASK 5: Update Segment 3 (What Is a Prompt?) Language

**File:** `IntroductionToPromptingModule.tsx` (around line 463)

Change the vague prompt example to match the video:

```typescript
// OLD
<p className="text-red-900 font-mono bg-red-100 rounded px-3 py-2">"Help me with my homework"</p>

// NEW — matches video at [86.04]: "help me study"
<p className="text-red-900 font-mono bg-red-100 rounded px-3 py-2">"Help me study"</p>
```

And update the explanation:
```typescript
// OLD
"The AI doesn't know what subject, what assignment, what grade level, or what kind of help you need."

// NEW — matches video language
"As the video explained, there are literally thousands of ways AI could complete that thought. It has no direction — you'll get a generic, unhelpful response."
```

Update the specific prompt example to match the video's history theme:
```typescript
// OLD
"I'm a 10th grader studying for my biology test on cell division. Create 10 flashcards..."

// NEW — matches video example
"You are an experienced AP History teacher. Create 10 review questions with answers on the causes of WWI, focusing on the alliance system."
```

---

## TASK 6: Create New Component — `DynamicFunnelVisualization.tsx`

**File:** `client/src/components/modules/IntroductionToPromptingModule/DynamicFunnelVisualization.tsx`
**Replaces:** `PromptFunnelVisualization.tsx` (keep old file, just stop importing it)

### Design Vision (for high schoolers — immersive, visual, fun)

**Concept:** A full-screen animated funnel with floating "possibility bubbles" that get filtered out at each RTFC step. Think particle system meets infographic.

**Visual Elements:**
1. **3D-perspective funnel** using CSS transforms + framer-motion (no Three.js needed — keeps bundle small)
2. **Floating word bubbles** — dozens of small pills showing random AI outputs ("poem about the moon", "recipe for eggs", "history essay", etc.)
3. **At each step**, bubbles that don't match get animated out (fade + fly away), and the funnel visually narrows
4. **Color-coded layers** — each RTFC element adds a glowing ring to the funnel
5. **Particle trail effect** — subtle dots flowing through the funnel from wide to narrow

**5 Steps (same data as old component, new visuals):**

```
Step 0: "Write something" → 20+ bubbles floating chaotically (infinite possibilities)
Step 1: +Role → bubbles filter to biology content only, funnel narrows 30%, blue ring appears
Step 2: +Task → bubbles filter to study guide content, funnel narrows 55%, green ring
Step 3: +Format → single structured output, funnel narrows 75%, purple ring
Step 4: +Context → perfect targeted output, funnel at 15% width, orange ring, "✨ Perfect Output" celebration
```

**Technical approach using framer-motion (already installed v11.18.2):**
- CSS `perspective` and `transform: rotateX()` for 3D funnel shape
- `AnimatePresence` for bubble enter/exit animations
- `useAnimation` for the funnel narrowing + ring additions
- Staggered `transition` delays for bubble-filtering effect
- `motion.div` with `layout` prop for smooth position transitions
- Optional: CSS `backdrop-filter: blur()` for glassmorphism on the funnel walls

**Interaction:** Same as old — click "Add Role", "Add Task", etc. buttons. But now each click triggers a satisfying visual cascade of bubbles being eliminated.

**Completion:** Same message, new visual — confetti-like particles + the final output glows.

### Component Skeleton:

```typescript
import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, Sparkles, Target } from 'lucide-react';

interface DynamicFunnelVisualizationProps {
  onComplete: () => void;
}

// Bubble data — each has a category that determines when it gets filtered
const ALL_BUBBLES = [
  { text: 'Poem about the moon', category: 'random' },
  { text: 'Recipe for scrambled eggs', category: 'random' },
  { text: 'Capital of France', category: 'random' },
  { text: 'Fairy tale about a dragon', category: 'random' },
  { text: 'World population stats', category: 'random' },
  { text: 'Periodic table facts', category: 'random' },
  { text: 'How to fix a bicycle', category: 'random' },
  { text: 'Song lyrics about summer', category: 'random' },
  { text: 'Cell division overview', category: 'biology' },
  { text: 'Photosynthesis explained', category: 'biology' },
  { text: 'Mitochondria function', category: 'biology' },
  { text: 'DNA replication steps', category: 'biology' },
  { text: 'Cell division study guide', category: 'study-guide' },
  { text: 'Cell division flashcards', category: 'study-guide' },
  { text: 'Structured outline with key terms', category: 'formatted' },
  { text: 'WWI causes study guide for 10th grade', category: 'perfect' },
];

const STEPS = [
  {
    label: 'No Prompt Context',
    prompt: '"Write something"',
    description: 'Without any guidance, the AI has infinite possibilities.',
    visibleCategories: ['random', 'biology', 'study-guide', 'formatted', 'perfect'],
    funnelWidth: 100,
    color: '#9CA3AF', // gray
    ringColor: null,
  },
  {
    label: '+ Role',
    prompt: '"Act as a biology tutor..."',
    description: 'Adding a Role filters out everything except educational biology content.',
    visibleCategories: ['biology', 'study-guide', 'formatted', 'perfect'],
    funnelWidth: 70,
    color: '#3B82F6', // blue
    ringColor: 'ring-blue-400',
  },
  {
    label: '+ Task',
    prompt: '"...create a study guide on cell division"',
    description: 'Now the AI is focused on one specific topic and deliverable.',
    visibleCategories: ['study-guide', 'formatted', 'perfect'],
    funnelWidth: 45,
    color: '#22C55E', // green
    ringColor: 'ring-green-400',
  },
  {
    label: '+ Format',
    prompt: '"...as an outline with key terms and 5 practice questions"',
    description: 'The Format locks in exactly how the output should look.',
    visibleCategories: ['formatted', 'perfect'],
    funnelWidth: 25,
    color: '#A855F7', // purple
    ringColor: 'ring-purple-400',
  },
  {
    label: '+ Context',
    prompt: '"...about the causes of WWI, for a 10th grade student"',
    description: 'Context makes the output hyper-targeted to exactly what you need.',
    visibleCategories: ['perfect'],
    funnelWidth: 15,
    color: '#F97316', // orange
    ringColor: 'ring-orange-400',
  },
];

const DynamicFunnelVisualization: React.FC<DynamicFunnelVisualizationProps> = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const step = STEPS[currentStep];

  const visibleBubbles = useMemo(() =>
    ALL_BUBBLES.filter(b => step.visibleCategories.includes(b.category)),
    [currentStep]
  );

  // ... render funnel with 3D perspective, floating bubbles, RTFC rings
  // ... each "Add X" button advances step, triggers bubble exit animations
  // ... completion state shows celebration + onComplete button
};

export default DynamicFunnelVisualization;
```

### Key CSS for 3D Funnel Effect:
```css
.funnel-container {
  perspective: 800px;
  transform-style: preserve-3d;
}

.funnel-shape {
  /* Trapezoid shape using clip-path */
  clip-path: polygon(
    calc(50% - var(--top-width)) 0%,
    calc(50% + var(--top-width)) 0%,
    calc(50% + var(--bottom-width)) 100%,
    calc(50% - var(--bottom-width)) 100%
  );
  transform: rotateX(10deg);
  background: linear-gradient(180deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%);
  backdrop-filter: blur(8px);
  border: 2px solid rgba(255,255,255,0.2);
}

.bubble {
  /* Glassmorphic pill */
  backdrop-filter: blur(4px);
  background: rgba(255, 255, 255, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 999px;
  padding: 6px 14px;
  font-size: 0.75rem;
  white-space: nowrap;
}
```

### Bubble Animation Patterns:
```typescript
// Bubble entering
const bubbleEnter = {
  initial: { opacity: 0, scale: 0, y: -20 },
  animate: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 200, damping: 15 }
  },
};

// Bubble being filtered out (dramatic exit)
const bubbleExit = {
  exit: {
    opacity: 0,
    scale: 0.3,
    x: Math.random() > 0.5 ? 200 : -200, // fly left or right
    y: -50,
    rotate: Math.random() * 90 - 45,
    transition: { duration: 0.5, ease: 'easeIn' }
  },
};

// Funnel narrowing
const funnelNarrow = {
  animate: {
    '--top-width': `${step.funnelWidth / 2}%`,
    '--bottom-width': `${step.funnelWidth / 4}%`,
  },
  transition: { type: 'spring', stiffness: 80, damping: 20 }
};
```

---

## TASK 7: Create New Component — `SteerTheConversationActivity.tsx`

**File:** `client/src/components/modules/IntroductionToPromptingModule/SteerTheConversationActivity.tsx`

### Design

**Concept:** Students experience iterative prompting in a simulated chat interface. They start with an RTFC prompt, get an "okay but not perfect" AI response, then write refinement follow-ups to improve it.

**Visual:** Chat bubble UI (like iMessage/WhatsApp) — familiar to high schoolers.

**Flow:**

```
Step 1: "Here's your starting prompt" (pre-filled RTFC prompt shown in chat)
        → AI responds with decent but imperfect output

Step 2: Student sees 3 suggested refinements (clickable chips) OR writes their own:
        - "Make question 3 more analytical"
        - "Add a question about the Treaty of Versailles"
        - "Use simpler vocabulary for the definitions"
        → After selecting/typing, AI response updates and improves

Step 3: One more refinement round:
        - "Convert the key terms into a matching exercise"
        - "Add a 'why this matters' section at the end"
        - "Make it shorter — just the 5 most important questions"
        → Final polished output

Step 4: Summary — "See how 3 messages turned an okay response into exactly what you needed?
        That's iterative prompting. The video said it: 'The real skill is treating this like a conversation.'"
```

**Props:**
```typescript
interface SteerTheConversationActivityProps {
  onComplete: () => void;
  isDevMode?: boolean;
}
```

**Scenario (matches video's history example):**
- Starting prompt: "You are an AP History teacher. Create 10 review questions with answers on the causes of WWI, focusing on the alliance system."
- Initial AI response: Good but generic questions, some too simple
- After refinement 1: Questions become more analytical, Treaty of Versailles added
- After refinement 2: Key terms section added, vocabulary simplified, final polished study guide

**Key quote from video to display:**
> "You send your first prompt, you see what you get back, and then you refine it, you steer it." — The Explainer (4:22)

---

## TASK 8: Create New Component — `SayItRightActivity.tsx`

**File:** `client/src/components/modules/IntroductionToPromptingModule/SayItRightActivity.tsx`

### Design

**Concept:** Students fix anthropomorphized AI statements by rewriting them with precise language. Directly teaches the video's lesson about AI literacy.

**Mechanic:** Show 5 statements about AI. Each has an anthropomorphized version (red) and students must select or construct the precise version (green).

**Format:** Could be drag-and-drop matching, multiple choice, or fill-in-the-blank.

**Recommended: Multiple choice (3 options per statement) — fast, clear, engaging.**

**5 Statements:**

| # | Anthropomorphized (Wrong) | Correct | Distractor |
|---|--------------------------|---------|------------|
| 1 | "ChatGPT **knows** the answer to your question" | "ChatGPT **generates a response based on patterns in its training data**" | "ChatGPT **searches the internet** for your answer" |
| 2 | "The AI **understood** my essay and gave feedback" | "The AI **processed the text and predicted** relevant feedback" | "The AI **read and comprehended** my essay like a teacher" |
| 3 | "AI **thinks** step-by-step when solving math" | "AI **generates intermediate tokens** that simulate step-by-step reasoning" | "AI **carefully considers** each step before answering" |
| 4 | "The model **learned** not to be offensive" | "The model was **fine-tuned with human feedback** to avoid harmful outputs" | "The model **decided** to stop being offensive" |
| 5 | "AI **wants** to give you the best answer" | "AI **is optimized** to produce the most statistically likely helpful response" | "AI **tries its best** to satisfy your request" |

**Completion message:**
> "Using precise language about AI isn't just being picky — it keeps you from trusting a statistical tool like it's a thinking being. As the video said: 'We're using a statistical tool, not a conscious being.'"

**Props:**
```typescript
interface SayItRightActivityProps {
  onComplete: () => void;
  isDevMode?: boolean;
}
```

---

## TASK 9: Update Segment 0 (Welcome) Language

Minor updates to align with the new video's tone:

**Old opening analogy:** Restaurant ordering metaphor
**Keep it** — it's a great hook and the video doesn't contradict it.

**Update learning objectives to match new content:**

```typescript
// OLD objectives:
// 1. What a prompt is and why it matters
// 2. Key principles for writing effective prompts
// 3. The RTFC Framework: Role, Task, Format, Context
// 4. How to build prompts that get you exactly what you need

// NEW objectives (adds iterative prompting + AI literacy):
const LEARNING_OBJECTIVES = [
  'What a prompt is and why it matters',
  'The four building blocks: Role, Task, Format, Context',
  'How to build and refine prompts through conversation',
  'Advanced techniques: few-shot prompting and chain-of-thought',
  'How to talk about AI precisely and verify its output',
];
```

---

## TASK 10: Update Exit Ticket (Segment 24)

**Old question:** Standard RTFC application.

**New question — adds uniqueness/voice element from video:**

```typescript
const EXIT_TICKET_QUESTION = "Think about a specific school assignment or project you have coming up. How could you use the RTFC framework to write a prompt that helps you with it? Include the Role, Task, Format, and Context you would use. Then explain: how would you make sure the AI's output reflects YOUR unique perspective and voice, not just generic AI writing? (Remember: you are the thinker, AI is the tool.)";
```

Update the DEV_RESPONSES.good to match the new question too.

---

## TASK 11: Update renderSegment() Switch Statement

The entire `renderSegment()` switch needs renumbering. Here's the mapping:

| Old Case # | New Case # | Content |
|-----------|-----------|---------|
| 0 | 0 | Welcome |
| 1 | 1 | Say What You See |
| 2 | 2 | Video Clip 1 (new timestamps) |
| 3 | 3 | What Is a Prompt? (updated language) |
| 4 | 4 | Rate the Prompts |
| 5 | 5 | Prompting Principles |
| 6 | 6 | Video Clip 2 (new clip — funnel only) |
| 7 | 7 | **DynamicFunnelVisualization** (replaces PromptFunnelVisualization) |
| — | 8 | **NEW:** Video Clip 3 (Role layer) |
| 8 | 9 | Role matching game |
| — | 10 | **NEW:** Video Clip 4 (Task & Format) |
| 9 | 11 | Fix the vague task |
| 10 | 12 | Format activity |
| — | 13 | **NEW:** Video Clip 5 (Context layer) |
| 11 | 14 | Context comparison |
| 12 | 15 | Build Your RTFC Prompt |
| 13 | 16 | Video Clip 6 (advanced tricks — new timestamps) |
| — | 17 | **NEW:** Steer the Conversation activity |
| 14 | 18 | Think Out Loud |
| 15 | 19 | Teach By Example |
| 16 | 20 | Can AI Admit It? |
| — | 21 | **NEW:** Say It Right activity |
| 17 | 22 | Prompt Layer Cake |
| 18 | 23 | Video Clip 7 (golden rules — new timestamps) |
| 19 | 24 | Exit Ticket (updated question) |
| 20 | 25 | Certificate |

---

## TASK 12: Update Imports

**File:** `IntroductionToPromptingModule.tsx` (top of file)

```typescript
// ADD these imports:
import DynamicFunnelVisualization from './IntroductionToPromptingModule/DynamicFunnelVisualization';
import SteerTheConversationActivity from './IntroductionToPromptingModule/SteerTheConversationActivity';
import SayItRightActivity from './IntroductionToPromptingModule/SayItRightActivity';

// KEEP (but no longer used — can remove later):
// import PromptFunnelVisualization from './IntroductionToPromptingModule/PromptFunnelVisualization';
```

---

## TASK 13: Update Subtitles Data (if applicable)

Check if `client/src/data/promptingBasicsSubtitles.ts` and `rtfFrameworkSubtitles.ts` need updating for the new video. These may need new SRT data if subtitles are enabled.

---

## Execution Order

1. **Upload video** to Firebase (manual)
2. **Create 3 new components** (Tasks 6, 7, 8) — can be done in parallel
3. **Update main module** (Tasks 2, 3, 4, 5, 9, 10, 11, 12) — sequential
4. **Test all 26 segments** in dev mode
5. **Update subtitles** if needed (Task 13)
6. **Deploy and verify** on production URL

---

## Dependencies

- **framer-motion** v11.18.2 — already installed ✅
- **No new packages needed** — the 3D funnel uses CSS transforms + framer-motion
- **Optional enhancement:** If you want even more visual flair, could add `@tsparticles/react` for particle effects in the funnel (~15KB gzipped)

---

## Risk Notes

- **Progress persistence will reset** for any student mid-module (segment IDs changed). Consider bumping `moduleVersion` in the progress save.
- **Video file must be uploaded to Firebase before testing** — the code references a relative path.
- **PremiumVideoPlayer timestamps are in seconds (integers)** — the clips use rounded values. Fine-tune ±1s if needed after testing.
- **The DynamicFunnelVisualization is the most complex new component** — start with it and iterate on the visuals.
