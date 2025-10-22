import { generateWithGemini, isGeminiConfigured } from '@/services/geminiClient';

// Check if response is nonsensical or low quality
export const isNonsensical = (response: string): boolean => {
  const trimmed = response.trim();

  // Too short (less than 100 characters for meaningful reflection - roughly 2-3 sentences)
  if (trimmed.length < 100) return true;

  // Just random letters (like "asdf", "sdfgh", etc.)
  if (/^[a-zA-Z]{1,15}$/.test(trimmed)) return true;

  // Repeated characters (like "aaaaa" or "hhhhhh")
  if (/(\w)\1{3,}/.test(trimmed)) return true;

  // Only numbers or symbols
  if (/^[\d\W]+$/.test(trimmed)) return true;

  // Random keyboard mashing patterns (asdf, qwerty, etc.)
  if (/^[qwertyuiopasdfghjklzxcvbnm]{8,}$/i.test(trimmed)) return true;
  if (/asdf|sdfg|dfgh|qwer|wert|erty|zxcv|xcvb/i.test(trimmed)) return true;

  // No vowels (likely gibberish)
  if (trimmed.length > 5 && !/[aeiou]/i.test(trimmed)) return true;

  // Too few words (less than 15 words for substantive reflection)
  const words = trimmed.split(/\s+/).filter(w => w.length > 0);
  if (words.length < 15) return true;

  // Check for obvious complaints/negativity without substance
  const lowerText = trimmed.toLowerCase();
  const hasComplaintWords = (
    lowerText.includes("waste") ||
    lowerText.includes("stupid") ||
    lowerText.includes("boring") ||
    lowerText.includes("hate this") ||
    (lowerText.includes("don't") && lowerText.includes("enjoy")) ||
    (lowerText.includes("didn't") && lowerText.includes("enjoy"))
  );
  const hasAIContent = (
    lowerText.includes("llm") ||
    lowerText.includes("ai") ||
    lowerText.includes("token") ||
    lowerText.includes("predict") ||
    lowerText.includes("pattern") ||
    lowerText.includes("train") ||
    lowerText.includes("model")
  );

  // If it's a complaint without AI content, reject it
  if (hasComplaintWords && !hasAIContent) return true;

  return false;
};

export const generateEducationFeedback = async (
  response: string,
  question: string,
  retryCount = 0
): Promise<string> => {
  // Check for nonsensical input first
  if (isNonsensical(response)) {
    return "Your response needs more depth. Please write at least 2-3 complete sentences with specific thoughts about the question. Random text or very short answers won't be accepted.";
  }

  const educationPrompt = `You are an AI literacy educator evaluating student reflection responses.

**QUESTION:** "${question}"

**STUDENT RESPONSE:** "${response}"

**YOUR TASK:** Determine if this response genuinely addresses the question.

**STRICT REJECTION CRITERIA - Use phrase "does not address the question" if:**
1. Response is a complaint about the module (e.g., "waste of time", "boring", "stupid")
2. Response doesn't mention LLMs, AI, tokens, patterns, predictions, or related concepts
3. Response is generic fluff that could apply to any topic
4. Response is inappropriate, off-topic, or trolling

**APPROVAL CRITERIA - Give constructive feedback if:**
1. Response shows engagement with LLM concepts (prediction, patterns, training data, limitations)
2. Response demonstrates critical thinking about AI use
3. Response includes specific examples or personal connections

**OUTPUT FORMAT:**
- If rejecting: Start with "Your response does not address the question about how LLMs work. Please re-read the question and provide a thoughtful answer."
- If approving: Give brief (1-2 sentences, under 75 words), direct feedback. Acknowledge their insight and make ONE connection to the AI concept. No fake enthusiasm.

Evaluate now:`;

  try {
    // Use the new Gemini client (returns null if not configured)
    // CRITICAL: Gemini 2.5 uses internal "thinking" which counts against token limit
    const result = await generateWithGemini(educationPrompt, {
      temperature: 0.4, // More consistent responses (less dramatic variation)
      maxOutputTokens: 200 // Brief responses only (~50 tokens thinking + ~100 response + buffer)
    });

    // If Gemini returns null, it was either blocked by safety filters or not configured
    if (result === null) {
      console.warn('⚠️ Gemini returned null - may be blocked by safety filters or not configured');
      console.warn('  Possible reasons:');
      console.warn('  1. API key not configured in Replit Secrets (GEMINI_API_KEY)');
      console.warn('  2. Safety filters blocked the content');
      console.warn('  3. Rate limit exceeded');
      console.warn('  Check geminiClient.ts logs for more details');

      // Retry once if this is the first attempt
      if (retryCount < 1) {
        console.log('🔄 Retrying Gemini request once...');
        await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second
        return generateEducationFeedback(response, question, retryCount + 1);
      }

      // After retry, use contextual fallback
      console.log('ℹ️ Using contextual fallback after retry');
      return getContextualFallback(response, question);
    }

    // If Gemini returns a result, use it
    if (result) {
      console.log('✅ Using AI-generated feedback');
      return result;
    }

    // Fallback to contextual messages if something unexpected happened
    console.log('ℹ️ Using contextual fallback (unexpected case)');
    return getContextualFallback(response, question);

  } catch (error) {
    console.error('❌ Error generating feedback:', error);

    // Retry once on error
    if (retryCount < 1) {
      console.log('🔄 Retrying after error...');
      await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second
      return generateEducationFeedback(response, question, retryCount + 1);
    }

    console.log('ℹ️ Using contextual fallback after error and retry');
    return getContextualFallback(response, question);
  }
};

