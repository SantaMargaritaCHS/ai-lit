export const generateAIFeedback = async (
  userInput: string,
  context: string
): Promise<string> => {
  try {
    const response = await fetch('/api/gemini/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt: `You are an educational AI providing specific, personalized feedback to teachers learning about AI.

Context: The teacher is reflecting on ${context}.

The teacher wrote: "${userInput}"

Provide specific, encouraging feedback that:
1. Directly references what they wrote (quote specific parts)
2. Validates their thinking
3. Adds one specific suggestion or extension to their idea
4. Keeps the response under 100 words
5. Uses encouraging but professional language

Do NOT be generic. Reference their specific example or idea.`,
        model: 'gemini-2.5-flash',
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.response || getFallbackResponse(context, userInput);
  } catch (error) {
    console.error('Error generating AI feedback:', error);
    return getFallbackResponse(context, userInput);
  }
};

// More specific fallback responses
const getFallbackResponse = (context: string, userInput: string): string => {
  // Extract key points from user input for more personalized fallback
  const userWords = userInput.toLowerCase();
  
  if (context.includes('oracle myth')) {
    if (userWords.includes('student') || userWords.includes('class')) {
      return `Your awareness of how the AI oracle myth affects your students is crucial. The specific example you shared about ${userWords.includes('assignment') ? 'assignments' : 'classroom dynamics'} shows deep understanding. Consider also discussing with students how AI makes predictions based on patterns, not truth.`;
    }
    return `Excellent reflection on the AI oracle myth. Your insight about "${userInput.slice(0, 50)}..." demonstrates practical understanding. This awareness will help you guide students to verify AI outputs critically.`;
  }
  
  if (context.includes('prediction failures')) {
    if (userWords.includes('check') || userWords.includes('verify')) {
      return `Great thinking about verification! Your approach to have students double-check AI output is essential. Consider creating a specific checklist: 1) Check facts against reliable sources, 2) Look for outdated information, 3) Verify numerical data. This structured approach will build critical AI literacy.`;
    }
    return `Your reflection on AI prediction limitations is insightful. The safeguards you mentioned are a solid start. Consider adding specific examples of what students should look for when AI might be wrong.`;
  }
  
  if (context.includes('bias')) {
    return `Your recognition of potential AI bias in "${userInput.slice(0, 40)}..." is exactly the kind of critical thinking we need. To build on your approach, consider documenting specific instances when you notice bias and sharing these examples with students.`;
  }
  
  // Generic but still somewhat personalized
  return `Thank you for sharing your thoughtful reflection. Your point about "${userInput.slice(0, 50)}..." shows you're thinking critically about AI's role in education. Keep building on these insights!`;
};

// Legacy function for backward compatibility
interface AIFeedbackRequest {
  response: string;
  context: string;
  promptType: string;
}

export async function getAIFeedback(request: AIFeedbackRequest): Promise<string> {
  return generateAIFeedback(request.response, request.context);
}