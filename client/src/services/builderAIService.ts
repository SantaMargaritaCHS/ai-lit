import { GoogleGenerativeAI } from '@google/generative-ai';

/**
 * builderAIService - AI content generation for module builder
 *
 * Phase 2.1 of Module Builder
 *
 * Uses Gemini API to generate educational content from video transcripts:
 * - Quiz questions (multiple choice with hints)
 * - Reflection prompts (age-appropriate, critical thinking)
 * - Ethical scenarios (dilemmas, stakeholder perspectives)
 * - Activity content (based on video themes)
 *
 * **API Key**: GEMINI_API_KEY from Replit Secrets
 *
 * This service is CRITICAL for achieving 90% time reduction:
 * - Without AI: 60 hours to create module content
 * - With AI: ~6 hours (mostly review/refinement)
 */

// Initialize Gemini API (same pattern as geminiClient.ts)
const genAI = typeof window !== 'undefined' && import.meta.env.VITE_GEMINI_API_KEY
  ? new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY)
  : null;

// Gemini 2.5 Flash for content generation (fast, cost-effective)
const model = genAI?.getGenerativeModel({
  model: 'gemini-2.0-flash-exp',
  generationConfig: {
    temperature: 0.7, // Balanced creativity
    topP: 0.95,
    topK: 40,
    maxOutputTokens: 2048, // Enough for multiple questions/prompts
  },
});

/**
 * Transcript data structure (from Phase 1.2)
 */
export interface TranscriptData {
  fullText: string;
  segments?: {
    startTime: number;
    endTime: number;
    text: string;
  }[];
  videoUrl: string;
  videoTitle: string;
}

/**
 * Quiz question structure
 */
export interface QuizQuestion {
  question: string;
  options: string[]; // 4 options
  correctAnswer: number; // index of correct option (0-3)
  explanation: string; // Why this answer is correct
  hint: string; // Educational hint (doesn't reveal answer)
  topic: string; // Key concept being tested
}

/**
 * Reflection prompt structure
 */
export interface ReflectionPrompt {
  prompt: string;
  guidingQuestions?: string[];
  minResponseLength: number; // Minimum words expected
  topic: string;
}

/**
 * Ethical scenario structure
 */
export interface EthicalScenario {
  title: string;
  context: string; // 2-3 paragraph scenario
  dilemma: string; // The ethical question
  stakeholders: string[]; // Affected parties
  guidingQuestions: string[];
  relevantPrinciples: string[]; // Ethical frameworks to consider
}

/**
 * Generate quiz questions from video transcript
 */