// Contextual fallback that references what the student wrote
export const getContextualFallback = (response: string, question: string): string => {
  const lowerResponse = response.toLowerCase();

  // Detect key concepts mentioned in their response
  const mentionedPrediction = lowerResponse.includes('predict') || lowerResponse.includes('pattern') || lowerResponse.includes('guess');
  const mentionedData = lowerResponse.includes('data') || lowerResponse.includes('train') || lowerResponse.includes('learn');
  const mentionedCheck = lowerResponse.includes('check') || lowerResponse.includes('verify') || lowerResponse.includes('review') || lowerResponse.includes('validate');
  const mentionedTool = lowerResponse.includes('tool') || lowerResponse.includes('help') || lowerResponse.includes('assist');
  const mentionedLimitation = lowerResponse.includes('limit') || lowerResponse.includes('can\'t') || lowerResponse.includes('cannot') || lowerResponse.includes('bias');
  const mentionedUnderstanding = lowerResponse.includes('understand') || lowerResponse.includes('know') || lowerResponse.includes('aware');
  const mentionedThinking = lowerResponse.includes('think') || lowerResponse.includes('critical') || lowerResponse.includes('question');

  // Build contextual response based on what they mentioned
  let feedback = "";

  // Best case: They mentioned multiple key concepts
  if (mentionedPrediction && mentionedCheck) {
    feedback = "You've made an important connection between LLMs as prediction systems and the need to verify their outputs. This understanding will help you use AI more effectively.";
  } else if (mentionedTool && mentionedData) {
    feedback = "Your recognition of LLMs as tools shaped by their training data shows thoughtful engagement with how these systems work.";
  } else if (mentionedCheck && mentionedLimitation) {
    feedback = "Noting the importance of verification alongside AI limitations demonstrates critical thinking about responsible AI use.";
  } else if (mentionedUnderstanding && mentionedTool) {
    feedback = "Your reflection on how understanding LLMs informs their use as tools shows you've engaged with the core concepts of this module.";
  }
  // Good case: They mentioned one important concept
  else if (mentionedCheck || lowerResponse.includes('trust') || lowerResponse.includes('responsible')) {
    feedback = "Your emphasis on verifying AI outputs reflects the critical thinking approach we emphasized. Always being skeptical of AI-generated content is key.";
  } else if (mentionedPrediction) {
    feedback = "You're right to focus on how LLMs predict based on patterns. This understanding helps you recognize when AI might make mistakes or hallucinate information.";
  } else if (mentionedData) {
    feedback = "Your attention to training data shows you understand a fundamental aspect of how LLMs work and why they have limitations.";
  } else if (mentionedLimitation || lowerResponse.includes('mistake') || lowerResponse.includes('error')) {
    feedback = "Acknowledging AI limitations is crucial. Your awareness of where LLMs can go wrong will make you a more effective user.";
  } else if (mentionedThinking) {
    feedback = "Your focus on critical thinking when using AI tools demonstrates the mindset we're trying to cultivate in this module.";
  } else if (mentionedTool) {
    feedback = "Viewing AI as a tool rather than an authority figure is an important perspective that will serve you well.";
  }
  // Minimal case: Generic but acknowledges they wrote something
  else {
    feedback = "Thank you for sharing your thoughts on how LLMs work. Keep applying this knowledge when you use AI tools in the future.";
  }

  return feedback;
};

// Legacy random fallback (kept for backward compatibility, but contextual fallback is preferred)
export const getEducationFallback = () => {
  const fallbacks = [
    "Thank you for your reflection. Consider how this concept applies to AI tools you use daily.",
    "Your response has been recorded. Keep thinking critically about how AI impacts your life.",
    "Thanks for sharing your thoughts. As you learn more about AI, you'll develop even deeper insights.",
    "Response received. Continue exploring these AI concepts as you progress through the module.",
    "Thank you for completing this reflection. Keep questioning how AI works and its role in society."
  ];
  return fallbacks[Math.floor(Math.random() * fallbacks.length)];
};