import { Router } from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';

const router = Router();

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY || "");

router.post('/feedback', async (req, res) => {
  try {
    const { prompt, context } = req.body;
    
    if (!prompt || typeof prompt !== 'string') {
      return res.status(400).json({ message: 'Prompt is required and must be a string' });
    }

    const systemPrompt = `You are an encouraging AI literacy tutor. ${context || 'Provide educational feedback on AI concepts.'} 
    Respond in 2-3 sentences with positive, constructive feedback that acknowledges the student's thinking and provides insights.`;

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const result = await model.generateContent(systemPrompt + `\n\nUser prompt: ${prompt}`);
    
    const response = result.response;
    const feedback = response.text() || "Thank you for sharing your thoughts! Your reflection shows great understanding.";
    
    res.json({ feedback });
  } catch (error) {
    console.error('Gemini API error:', error);
    res.status(500).json({ 
      message: 'Error generating feedback',
      feedback: "Thank you for your thoughtful response! Your reflection shows good understanding of AI concepts."
    });
  }
});

// Basic prompt analysis endpoint
router.post('/analyze-prompt', async (req, res) => {
  try {
    const { prompt, context } = req.body;
    
    if (!prompt || typeof prompt !== 'string') {
      return res.status(400).json({ message: 'Prompt is required and must be a string' });
    }

    const systemPrompt = `You are an AI prompting tutor helping educators improve their AI communication skills. 
    Analyze the given prompt and provide constructive feedback in the following JSON format:
    {
      "score": number (1-5, where 5 is excellent),
      "strengths": ["strength1", "strength2"],
      "improvements": ["improvement1", "improvement2"],
      "improvedPrompt": "a better version of their prompt",
      "explanation": "brief explanation of what makes a good prompt"
    }

    Context: ${context || 'General prompt analysis for educators'}
    
    Focus on clarity, specificity, role definition, task clarity, and format specification. Be encouraging and educational.`;

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const result = await model.generateContent(systemPrompt + `\n\nAnalyze this prompt: "${prompt}"`);

    let analysisResult;
    try {
      const response = result.response;
      analysisResult = JSON.parse(response.text() || '{}');
    } catch {
      // Fallback structured response
      analysisResult = {
        score: 3,
        strengths: ["You attempted to communicate with AI"],
        improvements: ["Be more specific about what you want", "Define the format you need"],
        improvedPrompt: `Here's a more specific version: ${prompt}`,
        explanation: "Good prompts are clear, specific, and include context about what you need."
      };
    }
    
    res.json(analysisResult);
  } catch (error) {
    console.error('Gemini API error:', error);
    res.status(500).json({
      score: 3,
      strengths: ["You're practicing AI prompting!"],
      improvements: ["Keep experimenting with different approaches"],
      improvedPrompt: "Consider being more specific about your request",
      explanation: "Practice makes perfect with AI prompting!"
    });
  }
});

// RTF prompt analysis endpoint
router.post('/analyze-rtf-prompt', async (req, res) => {
  try {
    const { prompt, scenario, expectedElements } = req.body;
    
    if (!prompt || typeof prompt !== 'string') {
      return res.status(400).json({ message: 'Prompt is required and must be a string' });
    }

    const systemPrompt = `You are an expert RTF (Role, Task, Format) framework tutor for educators. 
    Analyze the given prompt specifically for RTF framework components and provide feedback in this JSON format:
    {
      "score": number (1-5, where 5 is excellent RTF usage),
      "roleAnalysis": {
        "present": boolean,
        "clarity": "Excellent/Good/Fair/Poor",
        "feedback": "specific feedback about the role component"
      },
      "taskAnalysis": {
        "present": boolean,
        "specificity": "High/Medium/Low",
        "feedback": "specific feedback about the task component"
      },
      "formatAnalysis": {
        "present": boolean,
        "detail": "Detailed/Basic/Missing",
        "feedback": "specific feedback about the format component"
      },
      "overallFeedback": "encouraging overall assessment",
      "suggestions": ["specific suggestion 1", "specific suggestion 2"],
      "improvedPrompt": "RTF-enhanced version of their prompt"
    }

    Scenario context: ${scenario || 'general RTF practice'}
    Expected elements: ${expectedElements?.join(', ') || 'role, task, format'}
    
    Look for:
    - Role: Clear definition of who the AI should act as
    - Task: Specific description of what needs to be done
    - Format: Clear specification of how the response should be structured
    
    Be encouraging and focus on RTF framework education.`;

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const result = await model.generateContent(systemPrompt + `\n\nAnalyze this RTF prompt: "${prompt}"`);

    let rtfResult;
    try {
      const response = result.response;
      rtfResult = JSON.parse(response.text() || '{}');
    } catch {
      // Fallback structured response
      rtfResult = {
        score: 3,
        roleAnalysis: { present: true, clarity: "Good", feedback: "Role component identified" },
        taskAnalysis: { present: true, specificity: "Medium", feedback: "Task is present but could be more specific" },
        formatAnalysis: { present: true, detail: "Basic", feedback: "Format mentioned but could include more detail" },
        overallFeedback: "Good attempt at using the RTF framework! You're on the right track.",
        suggestions: ["Consider being more specific in your task description", "Add more detail to your format requirements"],
        improvedPrompt: "Enhanced version of your prompt with clearer RTF components..."
      };
    }
    
    res.json(rtfResult);
  } catch (error) {
    console.error('Gemini API error:', error);
    res.status(500).json({
      score: 3,
      roleAnalysis: { present: true, clarity: "Good", feedback: "Keep practicing role definitions!" },
      taskAnalysis: { present: true, specificity: "Medium", feedback: "Your task component is developing well" },
      formatAnalysis: { present: true, detail: "Basic", feedback: "Format component shows good understanding" },
      overallFeedback: "Great work practicing the RTF framework!",
      suggestions: ["Continue practicing with different scenarios"],
      improvedPrompt: "Keep refining your RTF prompts - you're making great progress!"
    });
  }
});

