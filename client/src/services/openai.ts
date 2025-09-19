// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user

export interface SentimentResult {
  prediction: string; // 'positive' | 'negative'
  confidence: number; // 0-1
}

export async function analyzeSentiment(text: string): Promise<SentimentResult> {
  try {
    const response = await fetch('/api/ai/sentiment', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text }),
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Failed to analyze sentiment');
    }

    return await response.json();
  } catch (error) {
    console.error('Failed to analyze sentiment:', error);
    // Fallback to simple keyword analysis
    const positiveWords = ['good', 'great', 'awesome', 'amazing', 'love', 'excellent', 'wonderful', 'fantastic'];
    const negativeWords = ['bad', 'terrible', 'awful', 'hate', 'horrible', 'disappointing', 'sad', 'angry'];
    
    const lowerText = text.toLowerCase();
    const hasPositive = positiveWords.some(word => lowerText.includes(word));
    const hasNegative = negativeWords.some(word => lowerText.includes(word));
    
    if (hasPositive && !hasNegative) {
      return { prediction: 'positive', confidence: 0.7 };
    } else if (hasNegative && !hasPositive) {
      return { prediction: 'negative', confidence: 0.7 };
    } else {
      return { prediction: 'positive', confidence: 0.5 };
    }
  }
}

export async function generateAIContent(prompt: string, type: 'explanation' | 'question' | 'example' = 'explanation'): Promise<string> {
  try {
    const response = await fetch('/api/ai/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt, type }),
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Failed to generate content');
    }

    const data = await response.json();
    return data.content;
  } catch (error) {
    console.error('Failed to generate AI content:', error);
    return "Unable to generate content at this time. Please try again later.";
  }
}

export async function detectHallucination(claim: string, context: string): Promise<{ isHallucination: boolean; confidence: number; explanation: string }> {
  try {
    const response = await fetch('/api/ai/hallucination', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ claim, context }),
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Failed to detect hallucination');
    }

    return await response.json();
  } catch (error) {
    console.error('Failed to detect hallucination:', error);
    return {
      isHallucination: false,
      confidence: 0.5,
      explanation: "Unable to analyze this claim at this time."
    };
  }
}

export async function trainedModelPredict(text: string, trainingContext: string): Promise<{ category: string; confidence: number; reasoning: string }> {
  try {
    const response = await fetch('/api/ai/predict', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text, trainingContext }),
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Failed to get prediction');
    }

    return await response.json();
  } catch (error) {
    console.error('Failed to get model prediction:', error);
    return {
      category: "unknown",
      confidence: 0.5,
      reasoning: "Unable to classify at this time."
    };
  }
}
