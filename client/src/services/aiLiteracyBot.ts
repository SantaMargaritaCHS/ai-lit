/**
 * AI Literacy Bot Service
 * Provides AI-powered educational feedback using Chipp.ai API
 * with fallback to OpenAI for educational AI literacy content
 */

interface AIFeedbackRequest {
  prompt: string;
  userInput: string;
  context: string;
  questionType?: string;
}

interface AIFeedbackResponse {
  response: string;
  source: 'gemini' | 'fallback';
  model?: string;
  error?: string;
}

const CHIPP_API_URL = 'https://app.chipp.ai/api/conversation';
const CHIPP_MODEL_ID = 'ailiteracybot-10010115';

/**
 * Get AI-powered educational feedback with Chipp.ai as primary and OpenAI as fallback
 */
export async function getAILiteracyFeedback(request: AIFeedbackRequest): Promise<AIFeedbackResponse> {
  try {
    const response = await fetch('/api/ai/feedback', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        studentResponse: request.userInput,
        context: request.context,
        topic: request.questionType || 'AI concepts'
      })
    });

    if (!response.ok) {
      console.error('AI feedback error:', response.status, response.statusText);
      throw new Error(`AI feedback API responded with ${response.status}`);
    }

    const data = await response.json();
    
    return {
      response: data.feedback || 'Thank you for your thoughtful response! AI literacy is an important skill to develop.',
      source: 'gemini',
      model: 'gemini-1.5-flash'
    };
  } catch (error) {
    console.error('Error getting AI feedback:', error);
    
    return {
      response: generateFallbackResponse(request.questionType),
      source: 'fallback',
      model: 'static'
    };
  }
}

function generateFallbackResponse(questionType?: string): string {
  const fallbacks: Record<string, string> = {
    'exit-reflection': "Excellent reflection! Your understanding of the 'artificial' in AI shows great critical thinking. AI systems, while powerful, are created by humans and process information differently than we do. Remembering this artificial nature helps us use AI as a tool while maintaining our human judgment and critical thinking skills.",
    'daily-ai': "Excellent examples! You're already more aware of AI in your daily life than most people. Keep noticing these interactions - it will help you understand AI better.",
    'ai-definition': "Good explanation! You've captured the essence of AI. Remember, AI is about pattern recognition and processing information, not true understanding like humans have.",
    'default': "Thank you for your thoughtful response! You're developing great AI literacy skills."
  };
  
  return fallbacks[questionType || 'default'];
}

/**
 * Call Chipp.ai AI Literacy Bot
 */
async function callChippBot(request: AIFeedbackRequest): Promise<string> {
  const response = await fetch(CHIPP_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: CHIPP_MODEL_ID,
      message: formatChippPrompt(request),
      context: request.context
    })
  });

  if (!response.ok) {
    throw new Error(`Chipp API error: ${response.status}`);
  }

  const data = await response.json();
  return data.response || data.message || '';
}

/**
 * Fallback to OpenAI for AI literacy feedback
 */
async function callOpenAI(request: AIFeedbackRequest): Promise<string> {
  const response = await fetch('/api/ai-feedback', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      prompt: formatOpenAIPrompt(request),
      userInput: request.userInput,
      context: request.context
    })
  });

  if (!response.ok) {
    throw new Error(`OpenAI API error: ${response.status}`);
  }

  const data = await response.json();
  return data.feedback || data.response || '';
}

/**
 * Format prompt for Chipp.ai AI Literacy Bot
 */
function formatChippPrompt(request: AIFeedbackRequest): string {
  return `User Response: "${request.userInput}"

Context: ${request.context}
Question Type: ${request.questionType || 'General AI Literacy'}

Please provide educational feedback on this response about AI literacy. Focus on:
- Encouraging thoughtful reflection about AI
- Correcting any misconceptions gently
- Connecting to real-world AI applications
- Age-appropriate language for high school students

${request.prompt}`;
}

/**
 * Format prompt for OpenAI fallback
 */
function formatOpenAIPrompt(request: AIFeedbackRequest): string {
  return `You are an AI literacy educator providing feedback to a high school student. 

Student's response: "${request.userInput}"

Context: ${request.context}
Specific guidance: ${request.prompt}

Provide encouraging, educational feedback that:
1. Acknowledges their thinking
2. Gently corrects misconceptions if any
3. Connects to real-world AI examples
4. Encourages further exploration
5. Uses age-appropriate language

Keep response under 100 words and supportive in tone.`;
}

/**
 * Predefined prompts for different types of AI literacy reflections
 */
export const getReflectionPrompt = (questionType: string): string => {
  const prompts: Record<string, string> = {
    'daily-ai': `Help the student recognize and reflect on AI in their daily life. Encourage them to think about how AI shapes their digital experiences.`,
    
    'ai-definition': `Guide them to understand AI as pattern recognition and prediction systems. Help them articulate AI in simple, accessible terms.`,
    
    'ai-history': `Connect their understanding to AI's historical development. Help them appreciate how AI has evolved over decades.`,
    
    'exit-reflection': `Assess their overall understanding of AI concepts covered. Provide encouragement and suggest areas for continued learning.`,
    
    'bias-awareness': `Help them recognize how AI systems can reflect human biases. Encourage critical thinking about AI fairness.`,
    
    'future-thinking': `Guide them to think thoughtfully about AI's role in their future careers and society.`
  };

  return prompts[questionType] || prompts['daily-ai'];
};

/**
 * Generate reflection questions with AI assistance
 */
export async function generateReflectionQuestion(topic: string, context: string): Promise<string> {
  try {
    const request: AIFeedbackRequest = {
      prompt: `Generate a thought-provoking reflection question about ${topic} for high school students learning about AI literacy.`,
      userInput: topic,
      context: `AI Literacy Education - ${context}`,
      questionType: 'question-generation'
    };

    const response = await getAILiteracyFeedback(request);
    return response.response;
  } catch (error) {
    // Fallback questions
    const fallbackQuestions = [
      "How do you think AI will change your daily life in the next 5 years?",
      "What questions do you still have about how AI works?",
      "Can you think of an AI system you use that you'd like to understand better?"
    ];
    return fallbackQuestions[Math.floor(Math.random() * fallbackQuestions.length)];
  }
}