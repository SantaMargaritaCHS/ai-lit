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
 * 2. Add GEMINI_API_KEY=your_key_here to Replit Secrets
 * 3. The service automatically falls back to static messages if no API key is configured
 */

// Initialize Gemini AI client (will be null if no API key is configured)
const getGeminiClient = (): GoogleGenerativeAI | null => {
  // Check for GEMINI_API_KEY (primary) with Vite-prefixed fallbacks
  const apiKey = import.meta.env.GEMINI_API_KEY ||
                 import.meta.env.VITE_GEMINI_API_KEY ||
                 import.meta.env.VITE_GOOGLE_API_KEY;

  if (!apiKey || apiKey === 'your_gemini_api_key_here') {
    console.warn('⚠️ Gemini API key not configured. Using fallback responses.');
    console.warn('💡 Add GEMINI_API_KEY to Replit Secrets');
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

    // Use Gemini 2.5 Flash (stable) for reliable, fast educational feedback
    const model = client.getGenerativeModel({
      model: 'gemini-2.5-flash',
      generationConfig: {
        temperature: options.temperature ?? 0.7,
        maxOutputTokens: options.maxOutputTokens ?? 1500,
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

    // Race the API call against a 15-second timeout to prevent infinite spinning
    const timeoutPromise = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error('Gemini API timed out after 15 seconds')), 15000)
    );
    const result = await Promise.race([model.generateContent(prompt), timeoutPromise]);
    const response = result.response;

    // Check if response was blocked by safety filters
    if (result.response.promptFeedback?.blockReason) {
      console.warn('⚠️ Content blocked by Gemini safety filters:', result.response.promptFeedback.blockReason);
      console.warn('This typically indicates inappropriate content in the student response');
      return null; // Will trigger fallback message in calling function
    }

    const text = response.text();

    if (!text || text.trim().length === 0) {
      // Log diagnostic info for debugging
      console.error('❌ Gemini returned empty response');
      if (response.candidates && response.candidates.length > 0) {
        console.error('Finish reason:', response.candidates[0].finishReason);
        if (response.candidates[0].finishReason === 'MAX_TOKENS') {
          console.error('⚠️ Response was truncated due to MAX_TOKENS limit. Increase maxOutputTokens in the calling code.');
        }
      }
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
  // Check for GEMINI_API_KEY (primary) with Vite-prefixed fallbacks
  const apiKey = import.meta.env.GEMINI_API_KEY ||
                 import.meta.env.VITE_GEMINI_API_KEY ||
                 import.meta.env.VITE_GOOGLE_API_KEY;
  return Boolean(apiKey && apiKey !== 'your_gemini_api_key_here');
};
