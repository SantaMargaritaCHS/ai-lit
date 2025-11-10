import React, { useState } from 'react';
import { Sparkles, Loader2, CheckCircle, XCircle, Plus, Trash2, Edit, Save, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  generateReflectionPrompts,
  type ReflectionPrompt,
  type TranscriptData,
} from '@/services/builderAIService';

/**
 * ReflectionGenerator - AI-powered reflection prompt generator from video transcripts
 *
 * Phase 2.3 of Module Builder
 *
 * Features:
 * - Transcript-based AI generation using Gemini API
 * - Multiple prompt types: personal, critical, application, mixed
 * - Configurable prompt count and type
 * - Edit/review generated prompts
 * - Export to Module Assembly
 *
 * User Flow:
 * 1. Paste transcript or load from Video Segment Editor
 * 2. Configure generation settings (count, type)
 * 3. Click "Generate Prompts" → Gemini analyzes transcript
 * 4. Review/edit generated prompts
 * 5. Export to Module Assembly or download JSON
 */

interface ReflectionGeneratorProps {
  initialTranscript?: TranscriptData;
}

export default function ReflectionGenerator({ initialTranscript }: ReflectionGeneratorProps) {
  // Transcript input
  const [videoTitle, setVideoTitle] = useState(initialTranscript?.videoTitle || '');
  const [videoUrl, setVideoUrl] = useState(initialTranscript?.videoUrl || '');
  const [transcriptText, setTranscriptText] = useState(initialTranscript?.fullText || '');

  // Generation settings
  const [promptCount, setPromptCount] = useState(2);
  const [promptType, setPromptType] = useState<'personal' | 'critical' | 'application' | 'mixed'>('mixed');

  // Generation state
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedPrompts, setGeneratedPrompts] = useState<ReflectionPrompt[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Editing state
  const [editingPromptIndex, setEditingPromptIndex] = useState<number | null>(null);
  const [editingPrompt, setEditingPrompt] = useState<ReflectionPrompt | null>(null);

  const handleGenerate = async () => {
    // Validation
    if (!transcriptText.trim()) {
      setError('Please provide a video transcript before generating prompts.');
      return;
    }
    if (!videoTitle.trim()) {
      setError('Please provide a video title.');
      return;
    }

    setIsGenerating(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const transcript: TranscriptData = {
        fullText: transcriptText,
        videoUrl,
        videoTitle,
      };

      const prompts = await generateReflectionPrompts(transcript, {
        count: promptCount,
        type: promptType,
      });

      setGeneratedPrompts(prompts);
      setSuccessMessage(`Successfully generated ${prompts.length} reflection prompts!`);
    } catch (err: any) {
      console.error('Reflection prompt generation error:', err);
      setError(err.message || 'Failed to generate reflection prompts. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleEditPrompt = (index: number) => {
    setEditingPromptIndex(index);
    setEditingPrompt({ ...generatedPrompts[index] });
  };

  const handleSaveEdit = () => {
    if (editingPromptIndex !== null && editingPrompt) {
      const updated = [...generatedPrompts];
      updated[editingPromptIndex] = editingPrompt;
      setGeneratedPrompts(updated);
      setEditingPromptIndex(null);
      setEditingPrompt(null);
    }
  };

  const handleCancelEdit = () => {
    setEditingPromptIndex(null);
    setEditingPrompt(null);
  };

  const handleDeletePrompt = (index: number) => {
    const updated = generatedPrompts.filter((_, i) => i !== index);
    setGeneratedPrompts(updated);
  };

  const handleExportJSON = () => {
    const exportData = {
      videoTitle,
      videoUrl,
      generatedAt: new Date().toISOString(),
      prompts: generatedPrompts,
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `reflection-prompts-${videoTitle.toLowerCase().replace(/\s+/g, '-')}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getPromptTypeIcon = (type: string) => {
    switch (type) {
      case 'personal':
        return '🎯';
      case 'critical':
        return '🔍';
      case 'application':
        return '🛠️';
      case 'mixed':
      default:
        return '💭';
    }
  };

  const getPromptTypeColor = (type: string) => {
    switch (type) {
      case 'personal':
        return 'bg-blue-100 text-blue-700';
      case 'critical':
        return 'bg-purple-100 text-purple-700';
      case 'application':
        return 'bg-green-100 text-green-700';
      case 'mixed':
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">AI Reflection Prompt Generator</h2>
        <p className="text-sm text-gray-600 mt-1">
          Generate thoughtful reflection prompts from video transcripts using AI
        </p>
      </div>

      {/* Transcript Input */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Step 1: Video Transcript</CardTitle>
          <CardDescription className="text-xs">
            Paste your video transcript or load from Video Segment Editor
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="video-title" className="text-sm font-medium text-gray-700">
                Video Title *
              </Label>
              <Input
                id="video-title"
                type="text"
                placeholder="Introduction to AI Ethics"
                value={videoTitle}
                onChange={(e) => setVideoTitle(e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="video-url" className="text-sm font-medium text-gray-700">
                Video URL (optional)
              </Label>
              <Input
                id="video-url"
                type="text"
                placeholder="https://... or Videos/..."
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                className="mt-1"
              />
            </div>
          </div>
          <div>
            <Label htmlFor="transcript" className="text-sm font-medium text-gray-700">
              Transcript Text *
            </Label>
            <Textarea
              id="transcript"
              placeholder="Paste the full video transcript here... AI will analyze this content to generate relevant reflection prompts."
              value={transcriptText}
              onChange={(e) => setTranscriptText(e.target.value)}
              className="mt-1 font-mono text-sm"
              rows={8}
            />
            <p className="text-xs text-gray-500 mt-1">
              💡 Tip: Include key themes and concepts from the video for better prompt generation.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Generation Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Step 2: Generation Settings</CardTitle>
          <CardDescription className="text-xs">
            Configure AI generation parameters
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="prompt-count" className="text-sm font-medium text-gray-700">
                Number of Prompts
              </Label>
              <Input
                id="prompt-count"
                type="number"
                min={1}
                max={5}
                value={promptCount}
                onChange={(e) => setPromptCount(parseInt(e.target.value) || 2)}
                className="mt-1"
              />
              <p className="text-xs text-gray-500 mt-1">Recommended: 2-3 prompts</p>
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-700">Prompt Type</Label>
              <div className="grid grid-cols-2 gap-2 mt-1">
                <button
                  onClick={() => setPromptType('personal')}
                  className={`px-3 py-2 text-xs font-medium rounded-lg border-2 transition-colors ${
                    promptType === 'personal'
                      ? 'border-blue-500 bg-blue-50 text-blue-900'
                      : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                  }`}
                >
                  🎯 Personal
                </button>
                <button
                  onClick={() => setPromptType('critical')}
                  className={`px-3 py-2 text-xs font-medium rounded-lg border-2 transition-colors ${
                    promptType === 'critical'
                      ? 'border-purple-500 bg-purple-50 text-purple-900'
                      : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                  }`}
                >
                  🔍 Critical
                </button>
                <button
                  onClick={() => setPromptType('application')}
                  className={`px-3 py-2 text-xs font-medium rounded-lg border-2 transition-colors ${
                    promptType === 'application'
                      ? 'border-green-500 bg-green-50 text-green-900'
                      : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                  }`}
                >
                  🛠️ Application
                </button>
                <button
                  onClick={() => setPromptType('mixed')}
                  className={`px-3 py-2 text-xs font-medium rounded-lg border-2 transition-colors ${
                    promptType === 'mixed'
                      ? 'border-gray-500 bg-gray-50 text-gray-900'
                      : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                  }`}
                >
                  💭 Mixed
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                <strong>Personal:</strong> Relate to student's life • <strong>Critical:</strong> Analyze concepts •{' '}
                <strong>Application:</strong> Apply to situations • <strong>Mixed:</strong> Variety
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-gray-200">
            <div className="text-xs text-gray-600">
              <strong>AI Model:</strong> Gemini 2.0 Flash • <strong>Guidelines:</strong> No anthropomorphization,
              student agency preserved
            </div>
            <Button
              onClick={handleGenerate}
              disabled={isGenerating || !transcriptText.trim() || !videoTitle.trim()}
              className="bg-purple-600 hover:bg-purple-700 text-white"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Generate Prompts
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Error/Success Messages */}
      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-red-900 mb-1">Generation Error</h3>
                <p className="text-sm text-red-800">{error}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {successMessage && (
        <Card className="border-green-200 bg-green-50">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-green-900 mb-1">Success!</h3>
                <p className="text-sm text-green-800">{successMessage}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Generated Prompts */}
      {generatedPrompts.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg">Step 3: Review & Edit Prompts</CardTitle>
                <CardDescription className="text-xs">
                  {generatedPrompts.length} prompts generated • Click any prompt to edit
                </CardDescription>
              </div>
              <Button
                onClick={handleExportJSON}
                variant="outline"
                className="border-purple-300 text-purple-700 hover:bg-purple-50"
              >
                Export JSON
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {generatedPrompts.map((prompt, index) => (
              <Card key={index} className="border-2 border-gray-200">
                <CardContent className="pt-6">
                  {editingPromptIndex === index && editingPrompt ? (
                    // Edit Mode
                    <div className="space-y-4">
                      <div>
                        <Label className="text-sm font-medium text-gray-700">Reflection Prompt</Label>
                        <Textarea
                          value={editingPrompt.prompt}
                          onChange={(e) =>
                            setEditingPrompt({ ...editingPrompt, prompt: e.target.value })
                          }
                          className="mt-1 text-sm"
                          rows={3}
                        />
                      </div>

                      <div>
                        <Label className="text-sm font-medium text-gray-700">Guiding Questions (optional)</Label>
                        <Textarea
                          value={editingPrompt.guidingQuestions?.join('\n') || ''}
                          onChange={(e) => {
                            const questions = e.target.value
                              .split('\n')
                              .filter((q) => q.trim().length > 0);
                            setEditingPrompt({ ...editingPrompt, guidingQuestions: questions });
                          }}
                          className="mt-1 text-sm"
                          rows={4}
                          placeholder="One question per line..."
                        />
                        <p className="text-xs text-gray-500 mt-1">One question per line</p>
                      </div>

                      <div>
                        <Label htmlFor="min-response" className="text-sm font-medium text-gray-700">
                          Minimum Response Length (words)
                        </Label>
                        <Input
                          id="min-response"
                          type="number"
                          min={50}
                          max={300}
                          value={editingPrompt.minResponseLength}
                          onChange={(e) =>
                            setEditingPrompt({
                              ...editingPrompt,
                              minResponseLength: parseInt(e.target.value) || 100,
                            })
                          }
                          className="mt-1"
                        />
                      </div>

                      <div>
                        <Label htmlFor="topic" className="text-sm font-medium text-gray-700">
                          Topic/Theme
                        </Label>
                        <Input
                          id="topic"
                          type="text"
                          value={editingPrompt.topic}
                          onChange={(e) =>
                            setEditingPrompt({ ...editingPrompt, topic: e.target.value })
                          }
                          className="mt-1"
                        />
                      </div>

                      <div className="flex gap-2 pt-2">
                        <Button onClick={handleSaveEdit} className="bg-green-600 hover:bg-green-700 text-white">
                          <Save className="w-4 h-4 mr-2" />
                          Save Changes
                        </Button>
                        <Button onClick={handleCancelEdit} variant="outline">
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    // View Mode
                    <div>
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs font-semibold rounded">
                            Prompt {index + 1}
                          </span>
                          <span className={`px-2 py-1 text-xs font-semibold rounded ${getPromptTypeColor(promptType)}`}>
                            {getPromptTypeIcon(promptType)} {promptType}
                          </span>
                          {prompt.topic && (
                            <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded">
                              {prompt.topic}
                            </span>
                          )}
                        </div>
                        <div className="flex gap-1">
                          <button
                            onClick={() => handleEditPrompt(index)}
                            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded transition-colors"
                            title="Edit prompt"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeletePrompt(index)}
                            className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded transition-colors"
                            title="Delete prompt"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-4">
                        <p className="text-sm text-gray-900 font-medium">{prompt.prompt}</p>
                      </div>

                      {prompt.guidingQuestions && prompt.guidingQuestions.length > 0 && (
                        <div className="mb-4">
                          <p className="text-xs font-semibold text-gray-700 mb-2">
                            ❓ Guiding Questions:
                          </p>
                          <ul className="space-y-1">
                            {prompt.guidingQuestions.map((question, qIdx) => (
                              <li key={qIdx} className="text-sm text-gray-700 flex items-start gap-2">
                                <span className="text-purple-600">•</span>
                                <span>{question}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      <div className="pt-3 border-t border-gray-200 text-xs text-gray-600">
                        <strong>Minimum response:</strong> {prompt.minResponseLength} words
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}

            <div className="pt-4 border-t border-gray-200">
              <Button
                onClick={handleGenerate}
                variant="outline"
                className="border-purple-300 text-purple-700 hover:bg-purple-50"
              >
                <Plus className="w-4 h-4 mr-2" />
                Generate More Prompts
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Integration Note */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="text-sm font-semibold text-blue-900 mb-1">Next Steps</h3>
              <ul className="text-xs text-blue-800 space-y-1">
                <li>• Review prompts for alignment with video themes and learning objectives</li>
                <li>• Edit prompts to ensure age-appropriateness (14-18 years)</li>
                <li>• Verify no anthropomorphization of AI technology</li>
                <li>• Export as JSON or copy to Module Assembly</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
