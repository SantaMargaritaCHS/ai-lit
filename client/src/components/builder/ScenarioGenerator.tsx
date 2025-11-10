import React, { useState } from 'react';
import { Sparkles, Loader2, CheckCircle, XCircle, Plus, Trash2, Edit, Save, AlertCircle, Scale } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  generateEthicalScenarios,
  type EthicalScenario,
  type TranscriptData,
} from '@/services/builderAIService';

/**
 * ScenarioGenerator - AI-powered ethical scenario generator from video transcripts
 *
 * Phase 2.4 of Module Builder
 *
 * Features:
 * - Transcript-based AI generation using Gemini API
 * - Multiple ethical frameworks: Catholic Social Teaching, General Ethics, Technology Ethics
 * - Stakeholder identification and perspective analysis
 * - Guiding questions for student analysis
 * - Export to Module Assembly
 *
 * User Flow:
 * 1. Paste transcript or load from Video Segment Editor
 * 2. Configure generation settings (count, ethical framework)
 * 3. Click "Generate Scenarios" → Gemini analyzes transcript
 * 4. Review/edit generated scenarios
 * 5. Export to Module Assembly or download JSON
 */

interface ScenarioGeneratorProps {
  initialTranscript?: TranscriptData;
}

export default function ScenarioGenerator({ initialTranscript }: ScenarioGeneratorProps) {
  // Transcript input
  const [videoTitle, setVideoTitle] = useState(initialTranscript?.videoTitle || '');
  const [videoUrl, setVideoUrl] = useState(initialTranscript?.videoUrl || '');
  const [transcriptText, setTranscriptText] = useState(initialTranscript?.fullText || '');

  // Generation settings
  const [scenarioCount, setScenarioCount] = useState(1);
  const [framework, setFramework] = useState<'catholic-social-teaching' | 'general-ethics' | 'technology-ethics'>('general-ethics');

  // Generation state
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedScenarios, setGeneratedScenarios] = useState<EthicalScenario[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Editing state
  const [editingScenarioIndex, setEditingScenarioIndex] = useState<number | null>(null);
  const [editingScenario, setEditingScenario] = useState<EthicalScenario | null>(null);

  const handleGenerate = async () => {
    // Validation
    if (!transcriptText.trim()) {
      setError('Please provide a video transcript before generating scenarios.');
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

      const scenarios = await generateEthicalScenarios(transcript, {
        count: scenarioCount,
        framework,
      });

      setGeneratedScenarios(scenarios);
      setSuccessMessage(`Successfully generated ${scenarios.length} ethical scenario(s)!`);
    } catch (err: any) {
      console.error('Scenario generation error:', err);
      setError(err.message || 'Failed to generate ethical scenarios. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleEditScenario = (index: number) => {
    setEditingScenarioIndex(index);
    setEditingScenario({ ...generatedScenarios[index] });
  };

  const handleSaveEdit = () => {
    if (editingScenarioIndex !== null && editingScenario) {
      const updated = [...generatedScenarios];
      updated[editingScenarioIndex] = editingScenario;
      setGeneratedScenarios(updated);
      setEditingScenarioIndex(null);
      setEditingScenario(null);
    }
  };

  const handleCancelEdit = () => {
    setEditingScenarioIndex(null);
    setEditingScenario(null);
  };

  const handleDeleteScenario = (index: number) => {
    const updated = generatedScenarios.filter((_, i) => i !== index);
    setGeneratedScenarios(updated);
  };

  const handleExportJSON = () => {
    const exportData = {
      videoTitle,
      videoUrl,
      generatedAt: new Date().toISOString(),
      scenarios: generatedScenarios,
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ethical-scenarios-${videoTitle.toLowerCase().replace(/\s+/g, '-')}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getFrameworkIcon = (fw: string) => {
    switch (fw) {
      case 'catholic-social-teaching':
        return '⛪';
      case 'technology-ethics':
        return '💻';
      case 'general-ethics':
      default:
        return '⚖️';
    }
  };

  const getFrameworkColor = (fw: string) => {
    switch (fw) {
      case 'catholic-social-teaching':
        return 'bg-purple-100 text-purple-700';
      case 'technology-ethics':
        return 'bg-blue-100 text-blue-700';
      case 'general-ethics':
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getFrameworkLabel = (fw: string) => {
    switch (fw) {
      case 'catholic-social-teaching':
        return 'Catholic Social Teaching';
      case 'technology-ethics':
        return 'Technology Ethics';
      case 'general-ethics':
      default:
        return 'General Ethics';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">AI Ethical Scenario Generator</h2>
        <p className="text-sm text-gray-600 mt-1">
          Generate ethical dilemmas and case studies from video transcripts using AI
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
              placeholder="Paste the full video transcript here... AI will analyze this content to generate realistic ethical scenarios."
              value={transcriptText}
              onChange={(e) => setTranscriptText(e.target.value)}
              className="mt-1 font-mono text-sm"
              rows={8}
            />
            <p className="text-xs text-gray-500 mt-1">
              💡 Tip: Scenarios work best when transcript contains ethical themes, real-world examples, or moral considerations.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Generation Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Step 2: Generation Settings</CardTitle>
          <CardDescription className="text-xs">
            Configure AI generation parameters and ethical framework
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="scenario-count" className="text-sm font-medium text-gray-700">
                Number of Scenarios
              </Label>
              <Input
                id="scenario-count"
                type="number"
                min={1}
                max={3}
                value={scenarioCount}
                onChange={(e) => setScenarioCount(parseInt(e.target.value) || 1)}
                className="mt-1"
              />
              <p className="text-xs text-gray-500 mt-1">Recommended: 1-2 scenarios (scenarios are detailed)</p>
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-700">Ethical Framework</Label>
              <div className="space-y-2 mt-1">
                <button
                  onClick={() => setFramework('general-ethics')}
                  className={`w-full px-3 py-2 text-xs font-medium rounded-lg border-2 text-left transition-colors ${
                    framework === 'general-ethics'
                      ? 'border-gray-500 bg-gray-50 text-gray-900'
                      : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                  }`}
                >
                  ⚖️ General Ethics (consequentialism, deontology, virtue ethics)
                </button>
                <button
                  onClick={() => setFramework('technology-ethics')}
                  className={`w-full px-3 py-2 text-xs font-medium rounded-lg border-2 text-left transition-colors ${
                    framework === 'technology-ethics'
                      ? 'border-blue-500 bg-blue-50 text-blue-900'
                      : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                  }`}
                >
                  💻 Technology Ethics (privacy, bias, accountability, transparency)
                </button>
                <button
                  onClick={() => setFramework('catholic-social-teaching')}
                  className={`w-full px-3 py-2 text-xs font-medium rounded-lg border-2 text-left transition-colors ${
                    framework === 'catholic-social-teaching'
                      ? 'border-purple-500 bg-purple-50 text-purple-900'
                      : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                  }`}
                >
                  ⛪ Catholic Social Teaching (human dignity, common good, solidarity)
                </button>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-gray-200">
            <div className="text-xs text-gray-600">
              <strong>AI Model:</strong> Gemini 2.0 Flash • <strong>Focus:</strong> Realistic dilemmas for ages 14-18
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
                  Generate Scenarios
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

      {/* Generated Scenarios */}
      {generatedScenarios.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg">Step 3: Review & Edit Scenarios</CardTitle>
                <CardDescription className="text-xs">
                  {generatedScenarios.length} scenario(s) generated • Click any scenario to edit
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
            {generatedScenarios.map((scenario, index) => (
              <Card key={index} className="border-2 border-gray-200">
                <CardContent className="pt-6">
                  {editingScenarioIndex === index && editingScenario ? (
                    // Edit Mode
                    <div className="space-y-4">
                      <div>
                        <Label className="text-sm font-medium text-gray-700">Scenario Title</Label>
                        <Input
                          value={editingScenario.title}
                          onChange={(e) =>
                            setEditingScenario({ ...editingScenario, title: e.target.value })
                          }
                          className="mt-1 text-sm"
                        />
                      </div>

                      <div>
                        <Label className="text-sm font-medium text-gray-700">Context (2-3 paragraphs)</Label>
                        <Textarea
                          value={editingScenario.context}
                          onChange={(e) =>
                            setEditingScenario({ ...editingScenario, context: e.target.value })
                          }
                          className="mt-1 text-sm"
                          rows={6}
                        />
                      </div>

                      <div>
                        <Label className="text-sm font-medium text-gray-700">The Ethical Dilemma</Label>
                        <Textarea
                          value={editingScenario.dilemma}
                          onChange={(e) =>
                            setEditingScenario({ ...editingScenario, dilemma: e.target.value })
                          }
                          className="mt-1 text-sm"
                          rows={3}
                        />
                      </div>

                      <div>
                        <Label className="text-sm font-medium text-gray-700">Stakeholders (comma-separated)</Label>
                        <Input
                          value={editingScenario.stakeholders.join(', ')}
                          onChange={(e) => {
                            const stakeholders = e.target.value
                              .split(',')
                              .map((s) => s.trim())
                              .filter((s) => s.length > 0);
                            setEditingScenario({ ...editingScenario, stakeholders });
                          }}
                          className="mt-1 text-sm"
                          placeholder="Student, Teacher, Parent, Company"
                        />
                      </div>

                      <div>
                        <Label className="text-sm font-medium text-gray-700">Guiding Questions (one per line)</Label>
                        <Textarea
                          value={editingScenario.guidingQuestions.join('\n')}
                          onChange={(e) => {
                            const questions = e.target.value
                              .split('\n')
                              .filter((q) => q.trim().length > 0);
                            setEditingScenario({ ...editingScenario, guidingQuestions: questions });
                          }}
                          className="mt-1 text-sm"
                          rows={4}
                          placeholder="What are the competing interests?\nWho benefits? Who is harmed?\nWhat principles apply?"
                        />
                      </div>

                      <div>
                        <Label className="text-sm font-medium text-gray-700">Relevant Principles (comma-separated)</Label>
                        <Input
                          value={editingScenario.relevantPrinciples.join(', ')}
                          onChange={(e) => {
                            const principles = e.target.value
                              .split(',')
                              .map((p) => p.trim())
                              .filter((p) => p.length > 0);
                            setEditingScenario({ ...editingScenario, relevantPrinciples: principles });
                          }}
                          className="mt-1 text-sm"
                          placeholder="Privacy, Fairness, Human Dignity"
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
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-2">
                          <Scale className="w-5 h-5 text-purple-600" />
                          <h3 className="text-lg font-bold text-gray-900">{scenario.title}</h3>
                        </div>
                        <div className="flex gap-1">
                          <button
                            onClick={() => handleEditScenario(index)}
                            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded transition-colors"
                            title="Edit scenario"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteScenario(index)}
                            className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded transition-colors"
                            title="Delete scenario"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2 mb-4">
                        <span className={`px-2 py-1 text-xs font-semibold rounded ${getFrameworkColor(framework)}`}>
                          {getFrameworkIcon(framework)} {getFrameworkLabel(framework)}
                        </span>
                        <span className="px-2 py-1 bg-orange-100 text-orange-700 text-xs font-semibold rounded">
                          {scenario.stakeholders.length} stakeholders
                        </span>
                      </div>

                      {/* Context */}
                      <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                        <p className="text-xs font-semibold text-blue-900 mb-2">📖 Context:</p>
                        <p className="text-sm text-gray-800 whitespace-pre-wrap">{scenario.context}</p>
                      </div>

                      {/* The Dilemma */}
                      <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <p className="text-xs font-semibold text-yellow-900 mb-2">⚠️ The Ethical Dilemma:</p>
                        <p className="text-sm font-medium text-gray-900">{scenario.dilemma}</p>
                      </div>

                      {/* Stakeholders */}
                      <div className="mb-4">
                        <p className="text-xs font-semibold text-gray-700 mb-2">👥 Stakeholders:</p>
                        <div className="flex flex-wrap gap-2">
                          {scenario.stakeholders.map((stakeholder, sIdx) => (
                            <span
                              key={sIdx}
                              className="px-3 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                            >
                              {stakeholder}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Guiding Questions */}
                      <div className="mb-4">
                        <p className="text-xs font-semibold text-gray-700 mb-2">❓ Guiding Questions:</p>
                        <ul className="space-y-1">
                          {scenario.guidingQuestions.map((question, qIdx) => (
                            <li key={qIdx} className="text-sm text-gray-700 flex items-start gap-2">
                              <span className="text-purple-600 font-bold">{qIdx + 1}.</span>
                              <span>{question}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Relevant Principles */}
                      <div className="pt-3 border-t border-gray-200">
                        <p className="text-xs font-semibold text-gray-700 mb-2">⚖️ Relevant Ethical Principles:</p>
                        <div className="flex flex-wrap gap-2">
                          {scenario.relevantPrinciples.map((principle, pIdx) => (
                            <span
                              key={pIdx}
                              className="px-3 py-1 bg-purple-100 text-purple-700 text-xs font-medium rounded"
                            >
                              {principle}
                            </span>
                          ))}
                        </div>
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
                Generate More Scenarios
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
                <li>• Review scenarios for realism and age-appropriateness (14-18 years)</li>
                <li>• Ensure genuine ethical dilemmas (no easy right answer)</li>
                <li>• Verify stakeholder perspectives are balanced</li>
                <li>• Export as JSON or copy to Module Assembly for use in activities</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
