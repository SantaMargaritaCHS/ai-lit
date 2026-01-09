import React, { useState } from 'react';
import { Link } from 'wouter';
import { ArrowLeft, Copy, Check, Eye, EyeOff, Lock } from 'lucide-react';
import { useDevMode } from '../context/DevModeContext';

const BASE_URL = 'https://AILitStudents.replit.app';

// Comprehensive module data for HTML generation
const moduleData = [
  {
    id: 'what-is-ai',
    title: 'What is AI?',
    icon: '🤖',
    description: "Discover what Artificial Intelligence really is through hands-on activities and interactive games. You'll explore the fascinating world of AI, understand how it differs from regular computer programs, and learn to identify AI in the technology you use every day.",
    whyMatters: "AI is everywhere - from your phone to your favorite apps. Understanding AI helps you make better decisions about technology, prepares you for future careers, and empowers you to use AI tools effectively and responsibly.",
    learningObjectives: [
      "Understand what AI really is and how it works",
      "Spot the difference between AI and regular software",
      "Find AI in your everyday apps and devices"
    ],
    keyTerms: [
      { term: "AI", definition: "Systems that can perform tasks requiring human intelligence" },
      { term: "Machine Learning", definition: "AI that improves through experience" },
      { term: "Algorithm", definition: "Step-by-step instructions for solving problems" },
      { term: "Training Data", definition: "Examples that teach AI to recognize patterns" }
    ]
  },
  {
    id: 'intro-to-gen-ai',
    title: 'Introduction to Generative AI',
    icon: '⚡',
    description: "Explore the world of Generative AI - technology that creates new content like text, images, and music. Learn how these systems work, what makes them different from traditional AI, and how they're changing creative industries.",
    whyMatters: "Generative AI tools like ChatGPT and image generators are transforming how we create and work. Understanding these tools helps you use them effectively, recognize their limitations, and make informed decisions about AI-generated content.",
    learningObjectives: [
      "Understand what makes Generative AI different from other AI",
      "Learn how AI generates text, images, and other content",
      "Recognize AI-generated content and its limitations"
    ],
    keyTerms: [
      { term: "Generative AI", definition: "AI systems that create new content" },
      { term: "Large Language Model", definition: "AI trained on text to understand and generate language" },
      { term: "Prompt", definition: "Instructions you give to AI to get desired output" },
      { term: "Hallucination", definition: "When AI generates false or made-up information" }
    ]
  },
  {
    id: 'responsible-ethical-ai',
    title: 'Responsible and Ethical Use of AI',
    icon: '🛡️',
    description: "Learn the principles and practices for using AI technology responsibly and ethically. Explore real-world scenarios, understand potential harms, and develop skills to be a thoughtful AI user.",
    whyMatters: "AI can have significant impacts on individuals and society. Learning to use AI responsibly helps you avoid harm, protect privacy, and ensure AI benefits everyone fairly.",
    learningObjectives: [
      "Understand ethical considerations when using AI",
      "Recognize potential biases and harms in AI systems",
      "Make responsible decisions about AI use"
    ],
    keyTerms: [
      { term: "AI Ethics", definition: "Principles guiding responsible AI development and use" },
      { term: "Bias", definition: "Unfair preferences in AI outputs based on training data" },
      { term: "Transparency", definition: "Understanding how and why AI makes decisions" },
      { term: "Accountability", definition: "Taking responsibility for AI outcomes" }
    ]
  },
  {
    id: 'understanding-llms',
    title: 'Understanding Large Language Models',
    icon: '📖',
    description: "Dive deep into how Large Language Models (LLMs) work. Learn about the technology behind ChatGPT and similar tools, including how they're trained, what they can and can't do, and why they sometimes make mistakes.",
    whyMatters: "LLMs are becoming essential tools in education and work. Understanding how they work helps you use them more effectively, interpret their outputs critically, and avoid common pitfalls.",
    learningObjectives: [
      "Understand the basic architecture of LLMs",
      "Learn how LLMs are trained on large datasets",
      "Recognize why LLMs can produce incorrect information"
    ],
    keyTerms: [
      { term: "Token", definition: "Pieces of text that LLMs process (words or word parts)" },
      { term: "Context Window", definition: "How much text an LLM can consider at once" },
      { term: "Parameters", definition: "The learned values that determine LLM behavior" },
      { term: "Fine-tuning", definition: "Additional training to specialize an LLM" }
    ]
  },
  {
    id: 'llm-limitations',
    title: 'Critical Thinking: LLM Limitations',
    icon: '⚠️',
    description: "Develop critical thinking skills for evaluating AI outputs. Explore common LLM limitations including hallucinations, knowledge cutoffs, and reasoning errors. Learn strategies to verify AI-generated information.",
    whyMatters: "AI tools can be confidently wrong. Learning to identify limitations helps you avoid spreading misinformation, make better decisions, and use AI as a helpful tool rather than an infallible authority.",
    learningObjectives: [
      "Identify common types of LLM errors and limitations",
      "Develop strategies to verify AI-generated information",
      "Apply critical thinking when using AI tools"
    ],
    keyTerms: [
      { term: "Hallucination", definition: "When AI confidently generates false information" },
      { term: "Knowledge Cutoff", definition: "The date when AI training data ends" },
      { term: "Confabulation", definition: "AI filling gaps with plausible but false details" },
      { term: "Source Verification", definition: "Checking if AI claims are backed by real sources" }
    ]
  },
  {
    id: 'privacy-data-rights',
    title: 'Privacy and Data Rights',
    icon: '🔒',
    description: "Understand how AI systems collect, use, and store your data. Learn about your privacy rights, data protection strategies, and how to make informed decisions about sharing information with AI tools.",
    whyMatters: "Every interaction with AI involves your data. Understanding privacy helps you protect personal information, make informed choices about AI tools, and maintain control over your digital footprint.",
    learningObjectives: [
      "Understand how AI systems collect and use data",
      "Learn your privacy rights regarding AI",
      "Develop strategies to protect your personal information"
    ],
    keyTerms: [
      { term: "Data Collection", definition: "Information AI systems gather from your interactions" },
      { term: "Privacy Policy", definition: "Legal document explaining how your data is used" },
      { term: "Data Rights", definition: "Your legal rights over personal information" },
      { term: "Opt-out", definition: "Choosing not to have your data collected or used" }
    ]
  },
  {
    id: 'ai-environmental-impact',
    title: 'AI Environmental Impact',
    icon: '🌍',
    description: "Explore the environmental costs of AI technology, including energy consumption, water usage, and carbon emissions. Learn about sustainable AI practices and how to make environmentally conscious choices about AI use.",
    whyMatters: "AI systems require massive computing resources that impact our environment. Understanding these costs helps you make informed decisions and advocate for more sustainable AI development.",
    learningObjectives: [
      "Understand the energy costs of training and running AI",
      "Learn about AI's carbon footprint and water usage",
      "Explore sustainable practices for AI development and use"
    ],
    keyTerms: [
      { term: "Carbon Footprint", definition: "Total greenhouse gas emissions from AI systems" },
      { term: "Data Center", definition: "Facilities that house AI computing infrastructure" },
      { term: "Energy Efficiency", definition: "Reducing power needed for AI operations" },
      { term: "Sustainable AI", definition: "AI development that minimizes environmental harm" }
    ]
  },
  {
    id: 'introduction-to-prompting',
    title: 'Introduction to Prompting',
    icon: '💬',
    description: "Master the art of communicating with AI through effective prompts. Learn techniques for getting better results, avoiding common mistakes, and crafting prompts for different purposes.",
    whyMatters: "The quality of AI output depends heavily on how you ask. Learning to prompt effectively helps you get more useful, accurate, and relevant responses from AI tools.",
    learningObjectives: [
      "Understand the elements of effective prompts",
      "Learn techniques for improving AI responses",
      "Practice crafting prompts for different use cases"
    ],
    keyTerms: [
      { term: "Prompt", definition: "Instructions or questions you give to AI" },
      { term: "Context", definition: "Background information that helps AI understand your needs" },
      { term: "Specificity", definition: "Level of detail in your prompt" },
      { term: "Iteration", definition: "Refining prompts based on AI responses" }
    ]
  },
  {
    id: 'ancient-compass-ai-ethics',
    title: 'AI Ethics: An Ancient Compass',
    icon: '🧭',
    description: "Explore AI ethics through the lens of Catholic Social Teaching principles: Human Dignity, Common Good, and Solidarity. Apply ancient wisdom to modern AI challenges and develop a framework for ethical decision-making.",
    whyMatters: "Timeless ethical principles can guide us through new technological challenges. This module helps you develop a moral framework for evaluating AI that respects human dignity and promotes the common good.",
    learningObjectives: [
      "Understand Catholic Social Teaching principles",
      "Apply Human Dignity, Common Good, and Solidarity to AI ethics",
      "Develop a personal framework for ethical AI use"
    ],
    keyTerms: [
      { term: "Human Dignity", definition: "The inherent worth and value of every person" },
      { term: "Common Good", definition: "Benefits that serve the whole community" },
      { term: "Solidarity", definition: "Commitment to support and care for others" },
      { term: "Subsidiarity", definition: "Decisions made at the most local level possible" }
    ]
  }
];

