#!/usr/bin/env node

/**
 * Gemini Vision Console Log Analyzer
 *
 * Takes the console logs you've shared and uses Gemini to analyze
 * whether the Gemini API feedback feature is working correctly.
 */

import { GoogleGenerativeAI } from '@google/generative-ai';

// Load from environment (Replit Secrets or .secrets.local)
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

if (!GEMINI_API_KEY) {
  console.error('❌ GEMINI_API_KEY not found');
  console.error('💡 Run: source /home/runner/workspace/.secrets.local');
  process.exit(1);
}

const consoleLogs = `
🔍 Environment Variable Check:
────────────────────────────────────────────────────────────
VITE_GEMINI_API_KEY: ✅ Present (starts with: AIzaSyD1Pv...)
GEMINI_API_KEY: ✅ Present (starts with: AIzaSyD1Pv...)

📋 All available import.meta.env keys:
Array(8)
────────────────────────────────────────────────────────────
`;

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });

async function analyzeConsoleLogs() {
  console.log('🤖 Analyzing console logs with Gemini...\n');

  const prompt = `You are a debugging assistant for a web application that uses the Gemini API for educational feedback.

Here are the console logs from the browser:

\`\`\`
${consoleLogs}
\`\`\`

Based on these logs, answer:

1. **Is the Gemini API key successfully exposed to the browser?**
2. **Are both VITE_GEMINI_API_KEY and GEMINI_API_KEY present?**
3. **What does "Array(8)" mean for import.meta.env keys?**
4. **Is this configuration correct for calling the Gemini API from the browser?**
5. **What are we MISSING from these logs?** (Hint: We don't see any logs from the Gemini client initialization)
6. **Next steps**: What should the user do to test if Gemini feedback actually works?

Be concise and actionable.`;

  try {
    const result = await model.generateContent(prompt);
    const analysis = result.response.text();

    console.log('=' .repeat(60));
    console.log('📊 CONSOLE LOG ANALYSIS');
    console.log('='.repeat(60));
    console.log(analysis);
    console.log('='.repeat(60));
  } catch (error) {
    console.error('❌ Analysis failed:', error.message);
  }
}

analyzeConsoleLogs();
