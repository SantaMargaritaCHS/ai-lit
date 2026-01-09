import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, Shield, AlertTriangle, CheckCircle, ArrowLeft } from 'lucide-react';
import { useLocation } from 'wouter';

/**
 * OpenAI Privacy Policy Explained for Students
 *
 * This page hosts actual language from OpenAI's privacy policy with student-friendly explanations.
 * Inspired by and credited to Ayan Rayne's educational breakdown.
 *
 * Purpose: Students may not have direct access to OpenAI.com, so we host the actual policy language
 * here with proper attribution and links to official sources.
 */

export default function OpenAIPrivacyExplained() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-800 via-slate-700 to-slate-800 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <Card className="bg-slate-800 border-slate-600">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <CardTitle className="text-white text-3xl mb-3">
                  <Shield className="inline w-8 h-8 mr-3 text-blue-400" />
                  What ChatGPT Really Knows About You
                </CardTitle>
                <p className="text-white text-lg">
                  OpenAI's Privacy Policy Explained in Plain English
                </p>
              </div>
              <Button
                onClick={() => setLocation('/module/privacy-data-rights')}
                variant="ghost"
                className="text-blue-300 hover:text-blue-200"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Module
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-yellow-500/20 p-4 rounded-lg border border-yellow-400/50">
              <p className="text-yellow-100 text-sm">
                <strong>Attribution:</strong> This explanation is inspired by{' '}
                <a
                  href="https://ayanrayne.com/the-openai-privacy-policy-explained-2025/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-yellow-300 hover:text-yellow-200 underline"
                >
                  Ayan Rayne's educational breakdown
                </a>
                . All policy language is quoted directly from{' '}
                <a
                  href="https://openai.com/policies/row-privacy-policy/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-yellow-300 hover:text-yellow-200 underline"
                >
                  OpenAI's official privacy policy
                </a>
                {' '}and{' '}
                <a
                  href="https://help.openai.com/en/articles/5722486-how-your-data-is-used-to-improve-model-performance"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-yellow-300 hover:text-yellow-200 underline"
                >
                  OpenAI Help Center
                </a>.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <a
                href="https://openai.com/policies/row-privacy-policy/"
                target="_blank"
                rel="noopener noreferrer"
                className="block"
              >
                <Card className="bg-slate-700 border-slate-600 hover:border-blue-400 transition-colors h-full">
                  <CardContent className="p-4">
                    <ExternalLink className="w-5 h-5 text-blue-400 mb-2" />
                    <p className="text-white font-semibold">Official OpenAI Privacy Policy</p>
                    <p className="text-gray-100 text-sm mt-1">Read the full legal document</p>
                  </CardContent>
                </Card>
              </a>

              <a
                href="https://help.openai.com/en/articles/5722486-how-your-data-is-used-to-improve-model-performance"
                target="_blank"
                rel="noopener noreferrer"
                className="block"
              >
                <Card className="bg-slate-700 border-slate-600 hover:border-blue-400 transition-colors h-full">
                  <CardContent className="p-4">
                    <ExternalLink className="w-5 h-5 text-blue-400 mb-2" />
                    <p className="text-white font-semibold">OpenAI Help: Data Usage</p>
                    <p className="text-gray-100 text-sm mt-1">How your data trains models</p>
                  </CardContent>
                </Card>
              </a>
            </div>
          </CardContent>
        </Card>

        {/* Section 1: The Big Question */}
        <Card className="bg-slate-800 border-slate-600">
          <CardHeader>
            <CardTitle className="text-white text-2xl">
              The Big Question: Does ChatGPT Use My Conversations for Training?
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-red-900/40 p-6 rounded-lg border-2 border-red-400">
              <AlertTriangle className="w-8 h-8 text-red-400 mb-3" />
              <p className="text-white text-xl font-bold mb-3">
                For Free ChatGPT Users: YES
              </p>
              <div className="bg-black/30 p-4 rounded border-l-4 border-red-400">
                <p className="text-white italic mb-2">
                  <strong className="text-white">Actual OpenAI Language:</strong>
                </p>
                <p className="text-white">
                  "ChatGPT improves by further training on the conversations people have with it,
                  unless you opt out."
                </p>
                <p className="text-white mt-2">
                  "Data submitted through non-API consumer services ChatGPT or DALL·E may be used
                  to improve their models."
                </p>
              </div>
            </div>

            <div className="bg-slate-700 p-6 rounded-lg border border-blue-400">
              <p className="text-white text-lg mb-3 font-bold">
                What This Means in Plain English:
              </p>
              <ul className="text-white space-y-2">
                <li className="flex items-start gap-2">
                  <span className="text-blue-400 mt-1">•</span>
                  <span>When you chat with the free version of ChatGPT, your conversations are saved</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-400 mt-1">•</span>
                  <span>OpenAI uses these conversations to make ChatGPT smarter (model training)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-400 mt-1">•</span>
                  <span>This means information you share could show up in responses to other users</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-400 mt-1">•</span>
                  <span>Your personal details become part of ChatGPT's "memory"</span>
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Section 2: Can You Opt Out? */}
        <Card className="bg-slate-800 border-slate-600">
          <CardHeader>
            <CardTitle className="text-white text-2xl">
              Can You Opt Out of Training?
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-green-900/40 p-6 rounded-lg border-2 border-green-400">
              <CheckCircle className="w-8 h-8 text-green-400 mb-3" />
              <p className="text-white text-xl font-bold mb-3">
                YES - You Can Opt Out!
              </p>
              <div className="bg-black/30 p-4 rounded border-l-4 border-green-400">
                <p className="text-white italic mb-2">
                  <strong className="text-white">Actual OpenAI Language:</strong>
                </p>
                <p className="text-white">
                  "You can opt out of training through their privacy portal by clicking on
                  'do not train on my content.'"
                </p>
                <p className="text-white mt-2">
                  "Chats from Temporary Chat won't appear in history, use or create memories,
                  or be used to train their models."
                </p>
              </div>
            </div>

            <div className="bg-slate-700 p-6 rounded-lg">
              <p className="text-white text-lg font-semibold mb-4">
                How to Protect Your Privacy in ChatGPT:
              </p>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <Badge className="bg-blue-600 text-white mt-1">Step 1</Badge>
                  <div className="flex-1">
                    <p className="text-white font-semibold">Go to Settings → Data Controls</p>
                    <p className="text-white text-sm">Look for "Improve the model for everyone"</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Badge className="bg-blue-600 text-white mt-1">Step 2</Badge>
                  <div className="flex-1">
                    <p className="text-white font-semibold">Turn OFF "Improve the model"</p>
                    <p className="text-white text-sm">This prevents future conversations from being used for training</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Badge className="bg-blue-600 text-white mt-1">Step 3</Badge>
                  <div className="flex-1">
                    <p className="text-white font-semibold">Use Temporary Chat mode</p>
                    <p className="text-white text-sm">These chats are NEVER saved or used for training</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Section 3: What About Paid/School Versions? */}
        <Card className="bg-slate-800 border-slate-600">
          <CardHeader>
            <CardTitle className="text-white text-2xl">
              What About ChatGPT Plus, Team, or Enterprise?
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-green-900/40 p-6 rounded-lg border-2 border-green-400">
              <CheckCircle className="w-8 h-8 text-green-400 mb-3" />
              <p className="text-white text-xl font-bold mb-3">
                Good News: Your Data is Protected by Default
              </p>
              <div className="bg-black/30 p-4 rounded border-l-4 border-green-400">
                <p className="text-white italic mb-2">
                  <strong className="text-white">Actual OpenAI Language:</strong>
                </p>
                <p className="text-white">
                  "By default, OpenAI does not use your business data for training their models.
                  This applies to ChatGPT Team, ChatGPT Enterprise, and API users."
                </p>
                <p className="text-white mt-2">
                  "By default, they do not train on any inputs or outputs from their products for
                  business users, including ChatGPT Business, ChatGPT Enterprise, and the API."
                </p>
              </div>
            </div>

            <div className="bg-slate-700 p-6 rounded-lg border border-blue-400">
              <p className="text-white text-lg mb-3 font-bold">
                What This Means for Students:
              </p>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-red-900/40 p-4 rounded-lg border border-red-400">
                  <p className="text-white font-bold mb-2">❌ ChatGPT Free</p>
                  <p className="text-white text-sm">Your chats train the model (unless you opt out)</p>
                </div>
                <div className="bg-green-900/40 p-4 rounded-lg border border-green-400">
                  <p className="text-white font-bold mb-2">✅ School/Enterprise ChatGPT</p>
                  <p className="text-white text-sm">Your chats are protected by default</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Section 4: Data Retention */}
        <Card className="bg-slate-800 border-slate-600">
          <CardHeader>
            <CardTitle className="text-white text-2xl">
              How Long Does OpenAI Keep Your Data?
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-yellow-500/20 p-6 rounded-lg border-2 border-yellow-400">
              <AlertTriangle className="w-8 h-8 text-yellow-400 mb-3" />
              <div className="bg-black/30 p-4 rounded border-l-4 border-yellow-400">
                <p className="text-white italic mb-2">
                  <strong className="text-white">What OpenAI Says:</strong>
                </p>
                <p className="text-white">
                  "They retain certain data from your interactions, but take steps to reduce
                  the amount of personal information in training datasets before they are used
                  to improve and train models."
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-slate-700 p-4 rounded-lg">
                <p className="text-white font-bold mb-2">If you DELETE your chats:</p>
                <p className="text-white">Data is removed from OpenAI's systems after <strong>30 days</strong></p>
              </div>
              <div className="bg-slate-700 p-4 rounded-lg">
                <p className="text-white font-bold mb-2">If you DON'T delete:</p>
                <p className="text-white">Your chat history is kept <strong>indefinitely</strong></p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Section 5: The Bottom Line */}
        <Card className="bg-slate-800 border-slate-600">
          <CardHeader>
            <CardTitle className="text-white text-2xl">
              The Bottom Line for Students
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-gradient-to-r from-blue-900/50 to-purple-900/50 p-6 rounded-lg border-2 border-blue-400">
              <p className="text-white text-lg leading-relaxed">
                <strong className="text-yellow-300">If you use free ChatGPT:</strong> Your conversations
                are used to train the AI unless you turn it off in settings. Whatever you share today
                could become part of ChatGPT's responses tomorrow.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <Card className="bg-red-900/40 border-red-400">
                <CardContent className="p-4">
                  <p className="text-white font-bold mb-2">🚫 Never Share</p>
                  <ul className="text-white text-sm space-y-1">
                    <li>• Your real name</li>
                    <li>• School name</li>
                    <li>• Personal struggles</li>
                    <li>• Family details</li>
                    <li>• College list</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="bg-yellow-900/40 border-yellow-400">
                <CardContent className="p-4">
                  <p className="text-white font-bold mb-2">⚠️ Use Caution</p>
                  <ul className="text-white text-sm space-y-1">
                    <li>• Turn off training</li>
                    <li>• Use Temporary Chat</li>
                    <li>• Anonymize details</li>
                    <li>• Delete history</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="bg-green-900/40 border-green-400">
                <CardContent className="p-4">
                  <p className="text-white font-bold mb-2">✅ Better Option</p>
                  <ul className="text-white text-sm space-y-1">
                    <li>• School-provided AI</li>
                    <li>• Microsoft Copilot Edu</li>
                    <li>• SchoolAI</li>
                    <li>• Protected by FERPA</li>
                  </ul>
                </CardContent>
              </Card>
            </div>

            <div className="text-center pt-4">
              <Button
                onClick={() => setLocation('/module/privacy-data-rights')}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Back to Privacy & Data Rights Module
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center py-6">
          <p className="text-gray-400 text-sm">
            Last updated: December 18, 2024 | Sources:{' '}
            <a
              href="https://openai.com/policies/row-privacy-policy/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:text-blue-300 underline"
            >
              OpenAI Privacy Policy
            </a>
            {' • '}
            <a
              href="https://help.openai.com/en/articles/5722486-how-your-data-is-used-to-improve-model-performance"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:text-blue-300 underline"
            >
              OpenAI Help Center
            </a>
            {' • '}
            <a
              href="https://ayanrayne.com/the-openai-privacy-policy-explained-2025/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:text-blue-300 underline"
            >
              Inspired by Ayan Rayne
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