// Generate the Module Description HTML
function generateDescriptionHTML(module: typeof moduleData[0]): string {
  return `<!-- MODULE DESCRIPTION - ${module.title} -->
<div style="
 background: white;
 border-radius: 12px;
 padding: 24px;
 box-shadow: 0 2px 8px rgba(0,0,0,0.06);
 font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
 margin-top: 60px;">
    <!-- Module header with icon -->
    <div style="
 display: flex;
 align-items: center;
 gap: 16px;
 margin-bottom: 20px;">
        <div style="
 width: 48px;
 height: 48px;
 background: linear-gradient(135deg, #E3F2FD 0%, #F3E5F5 100%);
 border-radius: 12px;
 display: flex;
 align-items: center;
 justify-content: center;
 font-size: 28px;
 box-shadow: 0 2px 8px rgba(0,0,0,0.08);">${module.icon}</div>

        <h3 style="
 margin: 0;
 font-size: 24px;
 font-weight: 600;
 color: #1a202c;">${module.title}</h3>
    </div>
    <!-- Overview -->

    <p style="
 margin: 0 0 24px 0;
 color: #4a5568;
 font-size: 16px;
 line-height: 1.6;">${escapeHtml(module.description)}</p>
    <!-- Why this matters -->
    <div style="
 background: #EDE7F6;
 border-left: 4px solid #7C3AED;
 border-radius: 8px;
 padding: 20px;
 margin-bottom: 24px;">

        <h4 style="
 margin: 0 0 8px 0;
 color: #2d3748;
 font-size: 16px;
 font-weight: 600;
 display: flex;
 align-items: center;
 gap: 8px;"><span style="font-size: 18px;">💡</span> Why This Matters</h4>

        <p style="
 margin: 0;
 color: #4a5568;
 font-size: 14px;
 line-height: 1.5;">${escapeHtml(module.whyMatters)}</p>
    </div>
    <!-- How to complete -->
    <div style="
 background: #F0F4F8;
 border-radius: 8px;
 padding: 20px;">

        <h4 style="
 margin: 0 0 12px 0;
 color: #2d3748;
 font-size: 16px;
 font-weight: 600;
 display: flex;
 align-items: center;
 gap: 8px;"><span style="font-size: 18px;">📋</span> How to Complete This Module</h4>

        <ol style="
 margin: 0;
 padding-left: 20px;
 color: #4a5568;
 font-size: 14px;
 line-height: 1.8;">
            <li>Click the link below to start the interactive module</li>
            <li>Work through each activity at your own pace</li>
            <li>Complete the exit ticket at the end</li>
            <li>Download your certificate when finished</li>
            <li>Upload your certificate below to confirm completion</li>
        </ol>
    </div></div>`;
}

