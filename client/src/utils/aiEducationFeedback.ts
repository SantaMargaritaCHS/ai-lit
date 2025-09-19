export const generateEducationFeedback = async (response: string, question: string) => {
  const educationPrompt = `
You are an encouraging AI literacy educator providing feedback to a teacher who just completed a module on Large Language Models.

The teacher was asked: "${question}"
Their response: "${response}"

Provide brief, encouraging feedback (2-3 sentences) that:
1. Acknowledges their insight
2. Connects to classroom applications
3. Encourages continued learning

Focus on educational contexts only. Reference classroom scenarios, teaching strategies, or student learning.
Do NOT mention Spotify, entertainment platforms, or any non-educational products.
Keep the tone warm, professional, and encouraging.
`;

  try {
    // Use your existing Gemini API integration
    const result = await generateWithGemini(educationPrompt);
    return result || getEducationFallback();
  } catch (error) {
    console.error('Error generating feedback:', error);
    return getEducationFallback();
  }
};

export const getEducationFallback = () => {
  const fallbacks = [
    "Great reflection! Your understanding of LLMs will help you guide students in using AI tools responsibly and effectively in their learning journey.",
    "Excellent insights! You're building the foundation to help your students navigate AI-powered learning tools with confidence and critical thinking.",
    "Thoughtful response! Your growing AI literacy will empower you to integrate these tools meaningfully in your classroom while teaching digital citizenship.",
    "Well done! Understanding how LLMs work is crucial for helping students use AI as a learning tool rather than a shortcut.",
    "Insightful thinking! Your awareness of AI's capabilities and limitations will help you create balanced learning experiences for your students."
  ];
  return fallbacks[Math.floor(Math.random() * fallbacks.length)];
};

// Fallback function for Gemini API calls
const generateWithGemini = async (prompt: string): Promise<string | null> => {
  try {
    const response = await fetch('/api/ai/gemini/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt })
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data.response || null;
  } catch (error) {
    console.error('Gemini API error:', error);
    return null;
  }
};