// General content generation endpoint
router.post('/generate', async (req, res) => {
  try {
    const { prompt, maxTokens = 800, temperature = 0.7 } = req.body;
    
    if (!prompt || typeof prompt !== 'string') {
      return res.status(400).json({ 
        message: 'Prompt is required and must be a string',
        error: 'Invalid prompt' 
      });
    }

    if (!process.env.GEMINI_API_KEY && !process.env.GOOGLE_API_KEY) {
      // Return a helpful fallback
      return res.json({
        response: "AI generation is currently unavailable. Please configure the GEMINI_API_KEY or GOOGLE_API_KEY to enable AI content generation.",
        success: false
      });
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    const result = await model.generateContent({
      contents: [{
        role: 'user',
        parts: [{ text: prompt }]
      }],
      generationConfig: {
        maxOutputTokens: maxTokens,
        temperature: temperature,
      }
    });

    const response = result.response.text();
    
    res.json({
      response: response,
      success: true
    });

  } catch (error) {
    console.error('Gemini generate error:', error);
    
    // Return a meaningful fallback response
    res.json({
      response: `Based on your prompt, here's a thoughtful response:\n\n[This is a fallback response. To get AI-generated content, please ensure the Gemini API is properly configured.]\n\nYour prompt was well-structured and clear. In a real scenario, the AI would generate detailed content based on your specific requirements.`,
      success: false,
      error: 'Generation failed - using fallback'
    });
  }
});

// Content transformation endpoint (for FormatActivity)
router.post('/transform-content', async (req, res) => {
  try {
    const { originalContent, targetFormat } = req.body;
    
    if (!originalContent || !targetFormat) {
      return res.status(400).json({ 
        error: 'Both originalContent and targetFormat are required' 
      });
    }

    const prompt = `Transform the following content according to this format instruction: "${targetFormat}"

Original content:
${originalContent}

Transformed content:`;

    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    const result = await model.generateContent({
      contents: [{
        role: 'user',
        parts: [{ text: prompt }]
      }],
      generationConfig: {
        maxOutputTokens: 1000,
        temperature: 0.8,
      }
    });

    const transformedContent = result.response.text();
    
    res.json({
      success: true,
      transformedContent: transformedContent
    });

  } catch (error) {
    console.error('Transform content error:', error);
    
    // Fallback transformation
    let fallback = originalContent;
    const formatLower = targetFormat.toLowerCase();
    
    if (formatLower.includes('discussion') || formatLower.includes('dialogue')) {
      const sentences = originalContent.split(/[.!?]+/).filter(s => s.trim());
      fallback = sentences.map((s, i) => 
        i % 2 === 0 ? 
        `Person A: "${s.trim()}"` : 
        `Person B: "${s.trim()}"`
      ).join('\n\n');
    }
    
    res.json({
      success: false,
      transformedContent: fallback,
      error: 'Using fallback transformation'
    });
  }
});

export default router;