// Generate the Landing Page Card HTML
function generateLandingCardHTML(module: typeof moduleData[0]): string {
  const moduleUrl = `${BASE_URL}/module/${module.id}`;

  const objectivesHtml = module.learningObjectives.map(obj =>
    `<div style="display: flex; align-items: flex-start; gap: 12px;"><span style="color: #48BB78; font-size: 20px; line-height: 1.2;">✓</span> <span style="color: #4a5568; font-size: 16px; line-height: 1.5;">&nbsp;${escapeHtml(obj)}&nbsp;</span></div>`
  ).join('');

  const termsHtml = module.keyTerms.map(({ term, definition }) =>
    `<div><span style="font-weight: 600; color: #4C51BF;">${escapeHtml(term)}:</span> <span style="color: #4a5568;">&nbsp;${escapeHtml(definition)}</span></div>`
  ).join('');

  return `<!-- LANDING PAGE - ${module.title} -->
<div style="
    background: white;
    border-radius: 16px;
    box-shadow: 0 8px 32px rgba(0,0,0,0.08);
    overflow: hidden;
    max-width: 650px;
    margin: 20px auto;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;"><a href="${moduleUrl}" target="_blank" rel="noopener noreferrer" style="text-decoration: none; color: inherit; display: block;">&nbsp;<!-- Header with better spacing --><div style="
            background: linear-gradient(135deg, #E3F2FD 0%, #F3E5F5 100%);
            padding: 50px 40px;
            text-align: center;
            position: relative;"><div style="
                font-size: 72px;
                margin-bottom: 36px;
                filter: drop-shadow(0 4px 8px rgba(0,0,0,0.1));">${module.icon}</div><h1 style="
                margin: 0;
                font-size: 38px;
                font-weight: 700;
                color: #1a202c;
                letter-spacing: -0.5px;">${escapeHtml(module.title)}</h1></div><div style="padding: 40px;"><!-- Certificate banner --><div style="
                background: linear-gradient(135deg, #FFF8E1 0%, #FFECB3 100%);
                border-radius: 12px;
                padding: 24px;
                text-align: center;
                margin-bottom: 36px;
                box-shadow: 0 2px 8px rgba(255,193,7,0.15);"><span style="font-size: 40px;">🎓</span><p style="
                    margin: 8px 0 0 0;
                    color: #5D4037;
                    font-size: 17px;
                    font-weight: 600;">Earn your certificate when you complete this module!</p></div><!-- Learning objectives --><div style="margin-bottom: 36px;"><h2 style="
                    margin: 0 0 20px 0;
                    color: #2d3748;
                    font-size: 20px;
                    font-weight: 600;">You&#39;ll learn how to:</h2><div style="display: flex; flex-direction: column; gap: 14px;">${objectivesHtml}</div></div><!-- Key vocabulary section --><div style="
                background: #F7FAFC;
                border-radius: 12px;
                padding: 24px;
                margin-bottom: 32px;"><h3 style="
                    margin: 0 0 16px 0;
                    color: #2d3748;
                    font-size: 18px;
                    font-weight: 600;
                    display: flex;
                    align-items: center;
                    gap: 8px;"><span style="font-size: 20px;">📚</span> Key Terms You&#39;ll Master</h3><div style="display: grid; gap: 14px;">${termsHtml}</div></div><!-- CTA button --><div style="
                background: linear-gradient(135deg, #667EEA 0%, #764BA2 100%);
                color: white;
                padding: 20px;
                border-radius: 12px;
                text-align: center;
                font-weight: 600;
                font-size: 18px;
                cursor: pointer;
                transition: all 0.3s ease;
                box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);">Start Learning Now &rarr;</div></div></a></div>`;
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export default function ExportHTMLPage() {
  const { isDevModeActive } = useDevMode();
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [previewId, setPreviewId] = useState<string | null>(null);
  const [previewType, setPreviewType] = useState<'description' | 'landing' | null>(null);

  const copyToClipboard = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const togglePreview = (moduleId: string, type: 'description' | 'landing') => {
    if (previewId === moduleId && previewType === type) {
      setPreviewId(null);
      setPreviewType(null);
    } else {
      setPreviewId(moduleId);
      setPreviewType(type);
    }
  };

  // Dev mode protection
  if (!isDevModeActive) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md text-center">
          <Lock className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Restricted</h1>
          <p className="text-gray-600 mb-6">
            This page requires Developer Mode to be active.
          </p>
          <p className="text-sm text-gray-500 mb-6">
            Press <kbd className="px-2 py-1 bg-gray-100 rounded text-xs font-mono">Ctrl+Alt+D</kbd> and enter the password to activate Developer Mode.
          </p>
          <Link href="/">
            <a className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </a>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/">
            <a className="p-2 hover:bg-white rounded-lg transition-colors">
              <ArrowLeft className="w-6 h-6 text-gray-600" />
            </a>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Export Module HTML</h1>
            <p className="text-gray-600">Copy HTML snippets for embedding modules in your LMS</p>
          </div>
        </div>

        {/* Info Banner */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
          <p className="text-blue-800 text-sm">
            <strong>Base URL:</strong> {BASE_URL} |
            <strong className="ml-2">Total Modules:</strong> {moduleData.length}
          </p>
        </div>

        {/* Module Cards */}
        <div className="space-y-6">
          {moduleData.map((module) => {
            const descriptionHtml = generateDescriptionHTML(module);
            const landingHtml = generateLandingCardHTML(module);

            return (
              <div key={module.id} className="bg-white rounded-xl shadow-md overflow-hidden">
                {/* Module Header */}
                <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{module.icon}</span>
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900">{module.title}</h2>
                      <p className="text-sm text-gray-500">/module/{module.id}</p>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Description Card */}
                    <div className="border rounded-lg p-4">
                      <h3 className="font-medium text-gray-900 mb-2">Module Description</h3>
                      <p className="text-sm text-gray-500 mb-4">
                        Overview, why it matters, and completion instructions
                      </p>
                      <div className="flex gap-2">
                        <button
                          onClick={() => copyToClipboard(descriptionHtml, `desc-${module.id}`)}
                          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                            copiedId === `desc-${module.id}`
                              ? 'bg-green-100 text-green-700'
                              : 'bg-blue-600 text-white hover:bg-blue-700'
                          }`}
                        >
                          {copiedId === `desc-${module.id}` ? (
                            <>
                              <Check className="w-4 h-4" />
                              Copied!
                            </>
                          ) : (
                            <>
                              <Copy className="w-4 h-4" />
                              Copy HTML
                            </>
                          )}
                        </button>
                        <button
                          onClick={() => togglePreview(module.id, 'description')}
                          className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-gray-700"
                        >
                          {previewId === module.id && previewType === 'description' ? (
                            <>
                              <EyeOff className="w-4 h-4" />
                              Hide
                            </>
                          ) : (
                            <>
                              <Eye className="w-4 h-4" />
                              Preview
                            </>
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Landing Card */}
                    <div className="border rounded-lg p-4">
                      <h3 className="font-medium text-gray-900 mb-2">Landing Page Card</h3>
                      <p className="text-sm text-gray-500 mb-4">
                        Clickable card with objectives and key terms
                      </p>
                      <div className="flex gap-2">
                        <button
                          onClick={() => copyToClipboard(landingHtml, `landing-${module.id}`)}
                          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                            copiedId === `landing-${module.id}`
                              ? 'bg-green-100 text-green-700'
                              : 'bg-purple-600 text-white hover:bg-purple-700'
                          }`}
                        >
                          {copiedId === `landing-${module.id}` ? (
                            <>
                              <Check className="w-4 h-4" />
                              Copied!
                            </>
                          ) : (
                            <>
                              <Copy className="w-4 h-4" />
                              Copy HTML
                            </>
                          )}
                        </button>
                        <button
                          onClick={() => togglePreview(module.id, 'landing')}
                          className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-gray-700"
                        >
                          {previewId === module.id && previewType === 'landing' ? (
                            <>
                              <EyeOff className="w-4 h-4" />
                              Hide
                            </>
                          ) : (
                            <>
                              <Eye className="w-4 h-4" />
                              Preview
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Preview Area */}
                  {previewId === module.id && previewType && (
                    <div className="mt-6 border-t pt-6">
                      <h4 className="text-sm font-medium text-gray-700 mb-3">
                        Preview: {previewType === 'description' ? 'Module Description' : 'Landing Page Card'}
                      </h4>
                      <div
                        className="border rounded-lg p-4 bg-gray-50 overflow-auto max-h-[600px]"
                        dangerouslySetInnerHTML={{
                          __html: previewType === 'description' ? descriptionHtml : landingHtml
                        }}
                      />
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-gray-500 text-sm">
          <p>HTML snippets are formatted for LMS platforms like Canvas, Moodle, or Google Classroom.</p>
        </div>
      </div>
    </div>
  );
}