export async function generateQuizQuestions(
  transcript: TranscriptData,
  options: {
    count?: number; // Number of questions to generate (default: 3)
    difficulty?: 'easy' | 'medium' | 'hard'; // Default: medium
    focusTopics?: string[]; // Optional specific topics to focus on
  } = {}
): Promise<QuizQuestion[]> {
  if (!model) {
    throw new Error('Gemini API not initialized. Check VITE_GEMINI_API_KEY in Replit Secrets.');
  }

  const { count = 3, difficulty = 'medium', focusTopics = [] } = options;

  const prompt = `You are an educational content creator for high school students (ages 14-18).

**Video Information:**
Title: ${transcript.videoTitle}
URL: ${transcript.videoUrl}

**Video Transcript:**
${transcript.fullText}

${focusTopics.length > 0 ? `**Focus Topics:** ${focusTopics.join(', ')}` : ''}

**Task:** Generate ${count} multiple-choice quiz questions (difficulty: ${difficulty}) based on the video content.

**Requirements:**
1. Test understanding of KEY CONCEPTS from the video
2. Use age-appropriate language (14-18 years old)
3. Each question has 4 options (A, B, C, D) - ONE correct, THREE plausible distractors
4. Provide an explanation of WHY the correct answer is right
5. Provide an educational HINT that guides without revealing the answer
6. Identify the KEY TOPIC/CONCEPT being tested
7. Avoid anthropomorphization of AI (e.g., don't say "AI thinks" or "AI believes")
8. Questions should encourage CRITICAL THINKING, not just memorization

**Difficulty Guidelines:**
- Easy: Recall key facts from video
- Medium: Understand concepts and relationships
- Hard: Apply concepts to new situations, analyze implications

**Output Format (JSON):**
Return ONLY a JSON array with this exact structure (no markdown, no code blocks):
[
  {
    "question": "What is the primary reason for...",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correctAnswer": 1,
    "explanation": "Option B is correct because...",
    "hint": "Think about the relationship between...",
    "topic": "Key Concept Being Tested"
  }
]

Generate ${count} high-quality questions now:`;

  try {
    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();

    // Parse JSON response
    // Handle potential markdown code blocks
    let jsonText = text.trim();
    if (jsonText.startsWith('```json')) {
      jsonText = jsonText.replace(/```json\n?/g, '').replace(/```\n?$/g, '');
    } else if (jsonText.startsWith('```')) {
      jsonText = jsonText.replace(/```\n?/g, '');
    }

    const questions: QuizQuestion[] = JSON.parse(jsonText);

    // Validate structure
    questions.forEach((q, idx) => {
      if (!q.question || !q.options || q.options.length !== 4 || typeof q.correctAnswer !== 'number') {
        throw new Error(`Invalid question structure at index ${idx}`);
      }
      if (q.correctAnswer < 0 || q.correctAnswer > 3) {
        throw new Error(`Invalid correctAnswer at index ${idx}: must be 0-3`);
      }
    });

    return questions;
  } catch (error: any) {
    console.error('Quiz generation error:', error);
    throw new Error(`Failed to generate quiz questions: ${error.message}`);
  }
}

/**
 * Generate reflection prompts from video transcript
 */
export async function generateReflectionPrompts(
  transcript: TranscriptData,
  options: {
    count?: number; // Number of prompts to generate (default: 2)
    type?: 'personal' | 'critical' | 'application' | 'mixed'; // Default: mixed
  } = {}
): Promise<ReflectionPrompt[]> {
  if (!model) {
    throw new Error('Gemini API not initialized. Check VITE_GEMINI_API_KEY in Replit Secrets.');
  }

  const { count = 2, type = 'mixed' } = options;

  const prompt = `You are an educational content creator for high school students (ages 14-18).

**Video Information:**
Title: ${transcript.videoTitle}

**Video Transcript:**
${transcript.fullText}

**Task:** Generate ${count} reflection prompts based on the video content.

**Prompt Types:**
- Personal: How does this relate to student's life/experiences?
- Critical: Analyze, evaluate, or question concepts from video
- Application: How would you apply these concepts?
- Mixed: Variety of the above

**Requirements:**
1. Age-appropriate language (14-18 years)
2. Encourage CRITICAL THINKING and METACOGNITION
3. Align with video themes and learning objectives
4. Avoid anthropomorphization (don't say "AI thinks", "AI feels", etc.)
5. Encourage thoughtful, detailed responses (100-150 words minimum)
6. Questions should be OPEN-ENDED (no simple yes/no answers)
7. Respect student AGENCY (they are users of AI, not subjects)

**Project Guidelines (IMPORTANT):**
- Never suggest AI can "understand" or "have experiences"
- Avoid positioning AI as a "partner" or "friend" (use "tool" instead)
- Don't imply AI has emotions, beliefs, or consciousness
- Focus on AI as a technology students can use skillfully

**Output Format (JSON):**
[
  {
    "prompt": "Reflect on how the concepts in this video apply to...",
    "guidingQuestions": ["What specific examples...", "How would you..."],
    "minResponseLength": 100,
    "topic": "Key Theme"
  }
]

Generate ${count} reflection prompts (type: ${type}):`;

  try {
    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();

    let jsonText = text.trim();
    if (jsonText.startsWith('```json')) {
      jsonText = jsonText.replace(/```json\n?/g, '').replace(/```\n?$/g, '');
    } else if (jsonText.startsWith('```')) {
      jsonText = jsonText.replace(/```\n?/g, '');
    }

    const prompts: ReflectionPrompt[] = JSON.parse(jsonText);

    // Validate structure
    prompts.forEach((p, idx) => {
      if (!p.prompt || typeof p.minResponseLength !== 'number') {
        throw new Error(`Invalid prompt structure at index ${idx}`);
      }
    });

    return prompts;
  } catch (error: any) {
    console.error('Reflection prompt generation error:', error);
    throw new Error(`Failed to generate reflection prompts: ${error.message}`);
  }
}

/**
 * Generate ethical scenarios from video transcript
 */
export async function generateEthicalScenarios(
  transcript: TranscriptData,
  options: {
    count?: number; // Number of scenarios to generate (default: 1)
    framework?: 'catholic-social-teaching' | 'general-ethics' | 'technology-ethics'; // Default: general
  } = {}
): Promise<EthicalScenario[]> {
  if (!model) {
    throw new Error('Gemini API not initialized. Check VITE_GEMINI_API_KEY in Replit Secrets.');
  }

  const { count = 1, framework = 'general-ethics' } = options;

  const frameworkGuidance = {
    'catholic-social-teaching': 'Incorporate Catholic Social Teaching principles: Human Dignity, Common Good, Solidarity, Subsidiarity',
    'general-ethics': 'Use general ethical frameworks: consequentialism, deontology, virtue ethics, justice, fairness',
    'technology-ethics': 'Focus on technology ethics: privacy, bias, accountability, transparency, access',
  };

  const prompt = `You are an educational content creator for high school students (ages 14-18).

**Video Information:**
Title: ${transcript.videoTitle}

**Video Transcript:**
${transcript.fullText}

**Task:** Generate ${count} ethical scenarios/dilemmas based on the video content.

**Ethical Framework:** ${frameworkGuidance[framework]}

**Requirements:**
1. Create realistic, relatable scenarios for high school students
2. Present genuine ethical DILEMMAS (no easy right answer)
3. Include multiple stakeholders with conflicting interests
4. Provide guiding questions to structure student analysis
5. Connect to themes from the video
6. Age-appropriate complexity (14-18 years)
7. Encourage consideration of multiple perspectives

**Output Format (JSON):**
[
  {
    "title": "Scenario Title",
    "context": "2-3 paragraphs setting up the scenario...",
    "dilemma": "The core ethical question students must grapple with",
    "stakeholders": ["Student", "Teacher", "Parent", "Company", etc.],
    "guidingQuestions": ["Question 1", "Question 2", "Question 3"],
    "relevantPrinciples": ["Human Dignity", "Privacy", "Fairness", etc.]
  }
]

Generate ${count} ethical scenario(s):`;

  try {
    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();

    let jsonText = text.trim();
    if (jsonText.startsWith('```json')) {
      jsonText = jsonText.replace(/```json\n?/g, '').replace(/```\n?$/g, '');
    } else if (jsonText.startsWith('```')) {
      jsonText = jsonText.replace(/```\n?/g, '');
    }

    const scenarios: EthicalScenario[] = JSON.parse(jsonText);

    // Validate structure
    scenarios.forEach((s, idx) => {
      if (!s.title || !s.context || !s.dilemma || !Array.isArray(s.stakeholders)) {
        throw new Error(`Invalid scenario structure at index ${idx}`);
      }
    });

    return scenarios;
  } catch (error: any) {
    console.error('Scenario generation error:', error);
    throw new Error(`Failed to generate ethical scenarios: ${error.message}`);
  }
}

/**
 * Test function to verify API connection
 */
export async function testGeminiConnection(): Promise<boolean> {
  if (!model) {
    return false;
  }

  try {
    const result = await model.generateContent('Say "API Connected" if you can read this.');
    const text = result.response.text();
    return text.toLowerCase().includes('api connected');
  } catch {
    return false;
  }
}
