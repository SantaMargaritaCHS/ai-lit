import { generateWithGemini, isGeminiConfigured } from '@/services/geminiClient';

// Check if response is nonsensical or low quality
const isNonsensical = (response: string): boolean => {
  const trimmed = response.trim();

  // Too short (less than 20 characters for meaningful reflection)
  if (trimmed.length < 20) return true;

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

  // Too few words (less than 3 words)
  const words = trimmed.split(/\s+/).filter(w => w.length > 0);
  if (words.length < 3) return true;

  return false;
};

export const generateEducationFeedback = async (response: string, question: string) => {
  // Check for nonsensical input first
  if (isNonsensical(response)) {
    return "It looks like your response is a bit short or unclear. Could you please elaborate more on your thoughts? Share specific ideas, examples, or what you've learned.";
  }

  const educationPrompt = `You are an encouraging AI literacy educator for high school students. A student has answered a reflection question.

The question was: "${question}"
Their response was: "${response}"

Your task is to provide brief, encouraging feedback (2-3 sentences). Please do the following:
1. Acknowledge their thought or effort
2. If their answer is good, connect it to a real-world application or AI concept
3. Encourage them to keep thinking about the topic
4. If the answer seems sarcastic or off-topic, gently guide them back to the question
5. Maintain a warm, encouraging, and age-appropriate tone for high schoolers

Keep your response under 150 words and be genuinely encouraging.`;

  try {
    // Use the new Gemini client (returns null if not configured)
    // CRITICAL: Gemini 2.5 uses internal "thinking" which counts against token limit
    // Thinking often uses 400-500+ tokens, so must set limit very high
    const result = await generateWithGemini(educationPrompt, {
      temperature: 0.8, // More creative and varied responses
      maxOutputTokens: 1500 // High limit: ~500 for thinking + ~300 for response + buffer
    });

    // If Gemini returns a result, use it. Otherwise, fall back.
    if (result) {
      console.log('✅ Using AI-generated feedback');
      return result;
    }

    // Fallback to static messages if Gemini not configured or failed
    console.log('ℹ️ Using fallback feedback (Gemini not available)');
    return getEducationFallback();

  } catch (error) {
    console.error('Error generating feedback:', error);
    return getEducationFallback();
  }
};

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