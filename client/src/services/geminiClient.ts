import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai';
import { checkEnvVars } from '@/test-env-check';

// Run environment check on load (only in dev mode)
if (import.meta.env.DEV) {
  checkEnvVars();
}

/**
 * Gemini AI Client for Educational Feedback
 *
 * This service provides direct client-side integration with Google's Gemini AI API
 * for generating personalized educational feedback for students.
 *
 * Setup:
 * 1. Get an API key from https://aistudio.google.com/app/apikey
 * 2. Add VITE_GEMINI_API_KEY=your_key_here to your .env file
 * 3. The service automatically falls back to static messages if no API key is configured
 */

// Initialize Gemini AI client (will be null if no API key is configured)
const getGeminiClient = (): GoogleGenerativeAI | null => {
  // Check multiple possible env var names (Replit uses VITE_GOOGLE_API_KEY)
  const apiKey = import.meta.env.VITE_GOOGLE_API_KEY ||
                 import.meta.env.VITE_GEMINI_API_KEY ||
                 import.meta.env.GEMINI_API_KEY;

  if (!apiKey || apiKey === 'your_gemini_api_key_here') {
    console.warn('⚠️ Gemini API key not configured. Using fallback responses.');
    console.warn('💡 Add VITE_GOOGLE_API_KEY to .env or Replit Secrets');
    return null;
  }

  console.log('✅ Gemini API key found - AI feedback enabled!');
  return new GoogleGenerativeAI(apiKey);
};

/**
 * Generate AI-powered educational feedback for student responses
 *
 * @param prompt - The prompt to send to Gemini
 * @param options - Configuration options for the AI model
 * @returns AI-generated response or null if API call fails
 */
export const generateWithGemini = async (
  prompt: string,
  options: {
    temperature?: number;
    maxOutputTokens?: number;
  } = {}
): Promise<string | null> => {
  try {
    const client = getGeminiClient();

    // Return null if no API key configured (will use fallback)
    if (!client) {
      return null;
    }

    // Use Gemini 2.5 Flash for fast, cost-effective responses
    // Updated to use latest available model (gemini-2.5-flash)
    // CRITICAL: Gemini 2.5 uses extensive "thinking tokens" internally (often 400-500+)
    // Must set maxOutputTokens very high to allow room for both thinking + actual response
    const model = client.getGenerativeModel({
      model: 'gemini-2.5-flash',
      generationConfig: {
        temperature: options.temperature ?? 0.7, // Balanced creativity
        maxOutputTokens: options.maxOutputTokens ?? 1500, // High limit to account for thinking (500+) + response (200-300)
      },
      // Safety settings for educational environment with high school students (ages 14-18)
      // These filters protect students from inappropriate content in AI responses
      // Updated thresholds to reduce false positives on legitimate educational discussions
      safetySettings: [
        {
          category: HarmCategory.HARM_CATEGORY_HARASSMENT,
          threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE, // Moderate - allow educational AI discussions
        },
        {
          category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
          threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE, // Moderate - allow critical thinking discussions
        },
        {
          category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
          threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE, // Moderate - educational discussions okay
        },
        {
          category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
          threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE, // Moderate - AI ethics discussions okay
        },
      ],
    });

    const result = await model.generateContent(prompt);
    const response = result.response;

    // Check if response was blocked by safety filters
    if (result.response.promptFeedback?.blockReason) {
      console.warn('⚠️ Content blocked by Gemini safety filters:', result.response.promptFeedback.blockReason);
      console.warn('This typically indicates inappropriate content in the student response');
      return null; // Will trigger fallback message in calling function
    }

    const text = response.text();

    if (!text || text.trim().length === 0) {
      console.error('❌ Gemini returned empty response');
      return null;
    }

    return text.trim();

  } catch (error) {
    console.error('❌ Error calling Gemini API:', error);

    // Log more specific error info for debugging
    if (error instanceof Error) {
      console.error('Error details:', error.message);
    }

    return null;
  }
};

/**
 * Check if Gemini API is configured and available
 */
export const isGeminiConfigured = (): boolean => {
  // Check multiple possible env var names (Replit uses VITE_GOOGLE_API_KEY)
  const apiKey = import.meta.env.VITE_GOOGLE_API_KEY ||
                 import.meta.env.VITE_GEMINI_API_KEY ||
                 import.meta.env.GEMINI_API_KEY;
  return Boolean(apiKey && apiKey !== 'your_gemini_api_key_here');
};
